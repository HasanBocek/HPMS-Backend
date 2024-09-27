const Reservation = require("../../models/Reservation");
const Employee = require("../../models/Employee");
const Room = require("../../models/Room");
const Customer = require("../../models/Customer");
const reservationValidator = require("./reservationValidator");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const jwt = require("jsonwebtoken");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;

        const token = req.cookies.jwt || "";
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const employee = await Employee.findById(decodedToken._id);

        const newReservation = await Reservation.create({
            employee: employee.customId,
            customers,
            rooms,
            checkin,
            checkout,
            adults,
            childs,
            price,
            isPaid,
            note: note || ""
        });

        await Promise.all([
            ...rooms.map(async (roomID) => {
              const room = await Room.findOne({customId: roomID});
              room.reservations.push(newReservation.customId);
              await room.save();
            }),
            ...customers.map(async (customerID) => {
              const customer = await Customer.findOne({customId: customerID});
              customer.reservations.push(newReservation.customId);
              await customer.save();
            })
          ]);

        return {
            statusCode: 200,
            status: "success",
            data: newReservation,
            message: successMessages.reservation.reservationCreated,
            newData: newReservation,
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
        reservationValidator.isValidCustomCustomerIdArray(req.body.customers),
        reservationValidator.isValidCustomRoomIdArray(req.body.rooms),
        reservationValidator.checkDates(req.body.checkin, req.body.checkout, null, req.body.rooms, req.body.customers),
        validator.isInteger(req.body.adults, errorMessages.global.enterAdultCount),
        validator.isInteger(req.body.childs, errorMessages.global.enterChildCount),
        validator.isInteger(req.body.price, errorMessages.global.enterNumericPrice),
        validator.isBoolean(req.body.isPaid, errorMessages.global.enterBooleanIsPaid),
    ]
}

const createReservation = Template(operation, validatorFunctions, ["CREATE_RESERVATION"], action = {
    actionType: "CREATE_RESERVATION",
    resource: "RESERVATION"
})

module.exports = createReservation;