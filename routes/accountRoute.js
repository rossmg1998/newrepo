// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Utilities = require("../utilities/index")

// Route to My Account link
router.get("/login", Utilities.handleErrors(accountController.buildLogin));

// Route to Registration link
router.get("/register", Utilities.handleErrors(accountController.buildRegister));

// Enable the Registration Route
router.post('/register', Utilities.handleErrors(accountController.registerAccount))

module.exports = router;