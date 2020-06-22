class WebSockets {
  // user array created with each new socket, holds active users on the app
  users = [];
  // our main method of websockets, takes a server instance and produces event listeners around that socket
  connection(client) {
    // event fired when chat room is disconnected
    client.on("disconnect", () => {
      this.users = this.users.filter((user) => user.socketId !== client.id);
    });
    // add identity of user mapped to the socket id
    //
    client.on("identity", (userId) => {
      // adding new user to users array on socket
      this.users.push({
        socketId: client.id,
        userId: userId,
      });
    });
    // subscribe user to chat and other users
    client.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });
    // mute a room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }
}

export default new WebSockets();
