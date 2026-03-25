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
        username:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time:{
            type: DataTypes.DATE,
            allowNull: false,
        },

        rating:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        comment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }

    }
);

