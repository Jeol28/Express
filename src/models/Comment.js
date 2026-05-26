import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Comment = sequelize.define(
    "comments",
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
        parentCommentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "comments", key: "id" },
        },
        userId: {
            type: DataTypes.STRING(128), // Firebase UID – sin FK
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        likesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        repliesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }
);
