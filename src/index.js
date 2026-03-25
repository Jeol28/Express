import app from "./app.js";
import {sequelize} from "./database/database.js";
import "./models/Review.js";
import { initializeReviews } from "./database/initReviews.js";

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

        await sequelize
        .sync({ force: true });

        await initializeReviews();

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });


    } catch (error) {
        console.log(error);
    }
}


init();
