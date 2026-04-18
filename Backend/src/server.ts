import { config } from "./config/config";
import app from "./app";
import connectDB from "./config/db";
import "./config/redis"
import { Server } from "socket.io";
import http from "http";
import { registerSocketHandlers } from "./socket/socketHandler";

const startServer = async () => {
  const port = config.port;
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server,{
    cors:{
      origin:"https://bms-frontend-rr67.onrender.com",
      methods : ["GET","POST"],
      credentials : true
    }
  })

  io.on("connection",(socket)=>{
    console.log("user connected: ", socket.id);
    registerSocketHandlers(socket,io);
    socket.on("disconnect",(reason)=>{
      console.log("user disconnected",socket.id, "Reason" ,reason)
    })
  })

  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();