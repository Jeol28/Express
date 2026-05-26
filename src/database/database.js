import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(
    process.env.DB_NAME || "TuProfe",
    process.env.DB_USER || "postgres",
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT) || 5433,
        dialect: "postgres",
        logging: false,
        dialectOptions: process.env.DATABASE_URL
            ? { ssl: { rejectUnauthorized: false } }  // requerido en Render/Railway
            : {},
    }
);
