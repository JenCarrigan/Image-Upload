import express from 'express';
import multer from 'multer';

import s3 from '../lib/s3.js';
import auth from '../auth/middleware.js';
import user from '../models/users.js';

const uploadRouter = express.Router();

const uploader = multer({ dest: `${__dirname}/../../tmp` });

uploadRouter.post('/upload', auth(), uploader.any(), async (req, res) => {

  if (req.files.length > 1) {
    return 'Too many files';
  }

  let file = req.files[0];
  let key = `${file.filename}:${file.originalname}`;

  let url = await s3.uploadFile(file.path, key);
  let output = { url: url, key: key };
  let updatedUser = await user.findByIdAndUpdate(req.user._id, { $push: {images: output} }, {new: true});
  res.send(updatedUser);
});

uploadRouter.delete('/delete-image/:imageid', auth(), async (req,res) => {

  let getImageUser = await user.findById(req.user._id);

  // Find the image by ID and get that object so we can send the key to s3 delete
  let foundImage = getImageUser.images.filter(image => {
    return JSON.stringify(image._id) == JSON.stringify(req.params.imageid);
  }).pop();
  if (!foundImage) {
    return 'That file does not exist!';
  }

  let response = await s3.deleteFile(foundImage.key);

  // Once image deleted, find the image in the images array and delete the subdocument
  const index = getImageUser.images.findIndex(image => JSON.stringify(image._id) == JSON.stringify(req.params.imageid));
  getImageUser.images.splice(index,1);

  // Save the user with the removed image
  await getImageUser.save();

  res.statusCode = 204;
  res.send(response);
});

export default uploadRouter;