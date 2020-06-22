import http from "http";
import express from "express";
import logger from "morgan";
import socketio from "socket.io";
/* mongo connection */
import "./config/mongo.js";
/* socket configuration */
import WebSockets from "./utils/WebSockets.js";
/* routes */
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";
/* middleware */
import { decode } from "./middlewares/jwt.js";

const app = express();

const port = process.env.PORT || "3000";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint doesn't exist`,
  });
});

/* make the http server */
const server = http.createServer(app);

/* make the socket connection */
global.io = socketio.listen(server); // takes server starts listening for events on that socket
global.io.on("connection", WebSockets.connection); // run the connection method once global.io triggers the event listener here

server.listen(port);
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
