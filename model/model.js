var sqlite3 = require('sqlite3').verbose();

var database = new sqlite3.Database('./model/data.db', err => {
    if (err) throw err;
    else console.log('');
});
module.exports = {
    obtenerUsuario(usuario, contrasenna) {
        return new Promise((resolve, reject) => {
            let sql = `select * from users where usuario = '${usuario}' and 
            contrasenna = '${contrasenna}'`;
            database.all(sql, (err, rows) => {
                if (err) {
                    console.log('error obteniendo usuario', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    },

    obtenerPositivos() {
        return new Promise((resolve, reject) => {
            let sql = `select * from positivos`;
            database.all(sql, (err, rows) => {
                if (err) {
                    console.log('error obteniendo positivos', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    async adicionarPositivo(datas) {
        datas.forEach(data => {
            return new Promise((resolve, eject) => {
                let id = Math.floor(Math.random(9) * 1000000000);
                if (data[12] == '') {
                    let sql = `insert into positivos
                (id, nombre, ci, edad, sexo, provincia, 
                municipio, direccion, fechaingreso, fechapcr, categoria, unidad, fis) values ( ${id},
                '${data[0]}', '${data[1]}', '${data[2]}', '${data[3]}', '${data[4]}',
                 '${data[5]}', '${data[6]}', '${data[7]}', '${data[8]}', '${data[9]}',
                 '${data[10]}', '${data[11]}');`
                    database.run(sql, err => {
                        if (err) {
                            reject(err);
                        } else {
                            let sql = `insert into historicos
                            (nombre, ci, edad, sexo, provincia, 
                            municipio, direccion, fechaingreso, fechaalta, fk, categoria, unidad) values (
                            '${data[0]}', '${data[1]}', '${data[2]}', '${data[3]}', '${data[4]}',
                            '${data[5]}', '${data[6]}', '${data[7]}', '', ${id}, '${data[9]}', '${data[10]}');`
                            database.run(sql, err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve('positivo adicionado con exito');
                                }
                            });
                        }
                    })
                } else {
                    let sql = `insert into historicos
                            (nombre, ci, edad, sexo, provincia, 
                            municipio, direccion, fechaingreso, fechaalta, fk, categoria, unidad) values (
                            '${data[0]}', '${data[1]}', '${data[2]}', '${data[3]}', '${data[4]}',
                            '${data[5]}', '${data[6]}', '${data[7]}', '${data[12]}', ${id}, '${data[9]}', '${data[10]}');`
                    database.run(sql, err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve('positivo adicionado con exito');
                        }
                    });
                }
            });
        });
    },

    eliminarPositivo(id) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM positivos WHERE id=${id};`
            database.run(sql, err => {
                if (err) {
                    console.log('error eliminando positivo', err);
                    reject(err);
                } else {
                    let sql = `delete from historicos where fk=${id}`;
                    database.run(sql, err => {
                        if (err) console.log('no se elimino del historico');
                        else console.log('eliminado del historico');
                    })
                    resolve('positivo eliminado');
                }
            });
        });
    },

    actualizarPositivo(data) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE positivos
            SET nombre='${data[1]}', ci='${data[2]}', edad='${data[3]}', sexo='${data[4]}',
            provincia='${data[5]}', municipio='${data[6]}', direccion='${data[7]}', 
            fechaingreso='${data[8]}', fechapcr='${data[9]}', categoria='${data[10]}', 
            unidad='${data[11]}', fis='${data[12]}' WHERE id=${data[0]} ;`;
            database.run(sql, err => {
                if (err) {
                    console.log('ocurrio un error actualizando positivo', err),
                        reject(err);
                } else {
                    let sql = `UPDATE historicos
                    SET nombre='${data[1]}', ci='${data[2]}', edad='${data[3]}', sexo='${data[4]}',
                    provincia='${data[5]}', municipio='${data[6]}', direccion='${data[7]}',
                    fechaingreso='${data[8]}', fechaalta='', categoria='${data[10]}',
                    unidad='${data[11]}' WHERE fk=${data[0]};`;
                    database.run(sql, err => {
                        if (err) console.log('error actualizando historico', err);
                        else console.log('historico actulizado');
                    })
                    resolve('positivo actualizado')
                }
            });
        })
    },

    obtenerPositivoPorId(id) {
        return new Promise((resolve, reject) => {
            let sql = `select * from positivos where id=${id}`;
            database.all(sql, (err, row) => {
                if (err) {
                    console.log('error al obtener positivo', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    altaMedica(id) {
        return new Promise((resolve, reject) => {
            let date = new Date()
            let fecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            let sql = `update historicos set fechaalta='${fecha}' where fk=${id}`;
            database.run(sql, err => {
                if (err) {
                    console.log('ha ocurrido un error', err);
                    reject(err);
                } else {
                    let sql = `DELETE FROM positivos WHERE id=${id};`
                    database.run(sql, err => {});
                    resolve('se ha dado el alta medica');
                }
            });
        });
    },

    obetenerHistorico() {
        return new Promise((resolve, reject) => {
            let sql = `select * from historicos`;
            database.all(sql, (err, rows) => {
                if (err) {
                    console.log('ha ocurrido un error obteniendo historicos');
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },

    filtrarDatos(data) {
        return new Promise((resolve, reject) => {
            let sql = `select * from '${data[0]}' where nombre LIKE '${data[1]}' OR ci LIKE '${data[2]}'
            OR categoria LIKE '${data[3]}' OR unidad LIKE '${data[4]}'`;
            database.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    },

    buscar(data) {
        return new Promise((resolve, reject) => {
            let positivos = `select * from positivos where nombre LIKE '${data}' OR ci LIKE '${data}'`;
            let historicos = `select * from historicos where nombre LIKE '${data}' OR ci LIKE '${data}'`;
            var error;
            var datos = [];
            new Promise((resolve, reject) => {
                database.all(positivos, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows);
                    }
                });
            }).then(ass => {
                new Promise((resolve, reject) => {
                    database.all(historicos, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve([ass, rows]);
                        }
                    });
                }).then(asss => {
                    resolve(asss);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    },

    listarFallecidos() {
        return new Promise((resolve, reject) => {
            let sql = `select * from fallecidos`;
            database.all(sql, (err, rows) => {
                if (err) {
                    console.log('ha ocurrido un error obteniendo historicos');
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },

    fallecido(id) {
        return new Promise((resolve, reject) => {
                this.obtenerPositivoPorId(id)
                    .then(result => {
                        let hoy = new Date();
                        let fecha = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
                        let sql = `UPDATE historicos SET fechaalta='FALLECIDO' WHERE fk=${id};`;
                        database.run(sql, err => {
                            if (err) {
                                reject('error actualizando historico', err);
                            } else {

                                let sql = `insert into fallecidos
                                    (nombre, ci, edad, sexo, provincia, 
                                    municipio, direccion, fechaingreso, fechadeseso, categoria, unidad) values (
                                    '${result[0].nombre}', '${result[0].ci}', '${result[0].edad}', '${result[0].sexo}', '${result[0].provincia}',
                                    '${result[0].municipio}', '${result[0].direccion}', '${result[0].fechaingreso}',
                                    '${fecha}', '${result[0].categoria}', '${result[0].unidad}');`
                                database.run(sql, err => {
                                    if (err) reject('error');
                                    else console.log('success');
                                })
                            }
                            resolve('datos adicionados con exito');
                        });
                    });
                this.altaMedica(id)
                    .then(result => {
                        console.log('');
                    })
                    .catch(err => {

                    });
            })
            .catch(err => {

            });
    }
}