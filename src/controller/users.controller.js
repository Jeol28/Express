import { User } from "../models/Users.js";
import { Review } from "../models/Review.js";

export const getUsers = async (req, res) => {
    const users = await User.findAll();
    return res.json(users);
}

export const createUser = async (req, res) => {
    const newUser = await User.create(req.body);
    return res.json(newUser);
}

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    try{
        await user.update(req.body);
    } catch (error) {
        console.log(error);
    }

    return res.json(user);
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    try{
        await user.destroy();
    } catch (error) {
        console.log(error);
    }
    return res.sendStatus(204);
}

export const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    return res.json(user);
}

export const getUserReviews = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const reviews = await Review.findAll({ where: { username: user.username } });
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}