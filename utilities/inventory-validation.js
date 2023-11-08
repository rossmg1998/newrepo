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
      .custom(value => !/\s/.test(value))
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists.")
        }
      })
      .withMessage("No spaces or special characters are allowed in the classification name."), // on error this message is sent.
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
  
module.exports = validate