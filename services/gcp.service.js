const { storage } = require("../config/gcp.config");

// const { storage } = gcpClient;

exports.uploadFileAndGetSignedUrl = async (
  filePath,
  destFileName,
  bucketName = "taxi-app-36499.appspot.com"
) => {
  await storage
    .bucket(bucketName)
    .upload(filePath, { destination: destFileName });
  return this.getFileURL(destFileName, bucketName);
};

exports.getFileURL = async (
  fileName,
  bucketName = "taxi-app-36499.appspot.com"
) => {
  const expires = Date.now() + 2 * 60 * 60 * 1000;
  const options = {
    version: "v4",
    action: "read",
    expires,
  };
  console.log(expires, "expires");
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  return url;
};
