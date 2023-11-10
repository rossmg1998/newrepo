const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
} catch (error) {
  console.error("getInventoryItemDetail error " + error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error");
  }
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildDetailedView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getDetailedView(inv_id)
    const grid = await utilities.buildDetailedGrid(data)
    let nav = await utilities.getNav()

    const inv_make = data[0].inv_make
    const inv_model = data[0].inv_model
    // const inv_year = data[0].inv_year
    console.log(data[0])

    res.render("./inventory/classification", {
      title: inv_make + ' ' + inv_model,
      nav,
      grid,
      errors: null,
    })
} catch (error) {
  console.error("getInventoryItemDetail error " + error);
  // Handle the error and send an appropriate response
  res.status(500).send("Internal Server Error");
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const classResult = await invModel.addNavigationItem(classification_name)

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve successfully added ${classification_name}.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice", 
      `Sorry, add new classification failed.`
    )
    res.status(501).render("inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.buildOptions()
  res.render("./inventory/add-inventory", {
    title: "New Inventory",
    nav,
    options,
    errors: null,
  })
}

/* ****************************************
*  Process Inventory
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.buildOptions()
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image, 
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  
   const classResult = await invModel.addInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image, 
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
   )

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve successfully added ${inv_make}.`
    )
    res.redirect("/inv/")
  } else {
    req.flash(
      "notice", 
      `Sorry, add new inventory failed.`
    )
    res.status(501).render("inventory/add-inventory", {
      title: "New Inventory",
      nav,
      options,
      errors: null,
    })
  }
}

module.exports = invCont