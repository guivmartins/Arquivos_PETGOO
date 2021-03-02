const express = require('express')
var expressValidator = require("express-validator");
const app = express()
const bodyParser = require('body-parser')
var path = __dirname + '/views/';
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://cluster0.w9jfr.mongodb.net/PETGOO"

app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('PETGOO')
    
    app.listen(3000, () => {
        console.log('Servidor está rodando na porta 3000.')
    })
})

app.set('view engine', 'ejs')

app.route('/')
    .get(function (req, res) {
        const cursor = db.collection('data').find()
        res.render('index.ejs')
    })

    .post((req, res) => {
        db.collection('data').save(req.body, (err, result) => {
            if (err) return console.log(err)

            console.log('Dados gravados com sucesso.')
            res.redirect('/show')
        })
    })

app.route('/show')
    .get((req, res) => {
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('show.ejs', { data: results })
        })
    })

    app.route('/busca')
    .get((req, res) => {
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('busca.ejs', { data: results })
        })
    })

    app.route('/search')
    .get((req, res) => {
        var searchParams = req.query.query.toUpperCase().split(' ');
        var db = require('/db');
        var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
        Customer.find({ tags: { $all: searchParams } }, function (e, docs) {
            res.render('/busca', { results: true, search: req.query.query, list: docs });
        });
    });


app.route('/contact')
    .get(function (req, res) {
        res.render('contact.ejs')
        //res.sendFile(path + "contact.html");
    })

app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('data').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edit.ejs', { data: result })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var nome = req.body.nome
        var bairro = req.body.bairro
        var email = req.body.email
        var nomedopet = req.body.nomedopet
        var racadopet = req.body.racadopet
        var cordopet = req.body.cordopet

        db.collection('data').updateOne({ _id: ObjectId(id) }, {
            $set: {
                nome: nome,
                bairro: bairro,
                email: email,
                nomedopet: nomedopet,
                racadopet: racadopet,
                cordopet: cordopet
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/show')
            console.log('Dados atualizados com sucesso.')
        })
    })

app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id
        db.collection('data').deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Dado excluído com sucesso.')
            res.redirect('/show')
        })
    })

app.use('*', function (req, res) {
    res.sendFile(path + "404.html")
})



