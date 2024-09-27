const Room = require("../../models/Room");
const roomValidator = require("./roomValidator");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const oldRoom = await Room.findOne({ customId: req.params.id }).exec();

        const newRoom = await Room.findOneAndUpdate({ customId: req.params.id }, {
            roomNumber: req.body.roomNumber,
            roomType: {
                roomName: req.body.roomName,
                price: req.body.price,
                adults: req.body.adults,
                childs: req.body.childs,
                note: req.body.note || ""
            },
        },
        { new: true });
    
        return {
            statusCode: 200,
            status: "success",
            data: newRoom,
            message: successMessages.room.roomEdited,
            newData: newRoom,
            oldData: oldRoom
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
        roomValidator.room(req.params.id),
        roomValidator.checkRoomNumber(req.body.roomNumber, req.params.id),
        validator.isString(req.body.roomName, errorMessages.room.enterRoomName),
        validator.isInteger(req.body.price, errorMessages.global.enterNumericPrice),
        validator.isInteger(req.body.adults, errorMessages.global.enterAdultCount),
        validator.isInteger(req.body.childs, errorMessages.global.enterChildCount)
    ]
}

const editRoom = Template(operation, validatorFunctions, ["EDIT_ROOM"], action = {
    actionType: "EDIT_ROOM",
    resource: "ROOM"
})

module.exports = editRoom;