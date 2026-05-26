import { Router } from "express";
import {
    getCommentById,
    getReplies,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
} from "../controller/comments.controller.js";

const router = Router();

router.get("/comments/:id", getCommentById);
router.get("/comments/:id/replies", getReplies);
router.post("/comments", createComment);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);
router.post("/comments/:id/like-toggle", toggleCommentLike);

export default router;
