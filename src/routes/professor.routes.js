import { Router } from "express";
import { getProfessors, getProfessorById, getProfessorReviews } from "../controller/professors.controller.js";

const router = Router();

router.get("/professors", getProfessors);
router.get("/professors/:id", getProfessorById);
router.get("/professors/:id/reviews", getProfessorReviews);

export default router;
