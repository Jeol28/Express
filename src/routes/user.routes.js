import { Router } from "express";
import {
    getUsers,
    createUser,
    registerUser,
    updateUser,
    updateUserPhoto,
    deleteUser,
    getUserById,
    getUserReviews,
    followToggle,
    getFollowers,
    getFollowing,
    getFollowingIds,
} from "../controller/users.controller.js";
import { getUserComments } from "../controller/comments.controller.js";

const router = Router();

// CRUD base
router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/users/register", registerUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/users/:id/photo", updateUserPhoto);
router.delete("/users/:id", deleteUser);

// Reseñas del usuario
router.get("/users/:id/reviews", getUserReviews);

// Comentarios del usuario
router.get("/users/:userId/comments", getUserComments);

// Follows
router.post("/users/:id/follow-toggle", followToggle);
router.get("/users/:id/followers", getFollowers);
router.get("/users/:id/following", getFollowing);
router.get("/users/:id/following/ids", getFollowingIds);


export default router;