const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Store active users in chat rooms
const chatRooms = new Map()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"],
    },
    path: "/api/socket",
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Join a chat room
    socket.on("join-chat", ({ chatId, userId, userName, userAvatar, userRole }) => {
      socket.join(chatId)

      // Store user info
      if (!chatRooms.has(chatId)) {
        chatRooms.set(chatId, new Map())
      }
      chatRooms.get(chatId).set(socket.id, {
        userId,
        userName,
        userAvatar,
        userRole,
        socketId: socket.id,
      })

      // Notify others in the room
      socket.to(chatId).emit("user-joined", {
        userId,
        userName,
        userRole,
      })

      // Send current online users to the joining user
      const onlineUsers = Array.from(chatRooms.get(chatId).values())
      socket.emit("online-users", onlineUsers)

      console.log(`User ${userName} joined chat ${chatId}`)
    })

    // Leave a chat room
    socket.on("leave-chat", ({ chatId }) => {
      socket.leave(chatId)

      if (chatRooms.has(chatId)) {
        const userInfo = chatRooms.get(chatId).get(socket.id)
        chatRooms.get(chatId).delete(socket.id)

        if (userInfo) {
          socket.to(chatId).emit("user-left", {
            userId: userInfo.userId,
            userName: userInfo.userName,
          })
        }

        // Clean up empty rooms
        if (chatRooms.get(chatId).size === 0) {
          chatRooms.delete(chatId)
        }
      }
    })

    // Send a message
    socket.on("send-message", (message) => {
      const { chatId, ...messageData } = message

      // Broadcast to all users in the chat room (including sender for confirmation)
      io.to(chatId).emit("new-message", messageData)

      console.log(`Message sent in chat ${chatId}`)
    })

    // Typing indicator
    socket.on("typing-start", ({ chatId, userId, userName }) => {
      socket.to(chatId).emit("user-typing", { userId, userName })
    })

    socket.on("typing-stop", ({ chatId, userId }) => {
      socket.to(chatId).emit("user-stopped-typing", { userId })
    })

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)

      // Remove user from all chat rooms
      chatRooms.forEach((users, chatId) => {
        if (users.has(socket.id)) {
          const userInfo = users.get(socket.id)
          users.delete(socket.id)

          if (userInfo) {
            io.to(chatId).emit("user-left", {
              userId: userInfo.userId,
              userName: userInfo.userName,
            })
          }

          if (users.size === 0) {
            chatRooms.delete(chatId)
          }
        }
      })
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.IO server running`)
    })
})
