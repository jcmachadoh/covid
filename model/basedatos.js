var sqlite3 = require('sqlite3').verbose();

var database = new sqlite3.Database('data.db', err => {
    if (err) throw err;
    else console.log('connection creada');
});
let usuarios = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT, usuario TEXT, contrasenna TEXT, privilegios TEXT)`;
let positivos = `CREATE TABLE IF NOT EXISTS positivos (
    id INTEGER PRIMARY KEY,
    nombre TEXT, ci TEXT, edad TEXT,
    sexo TEXT, provincia TEXT, municipio Text, direccion TEXT, fechaingreso TEXT,
    fechapcr Text, categoria TEXT, unidad TEXT, fis TEXT)`;
let historico = `CREATE TABLE IF NOT EXISTS historicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT, ci TEXT, edad TEXT,
    sexo TEXT, provincia TEXT, municipio Text, direccion TEXT, fechaingreso TEXT,
    fechaalta TEXT, fk INTEGER, categoria TEXT, unidad TEXT)`;
let fallecidos = `CREATE TABLE IF NOT EXISTS fallecidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT, ci TEXT, edad TEXT,
    sexo TEXT, provincia TEXT, municipio Text, direccion TEXT, fechaingreso TEXT,
    fechadeseso TEXT, categoria TEXT, unidad TEXT)`;
let usuario = `INSERT INTO users(nombre, usuario, contrasenna, privilegios)
    VALUES('Administrador', 'jc', md5('a'), '10')`;


database.serialize(() => {
    database
        .run(usuarios, err => {
            if (err) throw err;
            else console.log('tabla usuario creada');
        })
        .run(positivos, err => {
            if (err) throw err;
            else console.log('tabla positivos creada');
        })
        .run(historico, err => {
            if (err) throw err;
            else console.log('tabla historico creada');
        })
        .run(fallecidos, err => {
            if (err) throw err;
            else console.log('tabla fallecidos ceada');
        })
        .run(usuario, err => {
            if (err) throw err;
            else console.log('usuario creado con exito');
        })
});

database.close(err => {
    if (err) throw err;
    else console.log('base de datos cerrada')
});