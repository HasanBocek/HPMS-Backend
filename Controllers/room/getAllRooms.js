const Room = require("../../models/Room");
const Template = require("../Template");
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const Reservation = require("../../models/Reservation");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const rooms = await Room.find().exec();
        const { checkInDate, checkOutDate } = req.query;
        let availableRooms;
        availableRooms = rooms;
        
        if (checkInDate && checkOutDate) {
            availableRooms = [];
            if (
                !dateRegex.test(checkInDate) ||
                !dateRegex.test(checkOutDate) ||
                new Date(checkInDate).getTime() >= new Date(checkOutDate).getTime() ||
                isNaN(new Date(checkInDate).getTime()) ||
                isNaN(new Date(checkOutDate).getTime())
            ) return errorMessages.global.enterValidCheckDate;
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            for (let room of rooms) {
                let isAvailable = 0;
                for (let reservationID of room.reservations) {
                    const reservation = await Reservation.findOne({ customId: reservationID }).exec();
                    const resCheckIn = new Date(reservation.checkin);
                    const resCheckOut = new Date(reservation.checkout);
                    if (resCheckOut <= checkIn || resCheckIn >= checkOut) {
                        isAvailable += 1;
                    }
                }
                if (isAvailable === room.reservations.length) {
                    availableRooms.push(room);
                }
            }
        }

        return {
            statusCode: 200,
            status: "success",
            data: availableRooms,
            message: successMessages.room.allRoomsSended,
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

const getAllRooms = Template(operation, validatorFunctions, ["GET_ALL_ROOMS"], action = {
    actionType: "GET_ALL_ROOMS",
    resource: "ROOM"
})

module.exports = getAllRooms;