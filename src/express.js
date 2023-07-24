import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import fs from "fs/promises";
import { join, dirname } from "path";
import { resolvers } from "./graphql/resolvers.js";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { fileURLToPath } from "url";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import v1Routes from "./routes/routes.js";

const app = express();

const httpServer = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = await fs.readFile(
  join(__dirname, "graphql", "schema.graphql"),
  {
    encoding: "utf-8",
  }
);

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await apollo.start();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", v1Routes);
app.use(
  "/api/graphql",
  expressMiddleware(apollo, {
    context: async ({ req }) => ({
      user: req.user,
    }),
  })
);
app.use(errorHandler);

export default httpServer;
