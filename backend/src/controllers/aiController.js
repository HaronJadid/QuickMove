const db = require("../../database/models");
const { Groq } = require("groq-sdk");
const axios = require("axios");
const puppeteer = require("puppeteer");
const nodeGeocoder = require('node-geocoder');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});



// Configuration
const options = {
    provider: 'openstreetmap', // Vous pouvez aussi utiliser 'google', 'mapbox', etc.
};

const geocoder = nodeGeocoder(options);

const getCoordinates = async (ville) => {
    try {
        const res = await geocoder.geocode(ville);

        // On vérifie si on a reçu un résultat
        if (res.length > 0) {
            return {
                latitude: res[0].latitude,
                longitude: res[0].longitude,
                nom: res[0].formattedAddress
            };
        }
        return null;
    } catch (err) {
        console.error("Erreur lors du géocodage:", err);
    }
}


const getRoadDistance = async (startCoords, endCoords) => {
    try {
        // Format : longitude,latitude;longitude,latitude
        const url = `http://router.project-osrm.org/route/v1/driving/${startCoords.longitude},${startCoords.latitude};${endCoords.longitude},${endCoords.latitude}?overview=false`;

        const response = await axios.get(url);

        if (response.data.code === 'Ok') {
            // OSRM retourne la distance en mètres
            const distanceMetres = response.data.routes[0].distance;
            return distanceMetres / 1000; // Retourne en KM
        }
        return null;
    } catch (error) {
        console.error("Erreur OSRM:", error);
        return null;
    }
};


const fetchPrixGasoil = async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(
        "https://prix-gasoil-maroc.teraedge.ma/prix-carburant-maroc-aujourdhui",
        { waitUntil: "networkidle2", timeout: 60000 }
    );

    // attendre que le contenu React soit rendu
    await new Promise(resolve => setTimeout(resolve, 3000));


    const prix = await page.evaluate(() => {
        const text = document.body.innerText;
        const match = text.match(/GAZOLE\s+(\d+\.\d+)\s*DH/i);
        return match ? parseFloat(match[1]) : null;
    });

    await browser.close();

    if (!prix) {
        throw new Error("Prix gasoil introuvable");
    }

    return prix; // ✅ nombre
};





// Variable globale simple pour le cache (mieux: utiliser la DB)
let CACHED_GASOIL = { prix: 11, lastUpdate: null };

exports.prixEstimee = async (req, res) => {
    const { ville_dep, ville_darr, rating, vehicule } = req.body;
    console.log("ville_dep:",ville_dep,
         "ville_darr:",ville_darr, rating, vehicule);
    try {
        // 1. Lancer les géocodages en PARALLÈLE
        const [cor_dep, cor_arr] = await Promise.all([
            getCoordinates(ville_dep),
            getCoordinates(ville_darr)
        ]);

        if (!cor_dep || !cor_arr) {
            return res.status(404).json({ message: "Villes introuvables." });
        }

        // 2. Calculer la distance ROUTIÈRE et récupérer les DATA en parallèle
        // On ne scrape le gasoil QUE si le cache est vieux (ex: > 24h)
        const tasks = [
            getRoadDistance(cor_dep, cor_arr)
        ];

        // On ajoute le scraping seulement si nécessaire
        // if (!CACHED_GASOIL.lastUpdate || (Date.now() - CACHED_GASOIL.lastUpdate > 86400000)) {
        //     tasks.push(fetchPrixGasoil());
        // }
        // const CACHED_GASOIL = await fetchPrixGasoil();


        const [distance_km, newGasoil] = await Promise.all(tasks);

        // if (newGasoil) {
        //     CACHED_GASOIL = { prix: newGasoil, lastUpdate: Date.now() };
        // }

        if (!distance_km || !vehicule) {
            return res.status(404).json({ message: "Données de trajet ou véhicule manquantes." });
        }

        // 3. Calcul Rating (Logique inchangée mais sécurisée)
        const averageRating = (rating !== undefined && rating !== null)
            ? parseFloat(rating)
            : 5.0;

        // 4. Appel IA avec les bonnes données
        const promptSysteme = `Tu es un algorithme expert en tarification de transport au Maroc.
            Règles :
            - Prix base : 150 DH.
            - Conso estimée : Pick-up/Partner (8L/100km), Fourgon (10L/100km), Camion/Hondai (18L/100km).
            - Coût carburant = (Distance / 100) * Conso * ${CACHED_GASOIL.prix}.
            - Marge chauffeur : +40% sur le carburant.
            - Bonus Rating : Si note > 4.5, ajoute 10% au total.
            
            Instruction : Renvoie UNIQUEMENT le montant final (chiffre entier), sans texte.`; 
        const promptUser = `Distance: ${distance_km}km, Véhicule: ${vehicule}, Rating: ${averageRating}`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: promptSysteme }, { role: "user", content: promptUser }]
        });

        res.status(200).json({
            success: true,
            estimation: completion.choices[0].message.content.trim(),
            details: { distance_km, gasoil: CACHED_GASOIL.prix }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};