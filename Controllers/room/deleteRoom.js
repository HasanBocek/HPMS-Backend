const Room = require("../../models/Room");
const Reservation = require("../../models/Reservation");
const roomValidator = require("./roomValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const room = await Room.findOne({ customId: req.params.id }).exec();
        if (room.reservations.length > 0) {
            room.reservations.forEach(async reservationId => {
                await Reservation.findOneAndUpdate(
                    { customId: reservationId },
                    { $pull: { rooms: req.params.id } }
                );
            })
        }

        await Room.findOneAndDelete({ customId: req.params.id });
    
        return {
            statusCode: 200,
            status: "success",
            message: successMessages.room.roomDeleted,
            newData: null,
            oldData: room
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

const deleteRoom = Template(operation, validatorFunctions, ["EDIT_ROOM"], action = {
    actionType: "DELETE_ROOM",
    resource: "ROOM"
})

module.exports = deleteRoom;