import ChatRoomModel from "../models/ChatRoom.js";
import ChatMessageModel from "../models/ChatMessage.js";

export default {
  deleteRoomById: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.remove({ _id: roomId });
      const messages = await ChatMessageModel.remove({ chatRoomId: roomId });

      return res.status(200).json({
        success: true,
        message: "Delete performed successfully",
        deletedRoomsCount: room.deletedCount,
        deletedMessageCount: messages.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
      });
    }
  },
  deleteMessageById: async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await ChatMessageModel.remove({ _id: messageId });

      return res.status(200).json({
        success: true,
        message: "Delete performed successfully",
        deletedMessageCount: message.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
      });
    }
  },
};
