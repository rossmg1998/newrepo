// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Utilities = require("../utilities/index")
const invValidate = require("../utilities/inventory-validation")

// Route to management view
router.get("/", Utilities.handleErrors(invController.buildManagement));

// Route to add classification view
router.get("/add-classification", Utilities.handleErrors(invController.buildAddClassification));

// Route to add inventory view
router.get("/add-inventory", Utilities.handleErrors(invController.buildAddInventory));

// Process the classification data
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    Utilities.handleErrors(invController.addClassification)
)

// Process the inventory data
router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    Utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", Utilities.handleErrors(invController.buildByClassificationId));

// Route to inventory item detail view
router.get("/detail/:inv_id", Utilities.handleErrors(invController.buildDetailedView));

// Process the route and return the data as JSON
router.get("/getInventory/:classification_id", Utilities.handleErrors(invController.getInventoryJSON));

// Route to update inventory view
router.get("/edit/:inv_id", Utilities.handleErrors(invController.editInventoryView));

// Route to delete inventory view
router.get("/delete/:inv_id", Utilities.handleErrors(invController.deleteInventoryView));

// Process the edit inventory data
router.post(
    "/update/",
    invValidate.addInventoryRules(),
    invValidate.checkUpdateData,
    Utilities.handleErrors(invController.updateInventory)
)

// Process the delete inventory data
router.post("/delete/", 
    Utilities.handleErrors(invController.deleteInventory));

module.exports = router;