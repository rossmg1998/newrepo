const jwt = require("jsonwebtoken")
require("dotenv").config()

const bcrypt = require("bcryptjs")

const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* *******************************
*  Build account management view
* ****************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* *******************************
*  Build update account view
* ****************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
  })
}

/* *******************************
*  Process update account data
* ****************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = res.locals.accountData.account_id
  console.log(account_id)
  const accountResult = await accountModel.getAccountById(account_id)
  console.log(accountResult)

  if (!accountResult) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/account", {
    title: "Account",
    nav,
    errors: null,
   })
  return
  }
  try {
    if (accountResult) {
      await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

      res.clearCookie("jwt")
      const accessToken = jwt.sign({
        account_id: accountData.account_id,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email,
        account_type: accountData.account_type,
      },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

      req.flash(
        "notice",
        `Congratulations, your account has been updated.`
      )
      res.status(201).render("account/account", {
        title: "Account",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update-account", {
        title: "Update Account",
        nav,
      })
    }
  } catch (error) {
   return new Error('There was an error updating your account.')
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, buildAccount, accountLogin, buildUpdateAccount, updateAccount }