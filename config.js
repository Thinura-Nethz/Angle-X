const fs = require("fs");
require("dotenv").config();

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}

module.exports = {
  SESSION_ID: process.env.SESSION_ID || "LJM0EACb#k5FuqfZmW-TuFQc-GMJbOMXh8TYmMq5F08szlsWznBQ",
  MONGODB: process.env.MONGODB || "mongodb://mongo:bIGDhAWAnCOZVPmNAFPdEPgZhAIEguCi@interchange.proxy.rlwy.net:43630",
  OWNER_NUM: process.env.OWNER_NUM || "94774571418",
  MODE: process.env.MODE || "public",
  PREFIX: process.env.PREFIX || ".",
  PORT: process.env.PORT || 8000
};
