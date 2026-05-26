
import express from "express";
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import professorRoutes from "./routes/professor.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(reviewRoutes);
app.use(professorRoutes);
app.use(commentRoutes);

export default app;