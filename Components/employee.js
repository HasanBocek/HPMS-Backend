var express = require("express");
var router = express.Router();
const { createEmployee, editEmployee, deleteEmployee, getEmployee, getAllEmployees } = require('../Controllers/employee');

router.delete("/:id", deleteEmployee)
router.post("/", createEmployee);
router.put("/:id", editEmployee)
router.get("/:id", getEmployee)
router.get("/", getAllEmployees)

module.exports = router;
