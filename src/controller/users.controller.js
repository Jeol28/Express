import { User } from "../models/Users.js";

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