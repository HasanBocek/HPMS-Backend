const Reservation = require("../../models/Reservation");
const Room = require("../../models/Room");
const Customer = require("../../models/Customer");
const reservationValidator = require("./reservationValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const oldReservation = await Reservation.findOne({ customId: req.params.id }).exec();

        await Reservation.findOneAndDelete({ customId: req.params.id });

        const rooms = await Room.find({});
        const customers = await Customer.find({});

        await Promise.all([
            ...rooms.map(async (room) => {
                room.reservations = room.reservations.filter(reservation => reservation.toString() !== req.params.id);
                await room.save();
            }),
            ...customers.map(async (customer) => {
                customer.reservations = customer.reservations.filter(reservation => reservation.toString() !== req.params.id);
                await customer.save();
            })
        ]);

        return {
            statusCode: 200,
            status: "success",
            data: null,
            message: successMessages.reservation.reservationDeleted,
            newData: null,
            oldData: oldReservation
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
        reservationValidator.reservation(req.params.id)
    ]
}

const deleteReservation = Template(operation, validatorFunctions, ["DELETE_RESERVATION"], action = {
    actionType: "DELETE_RESERVATION",
    resource: "RESERVATION"
})

module.exports = deleteReservation;