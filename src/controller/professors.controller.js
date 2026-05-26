import { Professor } from "../models/Professor.js";
import { Review } from "../models/Review.js";
import { User } from "../models/Users.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatProfessor(prof) {
    const p = prof.toJSON ? prof.toJSON() : prof;
    return {
        id: String(p.id),
        name: p.name,
        department: p.department,
        subjects: p.subjects ?? [],
        foto_prof: p.foto_prof ?? null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}

function formatReview(review) {
    const r = review.toJSON ? review.toJSON() : review;
    const prof = r.professor;
    const user = r.user;
    return {
        id: String(r.id),
        userId: r.userId,
        professorId: String(r.professorId),
        content: r.content,
        time: r.time,
        rating: r.rating,
        comment: r.comment,
        materia: r.materia ?? null,
        latitude: r.latitude ?? null,
        longitude: r.longitude ?? null,
        likesCount: r.likesCount,
        liked: false,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        professor: prof ? { name: prof.name, foto: prof.foto_prof } : null,
        user: user
            ? { id: user.id, username: user.username, carrera: user.carrera, foto: user.foto }
            : null,
    };
}

const reviewIncludes = [
    { model: Professor, as: "professor", attributes: ["name", "foto_prof"] },
    { model: User, as: "user", attributes: ["id", "username", "carrera", "foto"] },
];

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const getProfessors = async (req, res) => {
    try {
        const professors = await Professor.findAll();
        return res.json(professors.map(formatProfessor));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProfessorById = async (req, res) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);
        if (!professor) return res.status(404).json({ message: "Professor not found" });
        return res.json(formatProfessor(professor));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProfessorReviews = async (req, res) => {
    try {
        const { professorId } = req.params;
        const { currentUserId } = req.query;

        const reviews = await Review.findAll({
            where: { professorId },
            include: reviewIncludes,
        });

        return res.json(reviews.map(r => formatReview(r)));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
