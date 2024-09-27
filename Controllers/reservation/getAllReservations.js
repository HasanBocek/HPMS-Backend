const Reservation = require("../../models/Reservation");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {

        const reservations = await Reservation.find().exec();
        
        return {
            statusCode: 200,
            status: "success",
            data: reservations,
            message: successMessages.reservation.allReservationsSended,
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
    return []
}

const getAllReservations = Template(operation, validatorFunctions, ["GET_ALL_RESERVATIONS"], action = {
    actionType: "GET_ALL_RESERVATIONS",
    resource: "RESERVATION"
})

module.exports = getAllReservations;