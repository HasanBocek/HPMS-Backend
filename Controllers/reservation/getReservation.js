const Reservation = require("../../models/Reservation");
const Template = require("../Template");
const reservationValidator = require("./reservationValidator");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {

        const reservation = await Reservation.findOne({ customId: req.params.id }).exec();

        return {
            statusCode: 200,
            status: "success",
            data: reservation,
            message: successMessages.reservation.reservationSended,
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
    return [reservationValidator.reservation(req.params.id)]
}

const getReservation = Template(operation, validatorFunctions, ["GET_RESERVATION"], action = {
    actionType: "GET_RESERVATION",
    resource: "RESERVATION"
})

module.exports = getReservation;