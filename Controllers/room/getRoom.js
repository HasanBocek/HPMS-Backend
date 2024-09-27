const Room = require("../../models/Room");
const roomValidator = require("./roomValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const room = await Room.findOne({ customId: req.params.id }).exec();

        return {
            statusCode: 200,
            status: "success",
            data: room,
            message: successMessages.room.roomSended,
            newData: null,
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
        roomValidator.room(req.params.id)
    ]
}

const getRoom = Template(operation, validatorFunctions, ["GET_ROOM"], action = {
    actionType: "GET_ROOM",
    resource: "ROOM"
})

module.exports = getRoom;