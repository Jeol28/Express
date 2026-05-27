import { Review } from "../models/Review.js";
import { Professor } from "../models/Professor.js";
import { User } from "../models/Users.js";
import { ReviewLike } from "../models/ReviewLike.js";
import { sequelize } from "../database/database.js";

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Aplica el formato correcto que espera el Android (ReviewDto) */
function formatReview(review, liked = false) {
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
        liked,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        professor: prof ? { name: prof.name, foto: prof.foto_prof } : null,
        user: user
            ? { id: user.id, username: user.username, carrera: user.carrera, foto: user.foto }
            : null,
        imageUrls: r.imageUrls ?? [],
    };
}

// Includes reutilizables
const reviewIncludes = [
    {
        model: Professor,
        as: "professor",
        attributes: ["name", "foto_prof"],
    },
    {
        model: User,
        as: "user",
        attributes: ["id", "username", "carrera", "foto"],
    },
];

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const getReviews = async (req, res) => {
    try {
        const { userId, currentUserId } = req.query;
        const where = userId ? { userId } : {};

        const reviews = await Review.findAll({ where, include: reviewIncludes });

        let likedSet = new Set();
        if (currentUserId) {
            const likes = await ReviewLike.findAll({ where: { userId: currentUserId } });
            likedSet = new Set(likes.map(l => l.reviewId));
        }

        return res.json(reviews.map(r => formatReview(r, likedSet.has(r.id))));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.query;

        const review = await Review.findByPk(id, { include: reviewIncludes });
        if (!review) return res.status(404).json({ message: "Review not found" });

        let liked = false;
        if (currentUserId) {
            const like = await ReviewLike.findOne({ where: { reviewId: id, userId: currentUserId } });
            liked = !!like;
        }

        return res.json(formatReview(review, liked));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createReview = async (req, res) => {
    try {
        const { userId, professorId, content, rating, time, materia, latitude, longitude, imageUrls } = req.body;
        const nestedUser = req.body.user;

        if (!userId || !professorId || !content) {
            return res.status(400).json({ message: "userId, professorId y content son obligatorios" });
        }

        await User.findOrCreate({
            where: { id: userId },
            defaults: {
                username: nestedUser?.username || "user_" + String(userId).substring(0, 8),
                carrera: "Sin carrera",
            },
        });

        const newReview = await Review.create({
            userId,
            professorId,
            content,
            rating: rating ?? 0,
            time: time ? new Date(time) : new Date(),
            materia: materia ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        });

        const full = await Review.findByPk(newReview.id, { include: reviewIncludes });
        return res.status(201).json(formatReview(full ?? newReview));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        const { content, rating, time } = req.body;
        await review.update({
            ...(content !== undefined && { content }),
            ...(rating !== undefined && { rating }),
            ...(time !== undefined && { time: new Date(time) }),
        });
        return res.json(formatReview(review));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        await review.destroy();
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const toggleReviewLike = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: "userId es obligatorio" });

        await User.findOrCreate({
            where: { id: userId },
            defaults: { username: "user_" + String(userId).substring(0, 8), carrera: "Sin carrera" },
        });

        const review = await Review.findByPk(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        const existing = await ReviewLike.findOne({ where: { reviewId, userId } });

        const t = await sequelize.transaction();
        try {
            if (existing) {
                await existing.destroy({ transaction: t });
                await review.decrement("likesCount", { by: 1, transaction: t });
                await t.commit();
                return res.json({ liked: false, likesCount: review.likesCount - 1 });
            } else {
                await ReviewLike.create({ reviewId, userId }, { transaction: t });
                await review.increment("likesCount", { by: 1, transaction: t });
                await t.commit();
                return res.json({ liked: true, likesCount: review.likesCount + 1 });
            }
        } catch (err) {
            await t.rollback();
            throw err;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
