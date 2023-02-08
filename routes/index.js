var express = require('express');
var model = require('../model/model');
var router = express.Router();
var path = require('path');
const { hostname } = require('os');


router
/* GET home page. */
    .get('/', function(req, res, next) {
        res.render('login', { title: 'Autenticacion' });
    })
    .post('/autenticacion', (req, res, next) => {
        var email = req.body.correo;
        var password = req.body.contrasena;
        model
            .obtenerUsuario(email, password)
            .then(user => {
                if (user.length == 1) {
                    res.redirect('/home');
                } else console.log('usuario no encontrado')
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            });
    })
    .get('/home', (req, res) => {
        model.obtenerPositivos()
            .then(positivos => {
                model
                    .obetenerHistorico()
                    .then(historicos => {
                        let altas = [];
                        let fallecidos = 0;
                        let hoy = new Date();
                        let aux = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
                        historicos.forEach(element => {
                            if (element.fechaalta == aux) {
                                altas.push(element);
                            }
                            if (element.fechaalta == 'FALLECIDO') {
                                console.log('entre');
                                fallecidos++;
                            }
                        });
                        var h = obtenerGrafica(historicos);
                        var u = obtenerUnidades(positivos);
                        res.render('index', {
                            title: 'Gestion de contactos',
                            totalPositivos: positivos.length,
                            totalHistorico: historicos.length,
                            altas: altas.length,
                            fallecidos: fallecidos,
                            dias: h[0],
                            altass: h[2],
                            ingresos: h[1],
                            unidades: u
                        });
                    })
                    .catch(err => {
                        res.render('error', { error: err, message: 'ha ocurrido un error' });
                    })
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/adicionar', (req, res) => {
        res.render('adicionar', {});
    })
    .get('/progress', (req, res) => {
        res.render('progressbar', {});
    })
    .get('/nosotros', (req, res) => {
        res.render('about', {});
    })
    .get('/listapositivos', (req, res) => {
        model.obtenerPositivos()
            .then(positivos => {
                res.render('listapositivos', {
                    title: 'Gestion de contactos',
                    positivos: positivos,
                    ruta: path.join(__dirname, '../', 'public', 'images')
                });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/listaaltas', (req, res) => {
        model.obetenerHistorico()
            .then(result => {
                let altas = [];
                let hoy = new Date();
                let aux = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
                result.forEach(element => {
                    if (element.fechaalta == aux) {
                        altas.push(element);
                    }
                });
                res.render('listaaltas', { 'altas': altas });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get("/fallecidos", (req, res) => {
        model.listarFallecidos()
            .then(result => {
                console.log(result);
                res.render('fallecidos', { 'fallecidos': result });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get("/fallecido/:id", (req, res) => {
        let id = req.params.id;
        model.fallecido(id)
            .then(result => {
                res.redirect('/listapositivos');
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/eliminarpositivo/:id', (req, res) => {
        let id = req.params.id
        model.eliminarPositivo(id)
            .then(result => {
                res.redirect('/listapositivos');
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            });
    })
    .get('/informacion/:id', (req, res) => {
        let id = req.params.id;
        model.obtenerPositivoPorId(id)
            .then(result => {
                data = fechaEvolutivo(result[0]);
                res.render('informacion', {
                    positivos: result,
                    evolutivo: data
                });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/actualizarpositivo/:id', (req, res) => {
        let id = req.params.id;
        model.obtenerPositivoPorId(id)
            .then(positivo => {
                res.render('actualizar', { positivo: positivo[0] });
            })
            .catch(err => {

            });
    })
    .get('/historicos', (req, res) => {
        model
            .obetenerHistorico()
            .then(historicos => {
                res.render('historicos', { historicos: historicos })
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/altamedica/:id', (req, res) => {
        let id = req.params.id;
        model.altaMedica(id)
            .then(result => {
                res.redirect('/home');
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/evolutivos', (req, res) => {
        model.obtenerPositivos()
            .then(positivos => {
                let fecha = new Date()
                let hoy = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
                let evolutivo = [];
                positivos.forEach(elemnt => {
                    data = fechaEvolutivo(elemnt);
                    if (data == hoy) {
                        evolutivo.push(elemnt);
                    }
                });
                res.render('listapositivos', {
                    positivos: evolutivo,
                });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .post('/adicionar', (req, res) => {
        let fechapcr = formatearFecha(req.body.fechapcr);
        let nombre = req.body.nombre + " " + req.body.primerapellido + " " + req.body.segundoapellido;
        let data = [nombre, req.body.ci, req.body.edad, req.body.sex, req.body.provincia, req.body.municipio,
            req.body.direccion, req.body.fechaingreso, fechapcr, req.body.categoria.toUpperCase(),
            req.body.unidad, req.body.fis, ''
        ]
        model
            .adicionarPositivo(data)
            .then(result => {
                res.redirect('/listapositivos');
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            });
    })
    .post('/actualizar', (req, res) => {
        let fechapcr = formatearFecha(req.body.fechapcr);
        let data = [req.body.id, req.body.nombre, req.body.ci, req.body.edad, req.body.sex,
            req.body.provincia, req.body.municipio, req.body.direccion, req.body.fechaingreso,
            fechapcr, req.body.categoria, req.body.unidad, req.body.fis
        ]
        model
            .actualizarPositivo(data)
            .then(result => {
                res.redirect('/listapositivos');
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            });
    })

function fechaEvolutivo(elemnt) {
    let a = elemnt.fechapcr.split('/');
    let fechapcr = new Date();
    fechapcr.setDate(a[0]);
    fechapcr.setMonth(a[1] - 1);
    fechapcr.setFullYear(a[2]);
    fechapcr.setDate(fechapcr.getDate() + 6);
    return fechapcr.getDate() + '/' + (fechapcr.getMonth() + 1) + '/' + fechapcr.getFullYear();
}

function formatearFecha(fecha) {
    let a = fecha.split('-')
    return a[2] + '/' + a[1] + '/' + a[0];
}

function obtenerGrafica(arr) {
    let a = "26/06/2021".split('/');
    let fechapcr = new Date();
    fechapcr.setDate(a[0]);
    fechapcr.setMonth(a[1] - 1);
    fechapcr.setFullYear(a[2]);
    let inicio = fechapcr.getDate() + '/' + (fechapcr.getMonth() + 1) + '/' + fechapcr.getFullYear();
    let fecha = new Date()
    let hoy = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
    let fechas = [];
    while (inicio.toLocaleString() != hoy.toLocaleString()) {
        fechapcr.setDate(fechapcr.getDate() + 1);
        inicio = fechapcr.getDate() + '/' + (fechapcr.getMonth() + 1) + '/' + fechapcr.getFullYear();
        fechas.push(inicio.toLocaleString());
    }
    arr.forEach(element => {
        if (fechas.length == 0) {
            fechas.push(element.fechaingreso);
        } else {
            if (fechas.lastIndexOf(element.fechaingreso) == -1) {
                fechas.push(element.fechaingreso);
            }
        }
    });
    let ingresos = new Array(fechas.length);
    let altas = new Array(fechas.length);
    let cont = -1;
    fechas.forEach(sd => {
        cont++;
        let cant = 0;
        arr.forEach(element => {
            if (sd == element.fechaingreso) {
                cant++
            }
        });
        ingresos[cont] = cant;
    });
    let contador = -1;
    fechas.forEach(sd => {
        contador++;
        let cant = 0;
        arr.forEach(element => {
            if (sd == element.fechaalta) {
                cant++
            }
        });
        altas[contador] = cant;
    });
    return [fechas, ingresos, altas];
}

function obtenerUnidades(arr) {
    let lista = [];
    arr.forEach(element => {
        if (lista.length == 0) {
            lista.push(element.unidad);
        } else {
            if (lista.lastIndexOf(element.unidad) == -1) {
                lista.push(element.unidad);
            }
        }
    });
    var data = [];
    for (var i = 0; i < lista.length; i++) {
        var contOfi = 0;
        var contSol = 0;
        var contCiv = 0;
        var contCDT = 0;
        var contSGI = 0;
        var contTCiv = 0;
        var contSOfc = 0;
        arr.forEach(element => {
            if (element.unidad == lista[i]) {
                switch (element.categoria) {
                    case 'OFICIAL':
                        contOfi++;
                        break;
                    case 'SOLDADO':
                        contSol++;
                        break;
                    case 'CIVIL':
                        contCiv++;
                        break;
                    case 'CADETE':
                        contCDT++;
                        break;
                    case 'SGI':
                        contSGI++;
                        break;
                    case 'T CIVIL':
                        contTCiv++;
                        break;
                    case 'SUB OFICIAL':
                        contSOfc++;
                        break;
                    default:
                        break;
                }
            }
        });
        data[i] = {
            'unidad': lista[i],
            'oficiales': contOfi,
            'soldados': contSol,
            'civiles': contCiv,
            'cadetes': contCDT,
            'sgi': contSGI,
            'tciviles': contTCiv,
            'sobficiales': contSOfc
        }
    }
    return data;
}
module.exports = router;