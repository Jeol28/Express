import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Professor = sequelize.define(
    "professors",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subjects: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        foto_prof: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }
);
