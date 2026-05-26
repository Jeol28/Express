import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const ReviewLike = sequelize.define(
    "review_likes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "reviews", key: "id" },
        },
        userId: {
            type: DataTypes.STRING(128), // Firebase UID – sin FK
            allowNull: false,
        },
    },
    {
        indexes: [
            { unique: true, fields: ["reviewId", "userId"] },
        ],
    }
);
