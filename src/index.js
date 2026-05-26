import app from "./app.js";
import {sequelize} from "./database/database.js";
import "./models/Professor.js";
import "./models/Review.js";
import "./models/Users.js";
import "./models/Follow.js";
import "./models/Comment.js";
import "./models/ReviewLike.js";
import "./models/CommentLike.js";
import { initializeProfessors } from "./database/initProfessors.js";
import { initializeReviews } from "./database/initReviews.js";
import { initializeUsers } from "./database/initUsers.js";
import { setupRelations } from "./models/relations.js";

async function init() {
    try {
        await sequelize
            .authenticate()
            .then(() => {
                console.log("Connection has been established successfully.");
            })
            .catch(err => {
                console.error("Unable to connect to the database:", err);
            });

        setupRelations();

        // DB_FORCE_RESET=true  → borra y recrea todas las tablas (reset total)
        // Por defecto: alter conserva los datos y solo ajusta columnas nuevas
        const forceReset = process.env.DB_FORCE_RESET === "true";
        await sequelize.sync({ force: forceReset, alter: !forceReset });

        if (forceReset) {
            await initializeProfessors();
            await initializeUsers();
            await initializeReviews();
        } else {
            // Solo insertar datos de seed si las tablas están vacías
            const { Professor } = await import("./models/Professor.js");
            const count = await Professor.count();
            if (count === 0) {
                await initializeProfessors();
                await initializeUsers();
                await initializeReviews();
            }
        }

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });

    } catch (error) {
        console.log(error);
    }
}

init();
