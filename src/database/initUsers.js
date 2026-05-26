import { User } from "../models/Users.js";

const usersData = [
    // IDs son Firebase UIDs de ejemplo (en producción los asigna Firebase Auth)
    {
        id: "user_demo_001",
        username: "Golosina33",
        email: "golosina33@correo.com",
        carrera: "Ingenieria de Sistemas",
        foto: "https://example.com/profiles/golosina33.jpg",
    },
    {
        id: "user_demo_002",
        username: "Pablosexto",
        email: "pablosexto@correo.com",
        carrera: "Ingenieria Industrial",
        foto: "https://example.com/profiles/pablosexto.jpg",
    },
    {
        id: "user_demo_003",
        username: "JuanGuti",
        email: "juanguti@correo.com",
        carrera: "Ingenieria Electronica",
        foto: "https://example.com/profiles/juanguti.jpg",
    },
    {
        id: "user_demo_004",
        username: "HQL",
        email: "hql@correo.com",
        carrera: "Matematicas",
        foto: "https://example.com/profiles/hql.jpg",
    },
    {
        id: "user_demo_005",
        username: "Jp23",
        email: "jp23@correo.com",
        carrera: "Ingenieria de Sistemas",
        foto: "https://example.com/profiles/jp23.jpg",
    },
    {
        id: "user_demo_006",
        username: "MariaGarcia",
        email: "mariagarcia@correo.com",
        carrera: "Licenciatura en Educación Fisica",
        foto: "https://example.com/profiles/mariagarcia.jpg",
    },
    {
        id: "user_demo_007",
        username: "PedroPerez",
        email: "pedroperez@correo.com",
        carrera: "Ingenieria Industrial",
        foto: "https://example.com/profiles/pedroperez.jpg",
    },
    {
        id: "user_demo_008",
        username: "LuciaMendez",
        email: "luciamendez@correo.com",
        carrera: "Arquitectura",
        foto: "https://example.com/profiles/luciamendez.jpg",
    },
    {
        id: "user_demo_009",
        username: "RobertoGomez",
        email: "robertogomez@correo.com",
        carrera: "Administracion de Empresas",
        foto: "https://example.com/profiles/robertogomez.jpg",
    },
    {
        id: "user_demo_010",
        username: "ElenaRivas",
        email: "elenarivas@correo.com",
        carrera: "Ingenieria Civil",
        foto: "https://example.com/profiles/elenarivas.jpg",
    },
];

export async function initializeUsers() {
    try {
        const count = await User.count();
        if (count === 0) {
            await User.bulkCreate(usersData);
            console.log("Usuarios iniciales creados exitosamente.");
        } else {
            console.log("Los usuarios ya estaban inicializados.");
        }
    } catch (error) {
        console.error("Error al crear usuarios iniciales:", error);
    }
}
