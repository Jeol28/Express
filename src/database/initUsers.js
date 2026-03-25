import { User } from "../models/Users.js";

const usersData = [
    {
        username: "Golosina33",
        email: "golosina33@correo.com",
        password: "clave123",
        carrera: "Ingenieria de Sistemas",
        foto_perfil: "https://example.com/profiles/golosina33.jpg",
    },
    {
        username: "Pablosexto",
        email: "pablosexto@correo.com",
        password: "clave123",
        carrera: "Ingenieria Industrial",
        foto_perfil: "https://example.com/profiles/pablosexto.jpg",
    },
    {
        username: "JuanGuti",
        email: "juanguti@correo.com",
        password: "clave123",
        carrera: "Ingenieria Electronica",
        foto_perfil: "https://example.com/profiles/juanguti.jpg",
    },
    {
        username: "HQL",
        email: "hql@correo.com",
        password: "clave123",
        carrera: "Matematicas",
        foto_perfil: "https://example.com/profiles/hql.jpg",
    },
    {
        username: "Jp23",
        email: "jp23@correo.com",
        password: "clave123",
        carrera: "Ingenieria de Sistemas",
        foto_perfil: "https://example.com/profiles/jp23.jpg",
    },
    {
        username: "MariaGarcia",
        email: "mariagarcia@correo.com",
        password: "clave123",
        carrera: "Licenciatura en Educación Fisica",
        foto_perfil: "https://example.com/profiles/mariagarcia.jpg",
    },
    {
        username: "PedroPerez",
        email: "pedroperez@correo.com",
        password: "clave123",
        carrera: "Ingenieria Industrial",
        foto_perfil: "https://example.com/profiles/pedroperez.jpg",
    },
    {
        username: "LuciaMendez",
        email: "luciamendez@correo.com",
        password: "clave123",
        carrera: "Arquitectura",
        foto_perfil: "https://example.com/profiles/luciamendez.jpg",
    },
    {
        username: "RobertoGomez",
        email: "robertogomez@correo.com",
        password: "clave123",
        carrera: "Administracion de Empresas",
        foto_perfil: "https://example.com/profiles/robertogomez.jpg",
    },
    {
        username: "ElenaRivas",
        email: "elenarivas@correo.com",
        password: "clave123",
        carrera: "Ingenieria Civil",
        foto_perfil: "https://example.com/profiles/elenarivas.jpg",
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
