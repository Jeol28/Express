import { Router } from "express";
import { getReviews, createReview, updateReview, deleteReview, getReviewById} from "../controller/reviews.controller.js";

const router = Router();

router.get("/reviews", getReviews);

router.get("/reviews/:id", getReviewById);

router.post("/reviews",createReview);

router.put("/reviews/:id",updateReview);

router.delete("/reviews/:id",deleteReview);

export default router;