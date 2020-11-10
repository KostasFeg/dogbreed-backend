const imagesRouter = require('express').Router();

const upload = require('../services/file-upload');
const singleUpload = upload.single('image');

imagesRouter.post('/', (req, res) => {
  singleUpload(req, res, async (err) => {
    await res.json({ imageUrl: req.file.location });
  });
});

module.exports = imagesRouter;

// return
