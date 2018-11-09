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
  console.log('CONFIG IS',config);

  return s3.upload(config)
    .promise()
    .then(result => {
      console.log('FILEPATH', filepath);
      fs.remove(filepath, err => {
        if (err) {
          return console.error(err);
        }
        console.log('LOCATION', result.Location);
        return result.Location;
      })
        // .then(() => {
        //   console.log("LOCATION", result.Location);
        //   return result.Location});
    })
    .catch(err => {
      console.error(err);
      return fs.remove(filepath)
        .then(() => Promise.reject(err));
    });
};

// fs.remove('/home/jprichardson', err => {
//   if (err) return console.error(err)

//   console.log('success!') // I just deleted my entire HOME directory.
// })

export default { uploadFile };