var express = require("express");
var router = express.Router();
const { createCustomer, getCustomer, editCustomer, getAllCustomers, deleteCustomer } = require('../Controllers/customer');

router.delete("/:id", deleteCustomer)
router.post("/", createCustomer);
router.put("/:id", editCustomer)
router.get("/:id", getCustomer)
router.get("/", getAllCustomers)

module.exports = router;
