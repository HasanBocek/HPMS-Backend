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
  actionHistory: [{
    before: {
      name: { type: String },
      tckn: { type: String },
      address: { type: String },
      email: { type: String },
      gender: { type: String },
      phone: { type: Number },
      nation: { type: String },
      note: { type: String },
      reservations: [{ type: String }],
    },
    after: {
      name: { type: String },
      tckn: { type: String },
      address: { type: String },
      email: { type: String },
      gender: { type: String },
      phone: { type: Number },
      nation: { type: String },
      note: { type: String },
      reservations: [{ type: String }],
    },
    modifiedAt: { type: String }
  }]
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

customerSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const customerId = this.getQuery().customId;
    const oldCustomer = await mongoose.model('Customer').findOne({ customId: customerId }).lean();

    if (oldCustomer && oldCustomer.actionHistory) {
      delete oldCustomer.actionHistory;
    }
    this._oldCustomer = oldCustomer;

    next()
  } catch (error) {
    next(error)
  }
})

customerSchema.post('findOneAndUpdate', async function (result, next) {
  try {
    if (!result) return next();
    const after = result.toObject();
    const before = this._oldCustomer

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
          historyEntry.after[key] = after[key];
        }
      });

      return historyEntry;
    }

    await mongoose.model('Customer').updateOne(
      { _id: result._id },
      { $push: { actionHistory: compareAndLogChanges(before, after) } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Customer", customerSchema)