const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');


const AdminShenma = new Schema({
    AccountName : { type: String , required: true , unique: true },
    email : { type: String , required: true , unique: true },
    password : { type: String , required: true },

});

AdminShenma.pre('save', function (next) {
    bcryptjs.hash(this.password, 10,  (err, hash) =>{
        this.password = hash;

        next();
    });
});

AdminShenma.plugin(timestamps);
module.exports = mongoose.model('Admin', AdminShenma);
