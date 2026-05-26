import { Review } from "../models/Review.js";
import { User } from "../models/Users.js";
import { Follow } from "../models/Follow.js";
import { Professor } from "../models/Professor.js";
import { Comment } from "../models/Comment.js";
import { ReviewLike } from "../models/ReviewLike.js";
import { CommentLike } from "../models/CommentLike.js";

export function setupRelations() {
    // User ↔ Review
    User.hasMany(Review, { foreignKey: "userId", as: "reviews", onDelete: "CASCADE", hooks: true });
    Review.belongsTo(User, { foreignKey: "userId", as: "user" });

    // Professor ↔ Review
    Professor.hasMany(Review, { foreignKey: "professorId", as: "reviews", onDelete: "CASCADE", hooks: true });
    Review.belongsTo(Professor, { foreignKey: "professorId", as: "professor" });

    // Follows (User ↔ User many-to-many)
    User.belongsToMany(User, {
        through: "follows",
        as: "following",
        foreignKey: "follower",
        otherKey: "following",
    });
    User.belongsToMany(User, {
        through: "follows",
        as: "followers",
        foreignKey: "following",
        otherKey: "follower",
    });

    // Review ↔ Comment
    Review.hasMany(Comment, { foreignKey: "reviewId", as: "comments", onDelete: "CASCADE", hooks: true });
    Comment.belongsTo(Review, { foreignKey: "reviewId", as: "review" });

    // User ↔ Comment
    User.hasMany(Comment, { foreignKey: "userId", as: "comments", onDelete: "CASCADE", hooks: true });
    Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

    // Comment ↔ Comment (respuestas)
    Comment.hasMany(Comment, { foreignKey: "parentCommentId", as: "replies", onDelete: "CASCADE", hooks: true });
    Comment.belongsTo(Comment, { foreignKey: "parentCommentId", as: "parent" });

    // Review ↔ ReviewLike
    Review.hasMany(ReviewLike, { foreignKey: "reviewId", as: "likes_list", onDelete: "CASCADE" });
    ReviewLike.belongsTo(Review, { foreignKey: "reviewId" });
    ReviewLike.belongsTo(User, { foreignKey: "userId" });

    // Comment ↔ CommentLike
    Comment.hasMany(CommentLike, { foreignKey: "commentId", as: "likes_list", onDelete: "CASCADE" });
    CommentLike.belongsTo(Comment, { foreignKey: "commentId" });
    CommentLike.belongsTo(User, { foreignKey: "userId" });
}