/** Libraries */
import express, { Application } from "express";
import "dotenv/config";
import cors from "cors";
import chalk from "chalk";
import logger from "morgan";

/** Database */
import { dbConnect } from "./config";

/**Routes */
import { itemRoutes } from "./routes/item";
import { authRouter } from "./routes/auth.routes";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    items: "/api/items",
    auth: "/api/auth",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";

    // Initial methods
    this.dbConnection();
    this.middlewares();
    this.routes();
  }

  async dbConnection() {
    await dbConnect();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(logger("dev"));

    this.app.use(express.json());

    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.apiPaths.items, itemRoutes);
    this.app.use(this.apiPaths.auth, authRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(
        chalk.cyan("Server listening on port:"),
        chalk.green(this.port)
      );
    });
  }
}

/** Here we start the server */
const server = new Server();
server.listen();
