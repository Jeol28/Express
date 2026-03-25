import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Follow = sequelize.define(
    "follows",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        follower: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: "username",
            },
        },
        following: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: "username",
            },
        },
    }
);