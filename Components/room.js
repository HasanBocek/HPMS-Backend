var express = require("express");
var router = express.Router();
const { createRoom, deleteRoom, editRoom, getRoom, getAllRooms } = require("../Controllers/room")

router.post("/", createRoom);
router.delete("/:id", deleteRoom)
router.put("/:id", editRoom)
router.get("/:id", getRoom)
router.get("/", getAllRooms)

module.exports = router;
