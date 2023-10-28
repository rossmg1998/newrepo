// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Utilities = require("../utilities/index")

// Route to My Account link
router.get("/login", Utilities.handleErrors(accountController.buildLogin));

module.exports = router;