import { User } from "../models/Users.js";
import { Review } from "../models/Review.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        await user.update(req.body);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserReviews = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const reviews = await Review.findAll(
            { where: { userId: user.id } }
        );
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}