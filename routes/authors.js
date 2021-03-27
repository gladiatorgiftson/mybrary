const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const Author = require('../models/authors');

//all authours route
router.get('/', async(req, res) => {
    let searchOptions ={}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await  Author.find(searchOptions)
        res.render('authors/index', {
            authors : authors,
            searchOptions : req.query
        })
        console.log(searchOptions)
    } catch (error) {
        res.redirect('/')
    }
    // res.render('authors/index')
});

//new authours route
router.get('/new', (req, res) => {
    res.render('authors/new', {author : new Author()})
});


//create new authours route
router.post('/', async(req, res) => {
    const author = new Author({
        name : req.body.name
    });
    try {

        const newAuthour = await author.save()
            // res.redirect(`authours/${newAuthour.id}`)
        
        res.redirect(`authors`)
        
    } catch  {
        res.render('authors/new', {
        author : author,
        errorMessage : 'This is a error'
        });
    }
});

module.exports = router; 