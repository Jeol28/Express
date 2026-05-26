import { Comment } from "../models/Comment.js";
import { User } from "../models/Users.js";
import { Review } from "../models/Review.js";
import { CommentLike } from "../models/CommentLike.js";
import { sequelize } from "../database/database.js";

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatComment(comment, liked = false) {
    const c = comment.toJSON ? comment.toJSON() : comment;
    const user = c.user;
    return {
        id: String(c.id),
        reviewId: String(c.reviewId),
        parentCommentId: c.parentCommentId ? String(c.parentCommentId) : null,
        userId: c.userId,
        content: c.content,
        likesCount: c.likesCount,
        repliesCount: c.repliesCount,
        liked,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user: user
            ? { id: user.id, username: user.username, carrera: user.carrera, foto: user.foto }
            : null,
    };
}

const commentIncludes = [
    {
        model: User,
        as: "user",
        attributes: ["id", "username", "carrera", "foto"],
    },
];

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const getCommentsByReview = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const { currentUserId } = req.query;

        const comments = await Comment.findAll({
            where: { reviewId, parentCommentId: null },
            include: commentIncludes,
            order: [["createdAt", "ASC"]],
        });

        let likedSet = new Set();
        if (currentUserId) {
            const likes = await CommentLike.findAll({ where: { userId: currentUserId } });
            likedSet = new Set(likes.map(l => l.commentId));
        }

        return res.json(comments.map(c => formatComment(c, likedSet.has(c.id))));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.query;

        const comment = await Comment.findByPk(id, { include: commentIncludes });
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        let liked = false;
        if (currentUserId) {
            const like = await CommentLike.findOne({ where: { commentId: id, userId: currentUserId } });
            liked = !!like;
        }

        return res.json(formatComment(comment, liked));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getReplies = async (req, res) => {
    try {
        const parentCommentId = parseInt(req.params.id);
        const { currentUserId } = req.query;

        const replies = await Comment.findAll({
            where: { parentCommentId },
            include: commentIncludes,
            order: [["createdAt", "ASC"]],
        });

        let likedSet = new Set();
        if (currentUserId) {
            const likes = await CommentLike.findAll({ where: { userId: currentUserId } });
            likedSet = new Set(likes.map(l => l.commentId));
        }

        return res.json(replies.map(c => formatComment(c, likedSet.has(c.id))));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const { reviewId, parentCommentId, userId, content } = req.body;
        if (!reviewId || !userId || !content) {
            return res.status(400).json({ message: "reviewId, userId y content son obligatorios" });
        }

        const nestedUser = req.body.user;
        await User.findOrCreate({
            where: { id: userId },
            defaults: {
                username: nestedUser?.username || "user_" + String(userId).substring(0, 8),
                carrera: "Sin carrera",
            },
        });

        const t = await sequelize.transaction();
        try {
            const newComment = await Comment.create(
                {
                    reviewId: parseInt(reviewId),
                    parentCommentId: parentCommentId ? parseInt(parentCommentId) : null,
                    userId,
                    content,
                },
                { transaction: t }
            );

            if (!parentCommentId) {
                await Review.increment("comment", { by: 1, where: { id: reviewId }, transaction: t });
            } else {
                await Comment.increment("repliesCount", { by: 1, where: { id: parentCommentId }, transaction: t });
            }

            await t.commit();
            return res.status(201).json({ id: String(newComment.id) });
        } catch (err) {
            await t.rollback();
            throw err;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: "content es obligatorio" });

        const comment = await Comment.findByPk(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        await comment.update({ content });
        return res.json(formatComment(comment));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const t = await sequelize.transaction();
        try {
            await comment.destroy({ transaction: t });

            if (!comment.parentCommentId) {
                await Review.decrement("comment", { by: 1, where: { id: comment.reviewId }, transaction: t });
            } else {
                await Comment.decrement("repliesCount", { by: 1, where: { id: comment.parentCommentId }, transaction: t });
            }

            await t.commit();
            return res.sendStatus(204);
        } catch (err) {
            await t.rollback();
            throw err;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const toggleCommentLike = async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: "userId es obligatorio" });

        await User.findOrCreate({
            where: { id: userId },
            defaults: { username: "user_" + String(userId).substring(0, 8), carrera: "Sin carrera" },
        });

        const comment = await Comment.findByPk(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const existing = await CommentLike.findOne({ where: { commentId, userId } });

        const t = await sequelize.transaction();
        try {
            if (existing) {
                await existing.destroy({ transaction: t });
                await comment.decrement("likesCount", { by: 1, transaction: t });
                await t.commit();
                return res.json({ liked: false, likesCount: comment.likesCount - 1 });
            } else {
                await CommentLike.create({ commentId, userId }, { transaction: t });
                await comment.increment("likesCount", { by: 1, transaction: t });
                await t.commit();
                return res.json({ liked: true, likesCount: comment.likesCount + 1 });
            }
        } catch (err) {
            await t.rollback();
            throw err;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserComments = async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.findAll({
            where: { userId },
            include: commentIncludes,
            order: [["createdAt", "DESC"]],
        });
        return res.json(comments.map(c => formatComment(c)));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
