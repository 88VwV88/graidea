import "dotenv/config";
import { app } from "./app.ts";

const PORT = process.env.PORT!;
const HOST = process.env.HOST!;

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.listen(`http://${HOST}:${PORT}`, (error) => {
  if (error) console.error("ERROR: %s", error);
  console.log(`server started at http://${HOST}:${PORT}`);
});
