const Reservation = require("../../models/Reservation");
const Room = require("../../models/Room");
const validator = require("../../Middleware/Validator");
const Customer = require("../../models/Customer");
const reservationValidator = require("./reservationValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;

        const oldReservation = await Reservation.findOne({ customId: req.params.id }).exec();
        const newReservation = await Reservation.findOneAndUpdate(
            { customId: req.params.id },
            { customers, rooms, checkin, checkout, childs, price, isPaid, note: note || "" },
            { new: true }
        );

        if (oldReservation) {
            await Promise.all([
                ...oldReservation.rooms.map(async (roomID) => {
                    const room = await Room.findOne({ customId: roomID });
                    if (room) {
                        room.reservations = room.reservations.filter(reservation => reservation.toString() !== req.params.id);
                        await room.save();
                    }
                }),
                ...oldReservation.customers.map(async (customerID) => {
                    const customer = await Customer.findOne({ customId: customerID });
                    if (customer) {
                        customer.reservations = customer.reservations.filter(reservation => reservation.toString() !== req.params.id);
                        await customer.save();
                    }
                })
            ]);
        }

        await Promise.all([
            ...rooms.map(async (roomID) => {
                const room = await Room.findOne({ customId: roomID });
                if (room && !room.reservations.includes(req.params.id)) {
                    room.reservations.push(req.params.id);
                    await room.save();
                }
            }),
            ...customers.map(async (customerID) => {
                const customer = await Customer.findOne({ customId: customerID });
                if (customer && !customer.reservations.includes(req.params.id)) {
                    customer.reservations.push(req.params.id);
                    await customer.save();
                }
            })
        ]);

        return {
            statusCode: 200,
            status: "success",
            data: newReservation,
            message: successMessages.reservation.reservationEdited,
            newData: newReservation,
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
        reservationValidator.reservation(req.params.id),
        reservationValidator.isValidCustomCustomerIdArray(req.body.customers),
        reservationValidator.isValidCustomRoomIdArray(req.body.rooms),
        reservationValidator.checkDates(req.body.checkin, req.body.checkout, req.params.id, req.body.rooms, req.body.customers),
        validator.isInteger(req.body.adults, errorMessages.global.enterAdultCount),
        validator.isInteger(req.body.childs, errorMessages.global.enterChildCount),
        validator.isInteger(req.body.price, errorMessages.global.enterNumericPrice),
        validator.isBoolean(req.body.isPaid, errorMessages.global.enterBooleanIsPaid),
    ]
}

const editReservation = Template(operation, validatorFunctions, ["EDIT_RESERVATION"], action = {
    actionType: "EDIT_RESERVATION",
    resource: "RESERVATION"
})

module.exports = editReservation;