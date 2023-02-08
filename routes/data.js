var express = require('express');
var model = require('../model/model');
var router = express.Router();
var xlsxfile = require('read-excel-file/node');
var path = require('path');
var Excel = require('Excel4node');
var fs = require('fs');

router
    .get('/importar', (req, res) => {
        res.render('importar', {});
    })
    .get('/filtrar', (req, res) => {
        res.render('filtrar', {});
    })
    .get('/exportarpositivos', (req, res) => {
        model.obtenerPositivos()
            .then(positivos => {
                var workbook = new Excel.Workbook();
                var worksheet = workbook.addWorksheet('CAMILITOS');
                var encabezado = workbook.createStyle({
                    font: {
                        bold: true,
                        size: 12
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    }
                });
                worksheet.row(1).filter();
                worksheet.row(1).setHeight(40);
                worksheet.row(1).freeze();
                worksheet.cell(1, 1).string('No').style(encabezado);
                worksheet.cell(1, 2).string('Nombre(s) y apellidos').style(encabezado);
                worksheet.cell(1, 3).string('Fecha de Ingreso').style(encabezado);
                worksheet.cell(1, 4).string('Edad').style(encabezado);
                worksheet.cell(1, 5).string('Sexo').style(encabezado);
                worksheet.cell(1, 6).string('Raza').style(encabezado);
                worksheet.cell(1, 7).string('CI').style(encabezado);
                worksheet.cell(1, 8).string('Direccion').style(encabezado);
                worksheet.cell(1, 9).string('ÁREA').style(encabezado);
                worksheet.cell(1, 10).string('Municipio').style(encabezado);
                worksheet.cell(1, 11).string('Provincia').style(encabezado);
                worksheet.cell(1, 12).string('Condicion').style(encabezado);
                worksheet.cell(1, 13).string('CENTRO').style(encabezado);
                worksheet.cell(1, 14).string('País').style(encabezado);
                worksheet.cell(1, 15).string('FIS').style(encabezado);
                worksheet.cell(1, 16).string('FTM').style(encabezado);
                worksheet.cell(1, 17).string('Tos').style(encabezado);
                worksheet.cell(1, 18).string('Fiebre').style(encabezado);
                worksheet.cell(1, 19).string('Rinorrea').style(encabezado);
                worksheet.cell(1, 20).string('Congestion Nasal').style(encabezado);
                worksheet.cell(1, 21).string('Espectoracion').style(encabezado);
                worksheet.cell(1, 22).string('cefalea ').style(encabezado);
                worksheet.cell(1, 23).string('dificultad respitatoria').style(encabezado);
                worksheet.cell(1, 24).string('dolor de garganta').style(encabezado);
                worksheet.cell(1, 25).string('Otros').style(encabezado);
                worksheet.cell(1, 26).string('Muestra').style(encabezado);
                worksheet.cell(1, 27).string('Centro ').style(encabezado);
                worksheet.cell(1, 28).string('fcha envio').style(encabezado);
                worksheet.cell(1, 29).string('Result por Stgo').style(encabezado);
                worksheet.cell(1, 30).string('Resut por Gtmo').style(encabezado);
                worksheet.cell(1, 31).string('Result por IPK').style(encabezado);
                worksheet.cell(1, 32).string('Resultado').style(encabezado);
                worksheet.cell(1, 33).string('CT').style(encabezado);
                worksheet.cell(1, 34).string('fcha resultado').style(encabezado);
                let ruta = './public/document/export/total.xlsx';
                workbook.write(ruta);
                let cont = 2;
                positivos.forEach(value => {
                    worksheet.cell(cont, 1).number(cont - 1);
                    worksheet.cell(cont, 2).string(value.nombre);
                    worksheet.cell(cont, 3).string(value.fechaingreso);
                    worksheet.cell(cont, 4).string(value.edad);
                    worksheet.cell(cont, 5).string(value.sexo);
                    // worksheet.cell(1, 6).string('Raza');
                    worksheet.cell(cont, 7).string(value.ci);
                    worksheet.cell(cont, 8).string(value.direccion);
                    // worksheet.cell(1, 9).string('ÁREA');
                    worksheet.cell(cont, 10).string(value.municipio);
                    worksheet.cell(cont, 11).string(value.provincia);
                    worksheet.cell(cont, 12).string('Evolutivo');
                    worksheet.cell(cont, 13).string('Camilitos');
                    worksheet.cell(cont, 14).string('Republica de Cuba');
                    worksheet.cell(cont, 15).string(value.fis);
                    // worksheet.cell(cont, 16).string('FTM');
                    // worksheet.cell(cont, 17).string('Tos');
                    // worksheet.cell(cont, 18).string('Fiebre');
                    // worksheet.cell(cont, 19).string('Rinorrea');
                    // worksheet.cell(cont, 20).string('Congestion Nasal');
                    // worksheet.cell(cont, 21).string('Espectoracion');
                    // worksheet.cell(cont, 22).string('cefalea ');
                    // worksheet.cell(cont, 23).string('dificultad respitatoria');
                    // worksheet.cell(cont, 24).string('dolor de garganta');
                    // worksheet.cell(cont, 25).string('Otros');
                    // worksheet.cell(cont, 26).string('Muestra');
                    // worksheet.cell(cont, 27).string('Centro ');
                    worksheet.cell(cont, 28).string(value.fechapcr);
                    // worksheet.cell(cont, 29).string('Result por Stgo');
                    // worksheet.cell(cont, 30).string('Resut por Gtmo');
                    // worksheet.cell(cont, 31).string('Result por IPK');
                    // worksheet.cell(cont, 32).string('Resultado');
                    // worksheet.cell(cont, 33).string('CT');
                    // worksheet.cell(cont, 34).string('fcha resultado');
                    cont++;
                });
                const file = `${__dirname}/../public/document/export/total.xlsx`
                res.download(file);
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/exportarevolutivos', (req, res) => {
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
                var workbook = new Excel.Workbook();
                var encabezado = workbook.createStyle({
                    body: {
                        background: '#46EB5C'
                    },
                    font: {
                        bold: true,
                        size: 12
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    }
                });
                var worksheet = workbook.addWorksheet('Sheet 1');
                worksheet.cell(1, 1, 1, 26, true).string('MODELO PARA EL REGISTRO DE ÓRDENES DE PCR E IMPORTAR EN EL SOFTWARE MONITOR EPIDEMEOLÓGICO DE CUBA').style(encabezado);;
                worksheet.cell(2, 1, 2, 9, true).string('Los datos están en optimas condiciones, puede importar el Excel al sistema.').style(encabezado);
                worksheet.cell(2, 10, 2, 14, true).string('Datos del Paciente.').style(encabezado);
                worksheet.cell(2, 15, 2, 18, true).string('Lugar donde se toma la muestra (Llenar solo una columna)').style(encabezado);
                worksheet.cell(2, 19, 2, 20, true).string('Procedencia del extranjero').style(encabezado);
                worksheet.cell(2, 21, 2, 26, true).string('Datos clínicos').style(encabezado);
                worksheet.cell(3, 1).string('No. Muestra');
                worksheet.cell(3, 2).string('No. Paquete');
                worksheet.cell(3, 3).string('VIP');
                worksheet.cell(3, 4).string('Tipo de sujeto');
                worksheet.cell(3, 5).string('Nombre(s) y apellidos');
                worksheet.cell(3, 6).string('No. Carnet de Identidad');
                worksheet.cell(3, 7).string('No. Pasaporte');
                worksheet.cell(3, 8).string('Edad');
                worksheet.cell(3, 9).string('Sexo');
                worksheet.cell(3, 10).string('Provincia');
                worksheet.cell(3, 11).string('Municipio');
                worksheet.cell(3, 12).string('Teléfono de contacto (preferible un celular)');
                worksheet.cell(3, 13).string('E-mail de contacto');
                worksheet.cell(3, 14).string('Dirección particular');
                worksheet.cell(3, 15).string('Área de salud');
                worksheet.cell(3, 16).string('Hospital');
                worksheet.cell(3, 17).string('Centro de aislamiento');
                worksheet.cell(3, 18).string('Laboratorio');
                worksheet.cell(3, 19).string('Punto de entrada al país');
                worksheet.cell(3, 20).string('País de procedencia');
                worksheet.cell(3, 21).string('Tipo de estudio');
                worksheet.cell(3, 22).string('Fecha de la toma de la muestra');
                worksheet.cell(3, 23).string('Tipo de muestra');
                worksheet.cell(3, 24).string('Impresión diagnóstica');
                worksheet.cell(3, 25).string('Fecha de inicio de los síntomas');
                worksheet.cell(3, 26).string('Laboratorio que realizará el análisis de la muestra (Despacho automático)');
                let cont = 1;
                let aux = new Date()
                let xxx = aux.getFullYear() + "" + (aux.getMonth() + 1) + "" + aux.getDate();
                evolutivo.forEach(element => {
                    worksheet.cell((cont + 3), 1).number(cont - 1);
                    worksheet.cell((cont + 3), 2).string('EMCC' + xxx + 'P1');
                    worksheet.cell((cont + 3), 3).string('No');
                    worksheet.cell((cont + 3), 4).string('Residentes');
                    worksheet.cell((cont + 3), 5).string(element.nombre);
                    worksheet.cell((cont + 3), 6).string(element.ci);
                    worksheet.cell((cont + 3), 8).string(element.edad);
                    worksheet.cell((cont + 3), 9).string(element.edad);
                    worksheet.cell((cont + 3), 10).string(element.sexo);
                    worksheet.cell((cont + 3), 11).string(element.provincia);
                    worksheet.cell((cont + 3), 12).string(element.municipio);
                    worksheet.cell((cont + 3), 14).string(element.direccion);
                    worksheet.cell((cont + 3), 17).string('CA-Escuela-Militar-Camilo-Cienfuegos(GTM)');
                    worksheet.cell((cont + 3), 21).string('Sospechoso');
                    worksheet.cell((cont + 3), 22).string(hoy);
                    worksheet.cell((cont + 3), 23).string('Exudado nasofaringeo');
                    worksheet.cell((cont + 3), 24).string('Sintomático');
                    worksheet.cell((cont + 3), 25).string(element.fis);
                    worksheet.cell((cont + 3), 26).string('Lab-CPHEM-GTMO');
                    cont++;
                })
                let ruta = './public/document/export/evolutivos.xlsx';
                workbook.write(ruta);
                const file = `${__dirname}/../public/document/export/evolutivos.xlsx`
                res.download(file);
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
    })
    .get('/listapcr', (req, res) => {

        res.render('index', {});
    })
    .get('/graficoHistorico', (req, res) => {
        const fechaInicio = "26/06/2021";
        let aux = new Date()
        const hoy = aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getFullYear();
        let fechas = [fechaInicio];
        model
            .obetenerHistorico()
            .then(data => {

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('_testcb(\'{"message": "Hello world!"}\')');
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            });

    })
    .post('/recibir', (req, res) => {
        if (!req.files) {
            console.log('no se ha subido fichero');
            return null;
        };
        var excel = req.files.excel;
        var filename = excel.name;
        excel.mv(path.join(__dirname + '/../public', 'document/') + filename, async function(err) {
            if (err) return res.status(400).send(err);
            xlsxfile(path.join(__dirname + '/../public', 'document/') + filename).then(rows => {
                let cont = 0;
                let data = [];
                rows.forEach(value => {
                    if (value[4] == '') {

                    } else {
                        cont++;
                        let nombre = '';
                        if (value[3] != null) {
                            nombre = value[3];
                        } else {
                            nombre = 'Sin precisar';
                        }
                        let sexo = '';
                        if (value[10] != null) {
                            if (value[11] == 'M') sexo = 'Masculino';
                            else sexo = 'Femenino';
                        } else sexo = 'Sin precisar';
                        let ingreso = '';
                        if (value[4] != null) {
                            let f = new Date(value[4]);
                            if (f == 'Invalid Date') ingreso = 'Sin precisar';
                            else ingreso = (f.getDate() + 1) + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
                        } else ingreso = 'Sin precisar';
                        let ci = '';
                        if (value[12] == null) ci = 'Sin precisar';
                        else ci = value[12];
                        let edad = '';
                        if (value[8] == null) edad = 'Sin precisar';
                        else edad = value[8];
                        let provincia = '';
                        if (value[16] != null) provincia = value[17];
                        else provincia = 'Sin precisar';
                        let municipio = '';
                        if (value[15] != null) municipio = value[16];
                        else municipio = 'Sin precisar';
                        direccion = '';
                        if (value[13] != null) direccion = value[13];
                        else direccion = 'Sin precisar';
                        let pcr = '';
                        if (value[33] != null) {
                            let f = new Date(value[33]);
                            if (f == 'Invalid Date') pcr = 'Sin precisar';
                            else pcr = (f.getDate() + 1) + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
                        } else pcr = 'Sin precisar';
                        let categoria = '';
                        if (value[6] != null) categoria = value[6];
                        else categoria = 'Sin precisar';
                        let unidad = '';
                        if (value[7] != null) unidad = value[7];
                        else unidad = 'Sin precisar';
                        let fis = '';
                        if (value[20] != null) {
                            let f = new Date(value[20]);
                            if (f == 'Invalid Date') fis = 'Sin precisar';
                            else fis = (f.getDate() + 1) + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
                        } else fis = 'Sin precisar';
                        let egreso;
                        if (value[5] == null) {
                            egreso = '';
                        } else {
                            let f = new Date(value[5]);
                            if (f == 'Invalid Date') egreso = 'Sin precisar';
                            else egreso = (f.getDate() + 1) + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
                        }
                        let aux = [nombre, ci, edad, sexo, provincia, municipio, direccion, ingreso,
                            pcr, categoria, unidad, fis, egreso
                        ]
                        data.push(aux);
                    }
                });
                model
                    .adicionarPositivo(data)
                    .then(result => {
                        console.log('')
                    })
                    .catch(err => {
                        res.render('error', { error: err, message: 'ha ocurrido un error' });
                    });
            });
        });
        res.redirect('/progress');
    })
    .post('/busqueda', (req, res) => {
        let data = [req.body.tabla, req.body.nombre, req.body.ci, req.body.categoria, req.body.unidad]
        model.filtrarDatos(data)
            .then(results => {
                res.render('busqueda', {
                    cantidad: results.length,
                    results: results,
                    tipo: req.body.tabla
                });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            });
    })
    .post('/buscar', (req, res) => {
        let data = req.body.busqueda;
        model.buscar(data)
            .then(results => {
                res.render('busqueda', {
                    cantidad: (results[0].length + results[1].length),
                    results: results,
                    tipo: 'buscar'
                });
            })
            .catch(err => {
                res.render('error', { error: err, message: 'ha ocurrido un error' });
            })
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

module.exports = router;