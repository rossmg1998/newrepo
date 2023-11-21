const utilities = require(".")
// const utilities = require("../controllers/invController")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  *************************************
 *  Classification Data Validation Rules
 * ************************************ */
validate.addClassificationRules = () => {
    return [
        // classification_name is required and must be string
      body("classification_name")
      .trim()
      .matches(/^[a-zA-Z0-9]+$/)
      // .custom(value => /^[a-zA-Z0-9]+$/.test(value))
      .withMessage("Please provide a classification name.") // on error this message is sent.
      .isLength({ min: 1 })
      .withMessage("No spaces or special characters are allowed in the classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists.")
        }
      }),
    ]
}

/* **********************************************************
 * Check data and return errors or continue to classification
 * ********************************************************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

/*  *************************************
 *  Inventory Data Validation Rules
 * ************************************ */
validate.addInventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .isLength({ min: 3 })
    // .matches(/^[a-zA-Z0-9]+$/)
    // .custom(value => /^[a-zA-Z0-9]+$/.test(value))
    .withMessage("Please provide a make."), // on error this message is sent.
    // .custom(async (inv_make) => {
    //   const inventoryExists = await inventoryModel.checkExistingInventory(inv_make)
    //   if (inventoryExists){
    //     throw new Error("Inventory exists.")
    //   }
    // }),

    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    // .matches(/^[a-zA-Z0-9]+$/)
    // .custom(value => /^[a-zA-Z0-9]+$/.test(value))
    .withMessage("Please provide a model."), // on error this message is sent.

    body("inv_year")
    .trim()
    .isLength({ max: 4 })
    .isNumeric()
    .withMessage("Please provide a year."), // on error this message is sent.

    body("inv_description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a description."), // on error this message is sent.

    body("inv_image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide an image.")
    .matches(".*\\.(jpg|jpeg|png|webp)$")
    .withMessage("Please provide a valid Image (ending in: .jpg, .jpeg, .png, or .webp)"),

    body("inv_thumbnail")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a thumbnail.")
    .matches(".*\\.(jpg|jpeg|png|webp)$")
    .withMessage("Please provide a valid Image (ending in: .jpg, .jpeg, .png, or .webp)"),
    
    body("inv_price")
    .trim()
    .isLength({ min: 1 })
    // .isNumeric()
    .withMessage("Please provide a price."), // on error this message is sent.

    body("inv_miles")
    .trim()
    .isLength({ min: 1 })
    // .isNumeric()
    .withMessage("Please provide a mile count."), // on error this message is sent.

    body("inv_color")
    .trim()
    .isLength({ min: 3 })
    // .matches(/^[a-zA-Z0-9]+$/)
    // .custom(value => /^[a-zA-Z0-9]+$/.test(value))
    .withMessage("Please provide a color."), // on error this message is sent.
  ]
}

/* **********************************************************
* Check data and return errors or continue to inventory
* ********************************************************* */
validate.checkInventoryData = async (req, res, next) => {
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
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let options = await utilities.buildOptions()
    res.render("inventory/add-inventory", {
      errors,
      title: "New Inventory",
      nav,
      options,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

/* ****************************
* Check update inventory data
* **************************** */
validate.checkUpdateData = async (req, res, next) => {
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
    classification_id,
    inv_id
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let options = await utilities.buildOptions()
    res.render("inventory/add-inventory", {
      errors,
      title: "New Inventory",
      nav,
      options,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    })
    return
  }
  next()
}

module.exports = validate