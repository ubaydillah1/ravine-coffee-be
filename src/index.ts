import express, { type Request, type Response } from "express";
import router from "./routes/index.js";

const app = express();

app.use(express.json());

app.use("/api", router);

app.use((_: Request, res: Response) => {
  res.json({ message: "Hello World" });
});
 
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
