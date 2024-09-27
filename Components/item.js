var express = require("express");
var router = express.Router();
const { getItem } = require('../Controllers/Item');

router.get("/:id", getItem)

module.exports = router;    