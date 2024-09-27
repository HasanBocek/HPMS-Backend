const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const Room = require('./Room');
const Employee = require('./Employee');
const Customer = require('./Customer');
const Reservation = require('./Reservation');
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const actionSchema = new mongoose.Schema({
    customId: { type: String, uniqe: true },
    employeeId: { type: String },
    employee: { type: Object },
    actionType: { type: String },
    resource: { type: String },
    time: { type: String },
    result: { type: Object },
    requestBody: { type: Object },
    responseBody: { type: Object },
    url: { type: String },
    headers: { type: Object },
    ip: { type: String },
    error: { type: Object },
    failType: { type: String },
    oldData: { type: Object },
    newData: { type: Object },
});
actionSchema.pre('save', async function (next) {
    try {
        if (!this.isNew) return next();
        let id = nanoid();
        let isDuplicate = true;

        while (isDuplicate) {
            const existingDoc = await mongoose.model('Action').findOne({ customId: id });
            const existingDoc2 = await mongoose.model('Customer').findOne({ customId: id });
            const existingDoc3 = await mongoose.model('Employee').findOne({ customId: id });
            const existingDoc4 = await mongoose.model('Reservation').findOne({ customId: id });
            const existingDoc5 = await mongoose.model('Room').findOne({ customId: id });

            if (existingDoc || existingDoc2 || existingDoc3 || existingDoc4 || existingDoc5) {
                id = nanoid();
            } else {
                isDuplicate = false;
            }
        }

        this.customId = id;

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Action', actionSchema);