const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reservation = require("./Reservation");
const Room = require("./Room");
const Action = require("./Action");
const Customer = require("./Customer");
const bcrypt = require('bcryptjs');
const _ = require("lodash")
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const employeeSchema = new mongoose.Schema({
  customId: { type: String, uniqe: true },
  name: { type: String },
  job: { type: String },
  salary: { type: Number },
  jobStartDate: { type: String },
  jobDescription: { type: String },
  contact: {
    tckn: { type: String },
    phone: { type: Number },
    email: { type: String, unique: true },
    address: { type: String },
  },
  note: { type: String, required: false },
  dob: { type: String },
  password: { type: String },
  permissions: [{ type: String }],
  actionHistory: [{
    before: {
      name: { type: String },
      job: { type: String },
      salary: { type: Number },
      jobStartDate: { type: String },
      jobDescription: { type: String },
      contact: {
        tckn: { type: String },
        phone: { type: Number },
        email: { type: String },
        address: { type: String },
      },
      note: { type: String, required: false },
      dob: { type: String },
      password: { type: String },
    },
    after: {
      name: { type: String },
      job: { type: String },
      salary: { type: Number },
      jobStartDate: { type: String },
      jobDescription: { type: String },
      contact: {
        tckn: { type: String },
        phone: { type: Number },
        email: { type: String },
        address: { type: String },
      },
      note: { type: String, required: false },
      dob: { type: String },
      password: { type: String },
    },
    modifiedAt: { type: String }
  }]
});

function isObject(value) {
  return value !== null && typeof value === 'object';
}

employeeSchema.pre('save', async function (next) {
  try {
    const isNewRecord = this.isNew;

    if (isNewRecord) {
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
    }

    next();
  } catch (err) {
    next(err);
  }
});

employeeSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const employeeId = this.getQuery().customId;
    const oldEmployee = await mongoose.model('Employee').findOne({ customId: employeeId }).lean();

    if (oldEmployee && oldEmployee.actionHistory) {
      delete oldEmployee.actionHistory;
    }
    this._oldEmployee = oldEmployee;

    next()
  } catch (error) {
    next(error)
  }
})

employeeSchema.post('findOneAndUpdate', async function (result, next) {
  try {
    if (!result) return next();
    const after = result.toObject();
    const before = this._oldEmployee

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

      if (after.contact && before.contact) {
        Object.keys(after.contact).forEach(key => {
          if (JSON.stringify(before.contact[key]) !== JSON.stringify(after.contact[key])) {
            if (!historyEntry.after.contact) historyEntry.after.contact = {};
            historyEntry.after.contact[key] = after.contact[key];
          }
        });

        if (historyEntry.after.contact && Object.keys(historyEntry.after.contact).length === 0) {
          delete historyEntry.after.contact;
        }
      }

      return historyEntry;
    }

    await mongoose.model('Employee').updateOne(
      { _id: result._id },
      { $push: { actionHistory: compareAndLogChanges(before, after) } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Employee", employeeSchema);