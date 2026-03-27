import { Review } from "../models/Review.js";

const reviewsData = [
    {
        userId: 1,
        professorId: 1,
        likes: 20,
        content: "Gran profe me parece un muy bueno.",
        time: new Date("2026-03-24T20:26:00"),
        rating: 4,
        comment: 0,
    },
    {
        userId: 2,
        professorId: 1,
        likes: 100,
        content: "El profesor es un excelente maestro, me parece un muy buen maestro, se toma su tiempo para explicar hasta que todos entiendan el tema, no califica muy duro.",
        time: new Date("2026-03-24T20:26:00"),
        rating: 3,
        comment: 3,
    },
    {
        userId: 3,
        professorId: 2,
        likes: 1,
        content: "El profe me parece un muy buen maestro, se toma su tiempo para explicar hasta que todos entiendan el tema.",
        time: new Date("2026-03-24T20:26:00"),
        rating: 2,
        comment: 10,
    },
    {
        userId: 4,
        professorId: 2,
        likes: 1000,
        content: "Explica bien pero las evaluaciones son dificiles.",
        time: new Date("2026-03-24T20:26:00"),
        rating: 1,
        comment: 100,
    },
    {
        userId: 5,
        professorId: 3,
        likes: 10,
        content: "Buen profesor para empezar a programar.",
        time: new Date("2026-03-24T20:26:00"),
        rating: 5,
        comment: 1,
    },
    {
        userId: 6,
        professorId: 3,
        likes: 45,
        content: "Excelente explicacion de las derivadas, muy paciente.",
        time: new Date("2026-03-24T10:15:00"),
        rating: 5,
        comment: 2,
    },
    {
        userId: 7,
        professorId: 4,
        likes: 12,
        content: "Las tareas son largas pero se aprende mucho.",
        time: new Date("2026-03-24T14:30:00"),
        rating: 4,
        comment: 5,
    },
    {
        userId: 8,
        professorId: 4,
        likes: 8,
        content: "Muy aburrida la clase, solo lee las diapositivas.",
        time: new Date("2026-03-24T11:00:00"),
        rating: 2,
        comment: 1,
    },
    {
        userId: 9,
        professorId: 1,
        likes: 67,
        content: "El mejor profesor que he tenido.",
        time: new Date("2026-03-24T16:45:00"),
        rating: 5,
        comment: 12,
    },
    {
        userId: 10,
        professorId: 2,
        likes: 3,
        content: "Explica muy rapido y es dificil seguirle el ritmo.",
        time: new Date("2026-03-24T09:00:00"),
        rating: 3,
        comment: 0,
    },
    {
        userId: 1,
        professorId: 3,
        likes: 15,
        content: "Me gusta como explica los conceptos, aunque a veces se va por las ramas.",
        time: new Date("2026-03-24T20:26:00"),
        rating: 4,
        comment: 4,
    }
];

export async function initializeReviews (){
    const count = await Review.count();
    if (count === 0) {
        await Review.bulkCreate(reviewsData);
        console.log("Reviews initialized successfully.");
    } else {
        console.log("Reviews already initialized.");
    }
}
