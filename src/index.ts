import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import router from "./routes/index.js";

const app = express();
app.use(express.json());

app.use("/api", router);

// Error handler
app.use((err: Error, __: Request, res: Response, _: NextFunction) => {
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
