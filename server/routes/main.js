const express = require("express");
const Artist = require("../models/Artist");
const router = express.Router();

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Dark Synth",
            description: "Introductionary site to electronic music and all of its sub-genres"
        }
        res.render('index', {
            locals,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/artists', async (req, res) => {
    try {
        const locals = {
            title: "Dark Synth Artists",
            description: "Introductionary site to electronic music and all of its sub-genres",

        }
        const data = await Artist.find();
        res.render('artists', {
            locals,
            data,
            currentRoute: '/artists'
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/contact', async (req, res) => {
    try {
        const locals = {
            title: "Contact",
            description: "Introductionary site to electronic music and all of its sub-genres"
        }
        res.render('contact', {
            locals,
            currentRoute: '/contact'
        });
    } catch (error) {
        console.log(error)
    }
});

// GET/ Post :id

router.get('/artist/:id', async (req, res) => {
    try {
        const locals = {
            title: "Contact",
            description: "Introductionary site to electronic music and all of its sub-genres"
        }
        const slug = req.params.id;

        const data = await Artist.findById({_id: slug});

        res.render('artist', {
            locals,
            data,
            currentRoute: '/artist/:id'
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;