// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Utilities = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", Utilities.handleErrors(invController.buildByClassificationId));

// Route to inventory item detail view
router.get("/detail/:inv_id", Utilities.handleErrors(invController.buildDetailedView));

module.exports = router;