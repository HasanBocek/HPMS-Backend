const mongoose = require("mongoose");
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const roomSchema = new mongoose.Schema({
  customId: { type: String, uniqe: true },
  roomType: {
    roomName: { type: String },
    price: { type: Number },
    adults: { type: Number },
    childs: { type: Number },
    note: { type: String, required: false },
  },
  status: { type: String },
  roomNumber: { type: Number },
  note: { type: String, required: false },
  reservations: [{ type: String, required: false }],
  actionHistory: [{
    before: {
      roomType: {
        roomName: { type: String },
        price: { type: Number },
        adults: { type: Number },
        childs: { type: Number },
        note: { type: String, required: false },
      },
      roomNumber: { type: Number },
      note: { type: String, required: false },
      reservations: [{ type: String, required: false }],
      status: { type: String }
    },
    after: {
      roomType: {
        roomName: { type: String },
        price: { type: Number },
        adults: { type: Number },
        childs: { type: Number },
        note: { type: String, required: false },
      },
      roomNumber: { type: Number },
      note: { type: String, required: false },
      reservations: [{ type: String, required: false }],
      status: { type: String }
    },
    modifiedAt: { type: String }
  }]
});

function isObject(value) {
  return value !== null && typeof value === 'object';
}

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

roomSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const roomId = this.getQuery().customId;
    const oldRoom = await mongoose.model('Room').findOne({ customId: roomId }).lean();

    if (oldRoom && oldRoom.actionHistory) {
      delete oldRoom.actionHistory;
    }
    this._oldRoom = oldRoom;

    next()
  } catch (error) {
    next(error)
  }
})

roomSchema.post('findOneAndUpdate', async function (result, next) {
  try {
    if (!result) return next();
    const after = result.toObject();
    const before = this._oldRoom
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

      if (after.roomType && before.roomType) {
        Object.keys(after.roomType).forEach(key => {
          if (JSON.stringify(before.roomType[key]) !== JSON.stringify(after.roomType[key])) {
            if (!historyEntry.after.roomType) historyEntry.after.roomType = {};
            historyEntry.after.roomType[key] = after.roomType[key];
          }
        });

        if (historyEntry.after.roomType && Object.keys(historyEntry.after.roomType).length === 0) {
          delete historyEntry.after.roomType;
        }
      }

      return historyEntry;
    }

    await mongoose.model('Room').updateOne(
      { _id: result._id },
      { $push: { actionHistory: compareAndLogChanges(before, after) } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Room", roomSchema);