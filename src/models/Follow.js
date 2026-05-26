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
        // Firebase UIDs – sin FK para permitir follows entre usuarios no registrados en Express aún
        follower: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        following: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    }
);