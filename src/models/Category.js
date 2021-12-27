const mongoose = require("mongoose");
const validator = require("validator");

const cateogrySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    parentId:{
        type:String,
    },
    slug:{
        type:String,
        unique:true, 
        required:true
    }

},{timestamps:true});


const Category = mongoose.model('Category', cateogrySchema);

module.exports = Category;

