const mongoose = require("mongoose");
const { customAlphabet } = require('nanoid');
const Room = require("./Room");
const Employee = require("./Employee");
const Customer = require("./Customer");
const Action = require("./Action");
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
const Schema = mongoose.Schema;

const reservationSchema = new mongoose.Schema({
  customId: { type: String, uniqe: true },
  employee: { type: String },
  customers: [{ type: String }],
  rooms: [{ type: String }],
  checkin: { type: String },
  checkout: { type: String },
  adults: { type: Number },
  childs: { type: Number },
  price: { type: Number, required: false },
  note: { type: String, required: false },
  isPaid: { type: Boolean, required: false, default: false },
});

reservationSchema.pre('save', async function (next) {
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

module.exports = mongoose.model("Reservation", reservationSchema);