// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Utilities = require("../utilities/index")

// Route to account management view
router.get("/", Utilities.handleErrors(accountController.buildAccount));

// Route to My Account link
router.get("/login", Utilities.handleErrors(accountController.buildLogin));

// Route to Registration link
router.get("/register", Utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    Utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    Utilities.handleErrors(accountController.accountLogin)
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
)

module.exports = router;