import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("TuProfe", "postgres", "949706", {
    port: 5432,
    host: "localhost",
    dialect: "postgres",
});