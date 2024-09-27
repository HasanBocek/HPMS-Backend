const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reservation = require("./Reservation");
const Room = require("./Room");
const Action = require("./Action");
const Customer = require("./Customer");
const bcrypt = require('bcryptjs');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const contactSchema = new mongoose.Schema({
  tckn: { type: String },
  phone: { type: Number },
  email: { type: String, unique: true },
  address: { type: String },
});

const employeeSchema = new mongoose.Schema({
  customId: { type: String, uniqe: true },
  name: { type: String },
  job: { type: String },
  salary: { type: Number },
  jobStartDate: { type: String },
  jobDescription: { type: String },
  contact: { type: contactSchema },
  note: { type: String, required: false },
  dob: { type: String },
  password: { type: String },
  permissions: [{ type: String }]
});

employeeSchema.pre('save', async function (next) {
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

    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Employee", employeeSchema);