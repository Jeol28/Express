import { Professor } from "../models/Professor.js";

const professorsData = [
    { name: "Dr. Alan Turing", department: "Computer Science" , subjects: ["Algorithms", "Cryptography"], foto_prof: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg"},
    { name: "Dra. Marie Curie", department: "Physics" , subjects: ["Quantum Mechanics", "Chemistry"], foto_prof: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Marie_Curie_c.1910-1915.jpg"},
    { name: "Dr. Albert Einstein", department: "Physics" , subjects: ["Relativity", "Quantum Mechanics"], foto_prof: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Albert_Einstein_1921.jpg"},
    { name: "Dra. Ada Lovelace", department: "Mathematics" , subjects: ["Calculus", "Statistics"], foto_prof: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Ada_Lovelace_portrait.jpg"}
];

export const initializeProfessors = async () => {
    try {
        const count = await Professor.count();
        if (count === 0) {
            await Professor.bulkCreate(professorsData);
            console.log("Professors creados correctamente.");
        }
    } catch (error) {
        console.error("Error initializing professors:", error);
    }
};
