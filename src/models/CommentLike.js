import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const CommentLike = sequelize.define(
    "comment_likes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "comments", key: "id" },
        },
        userId: {
            type: DataTypes.STRING(128), // Firebase UID – sin FK
            allowNull: false,
        },
    },
    {
        indexes: [
            { unique: true, fields: ["commentId", "userId"] },
        ],
    }
);
