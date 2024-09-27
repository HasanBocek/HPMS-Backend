const mongoose = require("mongoose");
const Reservation = require("./Reservation");
const Room = require("./Room");
const Action = require("./Action");
const Employee = require("./Employee");
const Schema = mongoose.Schema;
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const customerSchema = new mongoose.Schema({
  customId: { type: String, uniqe: true },
  name: { type: String },
  tckn: { type: String },
  address: { type: String },
  email: { type: String },
  gender: { type: String },
  phone: { type: Number },
  nation: { type: String },
  note: { type: String, required: false },
  reservations: [{ type: String, required: false }],
});

customerSchema.pre('save', async function (next) {
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

module.exports = mongoose.model("Customer", customerSchema)