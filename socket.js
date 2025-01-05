const socketIo = (io) => {
    const connectedUsers = new Map();

    io.on('connection',(socket) => {
        const user = socket.handshake.auth.user;
        console.log("User connected", user?.username);
        
        socket.on("join room", (groupId) => {
            socket.join(groupId);
            connectedUsers.set(socket.id, { user, room: groupId });

            const usersInRoom = Array.from(connectedUsers.values())
            .filter((u) =>u.room === groupId)
            .map((u) => u.user);

            io.in(groupId).emit("users in room", usersInRoom);

            socket.to(groupId).emit('notification',{
                type: 'USER_JOINED',
                message:'${user?.username} has joined',
                user: user,
            });

        });

        socket.on("leave room", (groupId) => {
            console.log('${user?.username} leaving room:', groupId);

            socket.leave(groupId);
            if (connectedUsers.has(socket.id)){
                connectedUsers.delete(socket.id);
                socket.to(groupId).emit("user left", user?._id);
            }
        });

        socket.on("typing", ({ groupId, username }) => {
            socket.to(groupId).emit("user typing", {username});
        });

        socket.on("stop typing", ({ groupId }) => {
            socket.to(groupId).emit("user stop typing", {username:user?.username});
        });

    });
        
};

 module.exports = socketIo;