import { User } from "../models/Users.js";
import { Review } from "../models/Review.js";
import { Professor } from "../models/Professor.js";
import { Follow } from "../models/Follow.js";
import { ReviewLike } from "../models/ReviewLike.js";
import { sequelize } from "../database/database.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convierte un modelo User a la forma que espera el Android (UserDto) */
function formatUser(user, followed = false) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        carrera: user.carrera,
        foto: user.foto,
        followingCount: user.followingCount ?? 0,
        followersCount: user.followersCount ?? 0,
        followed,
    };
}

// ─── CRUD básico ─────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users.map(u => formatUser(u)));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.query;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        let followed = false;
        if (currentUserId && currentUserId !== id) {
            const follow = await Follow.findOne({
                where: { follower: currentUserId, following: id },
            });
            followed = !!follow;
        }

        return res.json(formatUser(user, followed));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * POST /users/register
 * Crea o actualiza el perfil del usuario tras el registro con Firebase Auth.
 * Body: { id (Firebase UID), username, carrera, fcm_token?, email? }
 */
export const registerUser = async (req, res) => {
    try {
        const { id, username, carrera, FCMToken, email } = req.body;
        if (!id || !username || !carrera) {
            return res.status(400).json({ message: "id, username y carrera son obligatorios" });
        }

        const [user, created] = await User.upsert(
            {
                id,
                username,
                carrera,
                email: email ?? null,
                fcm_token: FCMToken ?? null,
            },
            { returning: true }
        );

        return res.status(created ? 201 : 200).json(formatUser(user));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json(formatUser(newUser));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { username, email, carrera } = req.body;
        await user.update({
            ...(username !== undefined && { username }),
            ...(email !== undefined && { email }),
            ...(carrera !== undefined && { carrera }),
        });
        return res.json(formatUser(user));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/** PUT /users/:id/photo  – Body: { foto: "url" } */
export const updateUserPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { foto } = req.body;
        if (!foto) return res.status(400).json({ message: "foto es obligatorio" });

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ foto });
        return res.json(formatUser(user));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── Reseñas del usuario ─────────────────────────────────────────────────────

export const getUserReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.query;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const reviews = await Review.findAll({
            where: { userId: id },
            include: [
                { model: Professor, as: "professor", attributes: ["name", "foto_prof"] },
                { model: User, as: "user", attributes: ["id", "username", "carrera", "foto"] },
            ],
        });

        let likedSet = new Set();
        if (currentUserId) {
            const likes = await ReviewLike.findAll({ where: { userId: currentUserId } });
            likedSet = new Set(likes.map(l => l.reviewId));
        }

        return res.json(reviews.map(r => formatReviewFull(r, likedSet.has(r.id))));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── Follows ─────────────────────────────────────────────────────────────────

/**
 * POST /users/:id/follow-toggle?currentUserId=XXX
 * Sigue o deja de seguir al usuario :id. El currentUserId puede ir en body o query.
 */
export const followToggle = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.body.currentUserId ?? req.query.currentUserId;

        if (!currentUserId) return res.status(400).json({ message: "currentUserId es obligatorio" });
        if (currentUserId === targetUserId) return res.status(400).json({ message: "No puedes seguirte a ti mismo" });

        const [currentUser, targetUser] = await Promise.all([
            User.findByPk(currentUserId),
            User.findByPk(targetUserId),
        ]);
        if (!currentUser || !targetUser) return res.status(404).json({ message: "Usuario no encontrado" });

        const existing = await Follow.findOne({
            where: { follower: currentUserId, following: targetUserId },
        });

        const t = await sequelize.transaction();
        try {
            if (existing) {
                await existing.destroy({ transaction: t });
                await currentUser.decrement("followingCount", { by: 1, transaction: t });
                await targetUser.decrement("followersCount", { by: 1, transaction: t });
                await t.commit();
                return res.json({ followed: false });
            } else {
                await Follow.create(
                    { follower: currentUserId, following: targetUserId },
                    { transaction: t }
                );
                await currentUser.increment("followingCount", { by: 1, transaction: t });
                await targetUser.increment("followersCount", { by: 1, transaction: t });
                await t.commit();
                return res.json({ followed: true });
            }
        } catch (err) {
            await t.rollback();
            throw err;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/** GET /users/:id/followers?currentUserId=XXX */
export const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.query;

        const follows = await Follow.findAll({ where: { following: id } });
        const followerIds = follows.map(f => f.follower);

        const users = await User.findAll({ where: { id: followerIds } });
        const result = await Promise.all(
            users.map(async u => {
                let followed = false;
                if (currentUserId) {
                    const f = await Follow.findOne({ where: { follower: currentUserId, following: u.id } });
                    followed = !!f;
                }
                return formatUser(u, followed);
            })
        );
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/** GET /users/:id/following?currentUserId=XXX */
export const getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.query;

        const follows = await Follow.findAll({ where: { follower: id } });
        const followingIds = follows.map(f => f.following);

        const users = await User.findAll({ where: { id: followingIds } });
        const result = await Promise.all(
            users.map(async u => {
                let followed = false;
                if (currentUserId) {
                    const f = await Follow.findOne({ where: { follower: currentUserId, following: u.id } });
                    followed = !!f;
                }
                return formatUser(u, followed);
            })
        );
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/** GET /users/:id/following/ids */
export const getFollowingIds = async (req, res) => {
    try {
        const { id } = req.params;
        const follows = await Follow.findAll({ where: { follower: id } });
        return res.json(follows.map(f => f.following));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── Helper para formatear Review (igual que en reviews.controller) ──────────
function formatReviewFull(review, liked = false) {
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
        user: user ? { id: user.id, username: user.username, carrera: user.carrera, foto: user.foto } : null,
        imageUrls: r.imageUrls ?? [],
    };
}
