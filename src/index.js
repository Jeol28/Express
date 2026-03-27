import app from "./app.js";
import {sequelize} from "./database/database.js";
import "./models/Professor.js";
import "./models/Review.js";
import "./models/Users.js";
import { initializeProfessors } from "./database/initProfessors.js";
import { initializeReviews } from "./database/initReviews.js";
import { initializeUsers } from "./database/initUsers.js";
import { setupRelations } from "./models/relations.js";
import "./models/Follow.js";

async function init() {
    try{
        await sequelize
        .authenticate()
        .then(() => {
            console.log("Connection has been established successfully.");
        })
        .catch(err => {
            console.error("Unable to connect to the database:", err);
        });

        setupRelations();

        await sequelize
        .sync({ force: true });

        await initializeProfessors();
        await initializeUsers();

        await initializeReviews();

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });


    } catch (error) {
        console.log(error);
    }
}


init();
