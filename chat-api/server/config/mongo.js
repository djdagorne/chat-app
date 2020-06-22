import mongoose from "mongoose";
import config from "./index.js";

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`;

/* mongoose gets a connection to our mongoDB and these are the options we give it initatially */
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* event handlers */
mongoose.connection.on("connected", () => {
  console.log("Mongo has connected successfully.");
});
mongoose.connection.on("reconnected", () => {
  console.log("Mongo has reconnected successfully.");
});
mongoose.connection.on("error", (error) => {
  console.log("Mongo has an error: ", error);
  mongoose.disconnect();
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongo connection has disconnected.");
});
