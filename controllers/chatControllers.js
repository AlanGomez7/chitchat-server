const Chat = require("../model/chatModel");
const User = require("../model/userModel");

const accessChat = async (req, res) => {
  console.log(req.body)
  if (!req.body._id) {
    throw res.status(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.body.currentUser } } },
      { users: { $elemMatch: { $eq: req.body._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.body.currentUser, req.body._id],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  }
};

const fetchChat = async (req, res) => {
  try {
    const id = req.body.id;
    await Chat.find({ users: { $elemMatch: { $eq: id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        await User.populate(result, {
          path: "latestMessage.sender",
          select: "email name",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    console.log(error);
  }
};

const createGroupChat = async (req, res) => {
  const userId = req.headers.authorization
  if (!req.body.user || !req.body.name) {
    res.status(404).send({ message: "Fill all the forms" });
  }
  const users = JSON.parse(req.body.user);
  users.push(userId);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: userId,
    });

    const chatDetails = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(chatDetails);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const chat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    res.status(400);
    throw new Error("Chat not Found");
  } else {
    res.status(200).send(chat);
  }
};

const addUser = async (req, res) => {
  const { chatId, userId } = req.body;

  const addedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser) {
    req.status(400);
    throw new Error("No chat Found");
  } else {
    res.send(addedUser);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedUser) {
    req.status(400);
    throw new Error("No chat Found");
  } else {
    res.send(removedUser);
  }
};

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addUser,
  removeFromGroup,
};
