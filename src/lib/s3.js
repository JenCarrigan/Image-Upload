import fs from 'fs-extra';
import aws from 'aws-sdk';

const s3 = new aws.S3();

const uploadFile = (filepath, key) => {
  let config = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(filepath),
  };

  return s3.upload(config)
    .promise()
    .then(result => {
      fs.remove(filepath, err => {
        if (err) { return console.error(err); }
      });
      return result.Location;
    })
    .catch(err => {
      return fs.remove(filepath)
        .then(() => Promise.reject(err));
    });
};

const deleteFile = (key) => {
  let config = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };

  return s3.deleteObject(config)
    .promise()
    .then(result => {
      return ('Your file has been deleted');
    })
    .catch(err => console.log(err, err.stack));

};

export default { uploadFile, deleteFile };