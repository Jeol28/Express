import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("TuProfe", "postgres", "prueba123", {
    port: 5432,
    host: "localhost",
    dialect: "postgres",
});