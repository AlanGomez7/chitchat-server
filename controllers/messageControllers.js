const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");


const createMessage = async(req, res) => {
    const { content, chatId } = req.body;
    if(!content || !chatId){
        return res.status(404)
    }

    const newMessage = {
        sender: req.headers.authorization,
        content: content,
        chat: chatId,
    }

    try {
        var message = await Message.create(newMessage);
        
        message = await message.populate("sender", "name");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email"
        })

        await Chat.findByIdAndUpdate(chatId,{
            latestMessage: message
        })
        console.log(message)
        res.json(message)
    } catch (error) {
        res.status(404);
        console.log(error);
    }
};

const fetchAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name")
        .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
}
module.exports = {
    createMessage,
    fetchAllMessages
}