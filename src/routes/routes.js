import express from "express";
import AuthRoutes from "./post.routes.js";
import PostRoutes from "./auth.routes.js";

const app = express();

app.use("/auth", AuthRoutes);
app.use("/post", PostRoutes);

export default app;
