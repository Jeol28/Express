import { Review } from "../models/Review.js";
import { User } from "../models/Users.js";

export function setupRelations() {
    User.hasMany(Review, { foreignKey: "username", as: "reviews", onDelete: "CASCADE", hooks: true });

    Review.belongsTo(User, { foreignKey: "username", as: "user" });
}