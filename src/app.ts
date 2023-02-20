/** Libraries */
import express, { Application } from "express";
import "dotenv/config";
import cors from "cors";
import chalk from "chalk";
import logger from "morgan";

import http, { type Server as TServer } from "http";

import { Server as SocketServer, type Socket } from "socket.io";

/** Database */
import { dbConnect } from "./config";

/** Routes */
import { authRouter } from "./routes";

/** Sockets */
import { Sockets } from "./sockets";

/** Middlewares */
import { socketJwtValidate } from "./middleware";

class Server {
  private app: Application;
  private HttpServer: TServer;
  private io: SocketServer;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
  };

  constructor() {
    this.port = process.env.PORT || "8080";
    this.app = express();
    this.HttpServer = http.createServer(this.app);
    /** Create socket server */
    this.io = new SocketServer(this.HttpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Initial methods
    this.dbConnection();
    this.middlewares();
    this.routes();
    this.sockets();
  }

  async dbConnection() {
    await dbConnect();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(logger("dev"));

    this.app.use(express.json());

    this.app.use(express.static("public"));

    this.io.use((socket, next) => socketJwtValidate(socket, next));
  }

  routes() {
    this.app.use(this.apiPaths.auth, authRouter);
  }

  sockets() {
    this.io.on("connection", (socket: Socket) => Sockets(socket));
  }

  listen() {
    this.HttpServer.listen(this.port, () => {
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
