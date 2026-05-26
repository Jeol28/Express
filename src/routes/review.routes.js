import { Router } from "express";
import {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getReviewById,
    toggleReviewLike,
} from "../controller/reviews.controller.js";
import { getCommentsByReview } from "../controller/comments.controller.js";

const router = Router();

router.get("/reviews", getReviews);
router.get("/reviews/:id", getReviewById);
router.post("/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);
router.post("/reviews/:id/like-toggle", toggleReviewLike);

// Comentarios de una reseña
router.get("/reviews/:reviewId/comments", getCommentsByReview);

export default router;