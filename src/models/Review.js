import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Review = sequelize.define(
    "reviews",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.STRING(128), // Firebase UID – sin FK: el usuario puede no estar en Express aún
            allowNull: false,
        },
        professorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "professors",
                key: "id",
            },
        },
        likesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        content: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        comment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        materia: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        imageUrls: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
    }
);
