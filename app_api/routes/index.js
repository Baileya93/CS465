const express = require('express');
const router = express.Router();

// import the controllers
const tripsController = require('../controllers/trips');

// define route for our trips end point
router
    .route('trips')
    .get(tripsController.tripsList);
    .post(tripsController.tripsAddTrip);

// get method routes tripsFindByCode - reqires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode);
    .put(tripsController.tripsUpdateTrip);

module.exports = router;