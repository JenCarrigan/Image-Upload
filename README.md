# Image-Upload

This app allows user to upload and delete a photo to Amazon's s3 storage. This app utilizes the AWS SDK.

## Upload Route

This route takes a photo, parses it using Multer middleware, and then uploads it to s3 bucket. Afterward, should return a link to the photo to the user, while pushing the link, the image ID, and the key to the user's images array.

## Delete Route

This route takes an ID for the image, finds the image's key and then deletes that image from the bucket. It then removes that image from user's images array. It returns back a message that tells the user their file has been deleted.
