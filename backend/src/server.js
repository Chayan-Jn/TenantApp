import app from "./app.js";
import { connectToDB } from './config/db.js';

const PORT = process.env.PORT || 3000;


const startServer = async () => {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
  }
};

startServer();