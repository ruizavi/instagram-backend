import express from "express";
import PostRoutes from "./post.routes.js";
import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";

const app = express();

app.use("/auth", AuthRoutes);
app.use("/post", PostRoutes);
app.use("/user", UserRoutes);

export default app;
