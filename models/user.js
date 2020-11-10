const mongoose = require('mongoose');
const Email = require('mongoose-type-email');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.Email,
    unique: true,
    required: true,
    minlength: 7,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 3,
  },
  reg_time: {
    type: Date,
    default: Date.now,
  },
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);
