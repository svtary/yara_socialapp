const io=require("socket.io")(8900,{
    cors:{
        // origin:"http://127.0.0.1:5173"
        origin: "*"
    }
});

let users=[];
const addUser=(userId,socketId)=>{
    !users.some(user=>user.userId===userId)&& users.push({userId,socketId});
}
const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId);
}
const getUser=(userId)=>{
    console.log("ingetuser",users);
    console.log("iserod",userId);
    return users.find((user) => user.userId === userId);

}
io.on("connection",(socket)=>{
    //when connected
    console.log("a user connected");
    //take userId and socketId from user
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users);
        console.log("adduser",users)

    });
//send and get message
socket.on("sendMessage",({senderId,receiverId,text})=>{
    console.log("recerod",receiverId)
    const user=getUser(receiverId);
    console.log("user",user);
    io.to(user.socketId).emit("getMessage",{
        senderId,
        text,
    });

});

// //creating a personal room for the chat:
socket.on("join chat", (room) => {
    socket.join(room);
  });
   //sending messages + handling notifications:
socket.on("new message", (newMessageReceived) => {
    console.log('ssss', newMessageReceived)
    var chat = newMessageReceived.currentChat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      //Don´t update my own messages array, but the others:
      if (user._id === newMessageReceived.res.data.sender) return;

      //Send the message back to add it to the messages array:
      socket.in(newMessageReceived.room).emit("message received", {
        newMessageReceived: newMessageReceived.newm,
        chat,
      });
    });
  });






//when disconnect
socket.on("disconnect",()=>{
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
})