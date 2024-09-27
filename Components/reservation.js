var express = require("express");
var router = express.Router();
const { createReservation, editReservation, getReservation, deleteReservation, getAllReservations } = require('../Controllers/reservation');

router.post("/", createReservation);
router.delete("/:id", deleteReservation);
router.put("/:id", editReservation)
router.get("/:id", getReservation)
router.get("/", getAllReservations)

module.exports = router;
