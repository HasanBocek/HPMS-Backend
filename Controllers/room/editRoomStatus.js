const Room = require("../../models/Room");
const roomValidator = require("./roomValidator");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const oldRoom = await Room.findOne({ customId: req.params.id }).exec();

        const newRoom = await Room.findOneAndUpdate({ customId: req.params.id }, {
            status: req.body.status
        },
            { new: true });

        return {
            statusCode: 200,
            status: "success",
            data: newRoom,
            message: successMessages.room.roomStatusEdited,
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
        roomValidator.checkStatus(req.body.status),
    ]
}

const editRoomStatus = Template(operation, validatorFunctions, ["EDIT_ROOM_STATUS"], action = {
    actionType: "EDIT_ROOM_STATUS",
    resource: "ROOM"
})

module.exports = editRoomStatus;