var express = require("express");
var router = express.Router();
const roomComponent = require("../Components/room");
const itemComponent = require("../Components/item");
const customerComponent = require("../Components/Customer");
const employeeComponent = require("../Components/Employee");
const reservationComponent = require("../Components/Reservation");

router.use("/customer", customerComponent);
router.use("/reservation", reservationComponent);
router.use("/room", roomComponent);
router.use("/employee", employeeComponent);
router.use("/item", itemComponent)

module.exports = router;