const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 6,
      required: true,
    },
    description: String,
    photoUrl: {
      type: String,
    },
    results: {
      type: String,
    },
    location: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: Number,
  },
  { timestamps: true }
);

entrySchema.index(
  {
    title: 'text',
    description: 'text',
    location: 'text',
  },
  { language: 'none' }
);

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Entry', entrySchema);
