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
  actionHistory: {
    before: {
      employee: { type: String },
      customers: [{ type: String }],
      rooms: [{ type: String }],
      checkin: { type: String },
      checkout: { type: String },
      adults: { type: Number },
      childs: { type: Number },
      price: { type: Number },
      note: { type: String },
      isPaid: { type: Boolean },
    },
    after: {
      employee: { type: String },
      customers: [{ type: String }],
      rooms: [{ type: String }],
      checkin: { type: String },
      checkout: { type: String },
      adults: { type: Number },
      childs: { type: Number },
      price: { type: Number },
      note: { type: String },
      isPaid: { type: Boolean },
    },
    modifiedAt: { type: String }
  }
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

reservationSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const reservationId = this.getQuery().customId;
    const oldReservation = await mongoose.model('Reservation').findOne({ customId: reservationId }).lean();

    if (oldReservation && oldReservation.actionHistory) {
      delete oldReservation.actionHistory;
    }
    this._oldReservation = oldReservation;

    next()
  } catch (error) {
    next(error)
  }
})

reservationSchema.post('findOneAndUpdate', async function (result, next) {
  try {
    if (!result) return next();
    const after = result.toObject();
    const before = this._oldReservation

    function compareAndLogChanges(before, after) {
      const historyEntry = {
        before: before,
        after: {},
        modifiedAt: new Date().toISOString(),
      };
      const arraysAreEqual = (arr1, arr2) => {
        if (!arr1 && !arr2) return true;
        if (arr1.length !== arr2.length) return false;

        return arr1.every((value, index) => value === arr2[index]);
      };

      Object.keys(after).forEach(key => {
        if (key === "actionHistory") return;
        const isArray = Array.isArray(before[key]) && Array.isArray(after[key]);

        if (isArray) {
          if (!arraysAreEqual(before[key], after[key])) {
            historyEntry.after[key] = after[key];
          }
        } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
          if (!isObject(before[key])) {
            historyEntry.after[key] = after[key];
          }
        }
      });

      return historyEntry;
    }

    await mongoose.model('Reservation').updateOne(
      { _id: result._id },
      { $push: { actionHistory: compareAndLogChanges(before, after) } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Reservation", reservationSchema);