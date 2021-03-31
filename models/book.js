const mongoose = require('mongoose');
const path = require('path')
const coverImageBasepath = 'uploads/bookcovers'

const bookSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    publishDate : {
        type : Date,
        required : true
    },
    pageCount: {
        type : Number,
        required : true,
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author : {
        type : mongoose.Schema.Types.ObjectID,
        required : true,
        ref : 'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if (this.coverImageName != null){
        return path.join('/', coverImageBasepath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)

module.exports.coverImageBasepath = coverImageBasepath

