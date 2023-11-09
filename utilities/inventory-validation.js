const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
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
      .isLength({ min: 1 })
      .custom(value => /^[a-zA-Z0-9]+$/.test(value))
      .withMessage("No spaces or special characters are allowed in the classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
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
    .custom(value => /^[a-zA-Z0-9]+$/.test(value))
    .withMessage("Please provide a make."), // on error this message is sent.

    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .custom(value => /^[a-zA-Z0-9]+$/.test(value))
    .withMessage("Please provide a model."), // on error this message is sent.

    body("inv_year")
    .trim()
    .isLength({ max: 4 })
    .withMessage("Please provide a year."), // on error this message is sent.

    body("inv_description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a description."), // on error this message is sent.

    body("inv_price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a price."), // on error this message is sent.

    body("inv_miles")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a mile count."), // on error this message is sent.

    body("inv_color")
    .trim()
    .isLength({ min: 3 })
    .custom(value => /^[a-zA-Z0-9]+$/.test(value))
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
    inv_price,
    inv_miles,
    inv_color,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate