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

// Route to update account view
router.get("/update-account/:account_id", Utilities.handleErrors(accountController.buildUpdateAccount));

// Process the update account data
router.post(
    "/update-account",
    regValidate.registrationRules(),
    regValidate.checkUpdateData,
    Utilities.handleErrors(accountController.updateAccount)
)

// Process the password change
// router.post(
//     "/update-account-password",
//     regValidate.changePasswordRules(),
//     regValidate.checkPasswordData,
//     Utilities.handleErrors(accountController.updatePassword)
// )

module.exports = router;