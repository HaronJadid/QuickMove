const { Groq } = require("groq-sdk");
const axios = require("axios");
const puppeteer = require("puppeteer");
const nodeGeocoder = require('node-geocoder');

// 1. Config Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// 2. Config Geocoder
const options = {
    provider: 'openstreetmap', 
};
const geocoder = nodeGeocoder(options);

// 3. Cache Global Gasoil (Comme discuté)
let GLOBAL_GAS_CACHE = {
    price: 13.50, 
    lastUpdate: 0,
    isUpdating: false
};

// --- FONCTIONS UTILITAIRES ---

// A. Scrapping Intelligent (Cache 24h)
const getGasPrice = async () => {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (GLOBAL_GAS_CACHE.price && (now - GLOBAL_GAS_CACHE.lastUpdate < TWENTY_FOUR_HOURS)) {
        return GLOBAL_GAS_CACHE.price;
    }
    
    if (GLOBAL_GAS_CACHE.isUpdating) return GLOBAL_GAS_CACHE.price;

    GLOBAL_GAS_CACHE.isUpdating = true;
    try {
        console.log("🔄 Mise à jour du prix gasoil...");
        const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.goto("https://prix-gasoil-maroc.teraedge.ma/prix-carburant-maroc-aujourdhui", { waitUntil: "domcontentloaded", timeout: 30000 });
        
        const prix = await page.evaluate(() => {
            const text = document.body.innerText;
            const match = text.match(/GAZOLE\s*[:\-\s]\s*(\d+[\.,]\d+)\s*DH/i);
            return match ? parseFloat(match[1].replace(',', '.')) : null;
        });
        await browser.close();

        if (prix) {
            GLOBAL_GAS_CACHE.price = prix;
            GLOBAL_GAS_CACHE.lastUpdate = Date.now();
        }
    } catch (err) {
        console.error("⚠️ Erreur scraping, utilisation ancien prix.");
    } finally {
        GLOBAL_GAS_CACHE.isUpdating = false;
    }
    return GLOBAL_GAS_CACHE.price;
};

// B. Géocodage
const getCoordinates = async (ville) => {
    try {
        const res = await geocoder.geocode(ville);
        return (res.length > 0) ? { latitude: res[0].latitude, longitude: res[0].longitude } : null;
    } catch (err) { return null; }
};

// C. Distance Routière (OSRM)
const getRoadDistance = async (startCoords, endCoords) => {
    try {
        const url = `http://router.project-osrm.org/route/v1/driving/${startCoords.longitude},${startCoords.latitude};${endCoords.longitude},${endCoords.latitude}?overview=false`;
        const response = await axios.get(url);
        return response.data.code === 'Ok' ? response.data.routes[0].distance / 1000 : null;
    } catch (error) { return null; }
};

// --- COEUR DE L'IA : ANALYSE DES COMMENTAIRES ---
const analyzeDifficultyWithAI = async (comment) => {
    // Si pas de commentaire ou trop court, pas de surcharge
    if (!comment || comment.trim().length < 3) {
        return { surchargePercent: 0, reason: "Aucun commentaire spécial" };
    }

    const promptSysteme = `
    Tu es un expert logistique. Ta tâche est d'analyser le commentaire d'un client pour un déménagement/transport et d'estimer un pourcentage de surcharge (coût supplémentaire).
    
    Règles :
    1. Analyse la difficulté (étages sans ascenseur, objets lourds/fragiles, horaire de nuit, urgence).
    2. Renvoie UNIQUEMENT un objet JSON valide.
    3. 'surcharge': entier entre 0 (standard) et 100 (extrêmement difficile).
    4. 'reason': explication courte en français (max 10 mots).
    
    Exemples :
    - "Juste un petit carton" -> {"surcharge": 0, "reason": "Standard"}
    - "4ème étage sans ascenseur, piano lourd" -> {"surcharge": 40, "reason": "Manutention difficile et étage élevé"}
    - "Attention c'est du verre fragile" -> {"surcharge": 10, "reason": "Objets fragiles"}
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: promptSysteme },
                { role: "user", content: `Commentaire client: "${comment}"` }
            ],
            temperature: 0.1, // Très faible pour être rigoureux
        });

        const rawContent = completion.choices[0].message.content;
        
        // Extraction du JSON (au cas où l'IA ajoute du texte autour)
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return { 
                surchargePercent: result.surcharge || 0, 
                reason: result.reason || "Analyse IA" 
            };
        }
        return { surchargePercent: 0, reason: "Erreur format IA" };

    } catch (error) {
        console.error("Erreur IA Groq:", error);
        return { surchargePercent: 0, reason: "IA indisponible" };
    }
};

// --- CONTROLLER PRINCIPAL ---
exports.prixEstimee = async (req, res) => {
    // On récupère le champ "commentaire" en plus
    const { ville_dep, ville_darr, vehicule = 'Fourgon', rating = 5, commentaire = "" } = req.body;

    try {
        // --- ÉTAPE 1 : Données Techniques (Parallèle) ---
        const [gasPrice, cor_dep, cor_arr] = await Promise.all([
            getGasPrice(),
            getCoordinates(ville_dep),
            getCoordinates(ville_darr)
        ]);

        if (!cor_dep || !cor_arr) return res.status(404).json({ message: "Villes introuvables." });

        const distance_km = await getRoadDistance(cor_dep, cor_arr);
        if (!distance_km) return res.status(404).json({ message: "Trajet introuvable." });


        // --- ÉTAPE 2 : Calcul Déterministe (Le Socle) ---
        // Conso moyenne selon véhicule
        const consumptions = { 'Pick-up': 9, 'Partner': 7, 'Fourgon': 11, 'Camion': 18, 'Hondai': 14, 'Voiture': 6 };
        const conso = consumptions[vehicule] || 10;
        
        // Formule mathématique
        const fuelCost = (distance_km / 100) * conso * gasPrice;
        const wearAndTear = distance_km * 1.5; 
        let basePrice = (fuelCost + wearAndTear) * 2.0; // Marge standard

        // Minimum forfaitaire
        if (basePrice < 150) basePrice = 150;


        // --- ÉTAPE 3 : Analyse IA (La Couche Intelligente) ---
        // On lance l'IA seulement maintenant pour ajuster le prix de base
        const aiAnalysis = await analyzeDifficultyWithAI(commentaire);
        
        // Application de la surcharge IA
        const multiplier = 1 + (aiAnalysis.surchargePercent / 100);
        const priceWithSurcharge = basePrice * multiplier;


        // --- ÉTAPE 4 : Calcul Final (Min/Max) ---
        // On crée l'intervalle sur le prix ajusté par l'IA
        let minPrice = Math.floor(priceWithSurcharge * 0.9);
        let maxPrice = Math.ceil(priceWithSurcharge * 1.15);

        // Arrondi au 5 ou 10 supérieur (plus commercial)
        const roundTo10 = (num) => Math.ceil(num / 10) * 10;

        res.status(200).json({
            success: true,
            details: {
                distance_km: distance_km.toFixed(1),
                gas_price: gasPrice,
                base_price_calc: Math.round(basePrice),
                ai_analysis: {
                    comment_analyzed: commentaire,
                    difficulty_surcharge: `+${aiAnalysis.surchargePercent}%`,
                    reason: aiAnalysis.reason
                }
            },
            estimation: {
                min: roundTo10(minPrice),
                max: roundTo10(maxPrice),
                currency: "DH"
            }
        });

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};