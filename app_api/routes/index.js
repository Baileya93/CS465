const express = require('express');
const router = express.Router();

// import the controllers
const tripsController = require('../controllers/trips');

// define route for our trips end point
router
    .route('trips')
    .get(tripsController.tripsList);

// get method routes tripsFindByCode - reqires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode);

module.exports = router;