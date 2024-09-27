const mongoose = require("mongoose");
const { customAlphabet } = require('nanoid');
const Reservation = require("./Reservation");
const Action = require("./Action");
const Customer = require("./Customer");
const Employee = require("./Employee");
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
const Schema = mongoose.Schema;

const roomTypeSchema = new mongoose.Schema({
  roomName: { type: String },
  price: { type: Number },
  adults: { type: Number },
  childs: { type: Number },
  note: { type: String, required: false },
});

const roomSchema = new mongoose.Schema({
  customId: { type: String, uniqe: true },
  roomType: { type: roomTypeSchema, required: true },
  roomNumber: { type: Number },
  note: { type: String, required: false },
  reservations: [{ type: String, required: false }],
});

roomSchema.pre('save', async function (next) {
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

module.exports = mongoose.model("Room", roomSchema);