import { Review } from "../models/Review.js";
import { User } from "../models/Users.js";
import { Follow } from "../models/Follow.js";

export function setupRelations() {
    User.hasMany(Review, { foreignKey: "username", as: "reviews", onDelete: "CASCADE", hooks: true });

    Review.belongsTo(User, { foreignKey: "username", as: "user" });

    User.belongsToMany(User, {
        through: "follows",
        as: "following",
        foreignKey: "follower",
        otherKey: "following",
    });
    User.belongsToMany(User, {
        through: "follows",
        as: "followers",
        foreignKey: "following",
        otherKey: "follower",
    });
}