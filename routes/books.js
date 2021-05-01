const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs')
const Book = require('../models/book');
const Author = require('../models/authors')
const uploadPath = path.join('public',Book.coverImageBasepath)
const { connected } = require('process');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//       callback(null, imageMimeTypes.includes(file.mimetype))
//     }
//   })
  
//All Books route
router.get('/', async(req, res) => {
    let query = Book.find()
    console.log(req.query.publishedBefore)
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index', {
            books : books,
            searchOptions : req.query
        })
    }
    catch{
        res.redirect('/')
    }
});

//New Books route
router.get('/new', async(req, res) => {
    renderNewPage(res, new Book())
});


//create  Books route
router.post('/', async(req, res) => {
    const fileName =  req.file != null ? req.file.filename : null
    console.log(fileName)
    const book = new Book({
        title  : req.body.title,
        author : req.body.author,
        publishDate : new Date(req.body.publishDate),
        pageCount : req.body.pageCount,
        coverImageName : fileName,
        description : req.body.description

    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    }
    catch{

        if (book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
});    


async function renderNewPage(res, book, hasError= false){

    try{
        const authors = await Author.find({})
        const params =  {
            authors : authors,
            book : book
        }

        if (hasError) 
            params.errorMessage = 'Error Creating Book'
            res.render('books/new',params)

    }
    catch{
        res.redirect('books')
    }

}

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if (err) console.error(err)
    })
}




module.exports = router; 
