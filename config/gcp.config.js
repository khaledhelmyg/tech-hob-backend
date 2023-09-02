const { Storage } = require("@google-cloud/storage");
const path = require("path");

const { project_id: projectId } = require("./taxi-app-36499-982b86542fb2.json");

const filePath = path.join(__dirname, "./taxi-app-36499-982b86542fb2.json");

// create client
const storage = new Storage({ keyFilename: filePath, projectId });

module.exports = {
  storage,
};
