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

const app = express();

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

app.get("/create-admin", async (_: Request, res: Response) => {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password,
    },
  });
  res.json({ message: "Admin created successfully" });
});

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

export default app;
