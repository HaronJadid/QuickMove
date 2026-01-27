const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');

const upload = require('../middlewares/uploadVehicule');

// Middleware d'authentification à ajouter pour sécuriser les routes (ex: isDriver)
// const { isDriver } = require('../middleware/auth');

// Créer un véhicule (POST) - Max 5 images
router.post('/', upload.array('images', 5), vehiculeController.createVehicule); // Ajouter isDriver si besoin

// Modifier un véhicule (PUT)
router.put('/:id', vehiculeController.editVehicule); // Ajouter isDriver si besoin

// Supprimer un véhicule (DELETE)
router.delete('/:id', vehiculeController.deleteVehicule); // Ajouter isDriver si besoin

// Lister les véhicules d'un livreur (GET)
router.get('/driver/:livreur_id', vehiculeController.getVehiculesByDriver); // ou utiliser req.user.id

module.exports = router;
