import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import pool, { connectToDB } from './config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Closing HTTP server and DB connections...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await pool.end();
          console.log('Database pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error during DB pool closure', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();