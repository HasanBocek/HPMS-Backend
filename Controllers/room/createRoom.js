const Room = require("../../models/Room");
const roomValidator = require("./roomValidator");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");
    
const operation = async (req, res) => {
    try {
        const { roomNumber, roomName, price, adults, childs, note } = req.body;
        const newRoom = await Room.create({
            roomNumber,
            note: note || "",
            roomType: {
                roomName,
                price,
                adults,
                childs,
                note: note || ""
            }
        });
        return {
            statusCode: 200,
            status: "success",
            data: newRoom,
            message: successMessages.room.roomCreated,
            newData: newRoom,
            oldData: null
        }
    } catch (err) {
        return {
            statusCode: 500,
            status: "server error",
            error: err.message,
            message: errorMessages.global.serverError,
            newData: null,
            oldData: null
        };
    }
}

const validatorFunctions = (req, res) => {
    return [
        roomValidator.checkRoomNumber(req.body.roomNumber, null),
        validator.isString(req.body.roomName, errorMessages.room.enterRoomName),
        validator.isInteger(req.body.price, errorMessages.global.enterNumericPrice),
        validator.isInteger(req.body.adults, errorMessages.global.enterAdultCount),
        validator.isInteger(req.body.childs, errorMessages.global.enterChildCount)
    ]
}

const createRoom = Template(operation, validatorFunctions, ["CREATE_ROOM"], action = { 
    actionType: "CREATE_ROOM",
    resource: "ROOM"
 })

module.exports = createRoom;