import express from "express";
import PostRoutes from "./post.routes.js";
import AuthRoutes from "./auth.routes.js";

const app = express();

app.use("/auth", AuthRoutes);
app.use("/post", PostRoutes);

export default app;
