const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

dotenv.config();
console.log("Dotenv config loaded");
console.log("All environment variables:", process.env);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3500;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Static path: ${path.join(__dirname, "../frontend/build")}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000", // Adjust as needed for your client's origin
  },
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined Room: ${room}`);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    const { chat } = newMessageReceived;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });
});
