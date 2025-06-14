const fs = require("fs");
require("dotenv").config();

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}

module.exports = {
  SESSION_ID: process.env.SESSION_ID || "6ZUy1D5R#rxVn7v9QpCCk0e0WzItxoSIVCgf-4kXdOIRtu-8Iass",
  MONGODB: process.env.MONGODB || "mongodb://mongo:bIGDhAWAnCOZVPmNAFPdEPgZhAIEguCi@interchange.proxy.rlwy.net:43630",
  OWNER_NUM: process.env.OWNER_NUM || "94774571418",
  MODE: process.env.MODE || "public",
  PREFIX: process.env.PREFIX || ".",
  PORT: process.env.PORT || 8000
};
