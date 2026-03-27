import { Professor } from "../models/Professor.js";
import { Review } from "../models/Review.js";

export const getProfessors = async (req, res) => {
    try {
        const professors = await Professor.findAll();
        res.json(professors);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProfessorById = async (req, res) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);
        
        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }
        res.json(professor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProfessorReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);
        
        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }

        const reviews = await Review.findAll({
            where: { professorId: id }
        });
        res.json(reviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
