const Room = require("../../models/Room");
const customIdRegex = /^[0-9A-Z]{4}$/
const { errorMessages } = require("../../Middleware/messages");

const roomValidator = {
    room: async (roomID) => {
        if (!roomID || !customIdRegex.test(roomID) || !await Room.findOne({customId: roomID}))
            return errorMessages.room.selectValidRoom;

        return false;
    },
    checkRoomNumber: async (roomNumber, roomID) => {
        if (roomID) {
            if (!customIdRegex.test(roomID))
                return false;

            const roomFromID = await Room.findOne({customId: roomID});
            if (roomFromID.roomNumber == roomNumber)
                return false;
        }
        if (!roomNumber || !Number.isInteger(roomNumber) || await Room.findOne({ roomNumber }))
            return errorMessages.room.enterUnusedRoomNumber;

        return false
    },
};

module.exports = roomValidator;