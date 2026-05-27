import { Sequelize } from "sequelize";
import "dotenv/config";

// En producción (Render) Supabase provee DATABASE_URL completa.
// En local usamos las variables individuales del .env.
export const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
          dialect: "postgres",
          logging: false,
          dialectOptions: {
              ssl: { rejectUnauthorized: false },
          },
      })
    : new Sequelize(
          process.env.DB_NAME || "TuProfe",
          process.env.DB_USER || "postgres",
          process.env.DB_PASS,
          {
              host: process.env.DB_HOST || "localhost",
              port: parseInt(process.env.DB_PORT) || 5433,
              dialect: "postgres",
              logging: false,
          }
      );
