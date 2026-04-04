import { config } from "./config/config";
import app from "./app";
import connectDB from "./config/db";

const startServer = async () => {
  const port = config.port;
  await connectDB();
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();