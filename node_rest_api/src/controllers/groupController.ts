import asyncHandler from "express-async-handler"
// const Chat = require("../modles/chatModal");
import User from "../models/User";
import Group from "../models/Group";
// @desc    Create a chat if is does not exists, and if it exists return he already existing chat (no group chats)
// @route   POST /api/v1/user/chat
// @access  Requires token

const createError = require("../middlewares/createError");

const searchUser= asyncHandler(async (req:any, res:any, next) => {
    // console.log('reqsearch',req)
    const keyword = req.query.search ? {
       //I want to search for the users, that whether the email or the name have the search im querying for
       $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
       ]
    } : {}
    // console.log('my search content',keyword)
    //Upon the list I don´t want to have as chat candidate myself
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    // console.log('finduses',users)
    res.status(200).send(users);
 })

const accessChat = asyncHandler(async (req:any, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return next(createError(400, "No user"));
    }
    var isChat:any= await Group.find({
      // I was obligatory the chat to have both my user id, and the id of the other user I have a chat with
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    //If chat exists return chat, else create it
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        users: [req.user._id, userId],
      };
      try {
        const createdChat = new Group(chatData);
        await createdChat.save();
        const fullChat = await Group.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).send(fullChat);
      } catch (err) {
        next(createError(400, "Could not create chat"));
      }
    }
  } catch (err) {
    next(createError(400, "Could not access chat"));
  }
});

// @desc   Fetch all my chats
// @route   GET /api/v1/user/chat
// @access  Requires token
const fetchChat = asyncHandler(async (req:any, res, next) => {
  try {
    //I want all those chats to have my id in the users array
    Group.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      // .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results:any) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (err) {
    next(createError(400, "Could not get chats"));
  }
});

// @desc    Create a group chat
// @route   POST /api/v1/chat/group
// @access  Requires token
const createGroupChat = asyncHandler(async (req:any, res, next):Promise<any>=> {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields must be filled" });
  }

  var users = JSON.parse(req.body.users);
  // console.log("groupusers", users);
  // console.log(req);
  if (users.length < 1) {
    return res
      .status(400)
      .json({ success: false, msg: "Must have al least 2 users" });
  }
  //adding myself a a user
  // console.log("requse", req.user);
  users.push(req.user);
  //   console.log("groupuserspush", users);
  try {
    const groupChat = new Group({
      chatName: req.body.name,
      users: users,
      groupAdmin: req.user,
    });
    await groupChat.save();

    //populating the fileds of the chat:
    const fullGroupChat = await Group.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
      console.log('fullgroupchat',fullGroupChat)
    res.status(200).send(fullGroupChat);
  } catch (err) {
    next(createError(400, "Could not create group chat"));
  }
});

// @desc    Rename the title of the group chat
// @route   PUT /api/v1/user/rename
// @access  Requires token + only admin
const renameGroupChat = asyncHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;
  console.log('shoudaolerename',chatId,chatName)
  try {
    const chat = await Group.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(chat);
  } catch (err) {
    next(createError(400, "Could not rename chat"));
  }
});

// @desc    Remove a member form a group chat
// @route   PUT /api/v1/user/groupremove
// @access  Requires token + only admin
const removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;
  // console.log('ingroupremove',chatId,userId)
  try {
    const removed = await Group.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(removed);
  } catch (err) {
    next(createError(400, "Could not add member"));
  }
});

// @desc    Add a member to a group chat
// @route   PUT /api/v1/user/groupadd
// @access  Requires token + only admin
const addToGroup = asyncHandler(async (req, res, next) => {
  
  const { chatId, userId } = req.body;
  console.log('zaiaddd',chatId,userId)
  try {
    const added = await Group.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(added);
  } catch (err) {
    next(createError(400, "Could not add member"));
  }
});

export default{  accessChat,
  fetchChat,
  createGroupChat,
  removeFromGroup,
  renameGroupChat,
  addToGroup,
  searchUser
};
