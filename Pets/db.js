var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cluster0.w9jfr.mongodb.net/PETGOO');
 
var customerSchema = new mongoose.Schema({
    nome: String,
    bairro: String,
    
}, { collection: 'customers' }
);
 
module.exports = { Mongoose: mongoose, CustomerSchema: customerSchema }