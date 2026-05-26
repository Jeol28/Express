import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
    "users",
    {
        // El ID es el Firebase UID (string), compatible con ambos backends
        id: {
            type: DataTypes.STRING(128),
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Firebase gestiona la autenticación
        },
        carrera: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        foto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        followingCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        followersCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        fcm_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });