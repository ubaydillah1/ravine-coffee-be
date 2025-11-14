import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import router from "./routes/index.js";
import cors from "cors";
import { AppError } from "./utils/errors.js";
import prisma from "./lib/prisma.js";
import bcrypt from "bcrypt";
import { Server } from "socket.io";
import { createServer } from "http";
import { SOCKET_EVENTS } from "./constants/socketEvents.js";
import { mainCron } from "./cron/index.js";

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://ravine-coffee-shop.vercel.app"],
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: ["http://localhost:3000", "https://ravine-coffee-shop.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/api/cron/daily", mainCron);

// Error handler
app.use((err: Error, __: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  res.status(500).json({ message: err.message });
});

// Not Found API
app.use((_: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  socket.on(SOCKET_EVENTS.ORDER.JOIN_ROOM, (orderId) => {
    socket.join(orderId);
    console.log(`📦 ${socket.id} joined room ${orderId}`);
  });

  socket.on(SOCKET_EVENTS.CASHIER.JOIN_ROOM, () => {
    console.log("test");
    socket.join("cashiers");
    console.log(`📦 ${socket.id} joined room cashiers`);
  });

  socket.on("disconnect", () => {
    console.log("❌ user disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

export default app;
