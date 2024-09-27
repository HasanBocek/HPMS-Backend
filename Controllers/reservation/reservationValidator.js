const Reservation = require("../../models/Reservation");
const Room = require("../../models/Room");
const Customer = require("../../models/Customer");
const customIdRegex = /^[0-9A-Z]{4}$/
const _ = require("lodash");
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

const { errorMessages } = require("../../Middleware/messages");

const reservationValidator = {
    reservation: async (reservationID) => {
        if (!reservationID || !customIdRegex.test(reservationID) || !await Reservation.findOne({ customId: reservationID }))
            return errorMessages.reservation.selectValidReservation;

        return false;
    },
    isValidCustomRoomIdArray: async (customIdArray) => {
        if (customIdArray.length == 0)
            return errorMessages.room.selectValidRoom;

        for (let i = 0; i < customIdArray.length; i++) {
            if (!customIdRegex.test(customIdArray[i]) || !await Room.findOne({ customId: customIdArray[i] }))
                return errorMessages.room.selectValidRoom;
        }
        return false;
    },
    isValidCustomCustomerIdArray: async (customIdArray) => {
        if (customIdArray.length == 0)
            return errorMessages.customer.selectValidCustomer;

        for (let i = 0; i < customIdArray.length; i++) {
            if (!customIdRegex.test(customIdArray[i]) || !await Customer.findOne({ customId: customIdArray[i] }))
                return errorMessages.customer.selectValidCustomer;
        }
        return false;
    },
    checkDates: async (
        checkinDate,
        checkoutDate,
        reservationID,
        rooms,
        customers
    ) => {
        try {
            if (
                !checkinDate ||
                !checkoutDate ||
                !dateRegex.test(checkinDate) ||
                !dateRegex.test(checkoutDate) ||
                new Date(checkinDate).getTime() >= new Date(checkoutDate).getTime() ||
                isNaN(new Date(checkinDate).getTime()) ||
                isNaN(new Date(checkoutDate).getTime())
            )
                return errorMessages.global.enterValidCheckDate;

            let room = [];
            let reservationFromID;

            if (!reservationID && rooms && Array.isArray(rooms)) {
                if (!Reservation.find({ rooms: { $in: rooms } }))
                    return false;

                room = rooms;
            } else if (reservationID) {
                if (!customIdRegex.test(reservationID) || !Reservation.find({ customId: reservationID }))
                    return errorMessages.reservation.reservationNotFound;

                let reservationObject = await Reservation.findOne({ customId: reservationID }).exec();
                room = reservationObject.rooms;
                reservationFromID = reservationObject;

            } else return errorMessages.reservation.enterRoomOrReservationId;

            const conflictingReservations = await Reservation.find({
                $or: [
                    { rooms: { $in: room } },
                    { customers: { $in: customers } },
                ],
                $and: [
                    {
                        $or: [
                            { checkin: { $gte: checkinDate, $lt: checkoutDate } },
                            { checkin: { $lt: checkinDate }, checkout: { $gt: checkinDate } },
                            { checkout: { $gt: checkinDate, $lte: checkoutDate } },
                        ]
                    }
                ]
            });

            const selfExist = conflictingReservations.some(item => _.isEqual(item, reservationFromID))

            if (selfExist) conflictingReservations--

            if (conflictingReservations.length > 0)
                return errorMessages.reservation.dateConflict;

            return false;
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = reservationValidator;