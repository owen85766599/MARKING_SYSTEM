const mongoose = require('mongoose');
const db = require('./db');

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  create_date: {
    type: Date,
    default: Date.now
  },
  marks: [
    {
      markName: String,
      id: String,
      owner: Boolean,
      encrypt: Boolean,
      password: String,
      auth: Boolean,
      privary: Boolean,
      done: {
        type: Boolean,
        default: false
      },
      createDate: {
        type: Date,
        default: Date.now
      },
      charts: [
        {
          username: String,
          sex: String,
          age: Number,
          otherMessage: String,
          personId: String
        }
      ]
    }
  ],
  scores: [
    {
      markId: String,
      personId: String,
      score: Number,
      personName: String
    }
  ]
});

const UserModel = db.model('user', UserSchema)

module.exports = UserModel