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
    const itemDetail = await invModel.getDetailedView(inv_id)
    const grid = await utilities.buildDetailedGrid(itemDetail)
    let nav = await utilities.getNav()

    // const inv_make = itemDetail[0].inv_make
    // const inv_model = itemDetail[0].inv_model
    // const inv_year = itemDetail[0].inv_year
    // console.log(itemDetail[0])

    res.render("./inventory/vehicle-detail", {
      title: `${itemDetail.inv_make} ${itemDetail.inv_model}`,
      nav,
      itemDetail: grid,
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
  const options = await utilities.buildOptions()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    options,
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
      title: "Inventory Management",
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  console.log(classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailedView(inv_id)
  let options = await utilities.buildOptions(itemData.classification_id)
  console.log(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    options: options,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    let options = await utilities.buildOptions(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    options,
    errors: null,
    inv_id,
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
    })
  }
}

module.exports = invCont