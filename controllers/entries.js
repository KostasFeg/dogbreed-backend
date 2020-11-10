const entriesRouter = require('express').Router();
const Entry = require('../models/entry');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const upload = require('../services/file-upload');
const singleUpload = upload.single('image');

const toBePaginated = Entry.find({}).populate('user', {
  username: 1,
  name: 1,
});

entriesRouter.get('/', paginatedResults(Entry), (request, response) => {
  response.json(response.paginatedResults);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const query = String(req.query.query);

    console.log(query);

    let queried;

    query ? (queried = { $text: { $search: `"${query}"` } }) : (queried = {});

    console.log(queried);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    model.countDocuments({}, function (err, c) {
      results.docs = c;
    });

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model
        .find(queried)
        .sort({ _id: -1 })
        .populate('user', {
          username: 1,
          name: 1,
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

entriesRouter.post('/', singleUpload, async (request, response, next) => {
  let tempUrl = request.file.location;

  // singleUpload(request, response, (err) => {
  //   tempUrl = request.file.location;
  // })

  // console.log(request.file.location);
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const entry = new Entry({
    photoUrl: tempUrl,
    title: body.title,
    description: body.description,
    results: body.results,
    location: body.location,
    user: user,
    likes: body.likes ? body.likes : 0,
  });
  try {
    const savedEntry = await entry.save();
    response.json(savedEntry);
    user.entries = user.entries.concat(savedEntry._id);
    await user.save();
  } catch (error) {
    next(error);
  }
});

entriesRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  const entry = await Entry.findById(request.params.id);
  console.log(decodedToken.username);
  try {
    if (request.token && entry.user.toString() === decodedToken.id.toString()) {
      await Entry.findByIdAndDelete(entry);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
  } catch (error) {
    next(error);
  }
});

entriesRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const entry = {
    photoUrl: body.photoUrl,
    title: body.title,
    description: body.description,
    likes: body.likes,
  };

  Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
    .then((updatedEntry) => {
      response.json(updatedEntry);
    })
    .catch((error) => next(error));
});

module.exports = entriesRouter;
