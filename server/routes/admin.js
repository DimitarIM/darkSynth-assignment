const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist");
const User = require('../models/User');
const adminLayout = '../views/layouts/admin';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error) {
        res.status(401).json( { message: 'Unauthorized'} );
    }
}

// Admin Login Page

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

// Admin Check Login

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json({ message: 'Invalid Credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials'});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

// Admin Register

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: "User Created", user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json( { message: "User already in use"});
            }
            res.status(500).json( { message: 'Internal server error' });
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Page to fiddle around with data'
        }

        const data = await Artist.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }
});

/*
    GET /
    Admin - Create New Artist
*/

router.get('/add-artist', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Artist',
            description: 'Page to fiddle around with data'
        }

        const data = await Artist.find();
        res.render('admin/add-artist', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }
});

/*
    POST /
    Admin - Create New Artist
*/

router.post('/add-artist', authMiddleware, async (req, res) => {
    try {
        try {
            const newArtist = new Artist({
                name: req.body.name,
                description: req.body.description
            })

            await Artist.create(newArtist);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Edit Artist
*/
router.get('/edit-artist/:id', authMiddleware, async (req, res) => {
  try {

    const locals = {
      title: "Edit Artist",
      description: "Free NodeJs User Management System",
    };

    const data = await Artist.findOne({ _id: req.params.id });

    res.render('admin/edit-artist', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

/*
    PUT /
    Admin - Edit Artist
*/

router.put('/edit-artist/:id', authMiddleware, async (req, res) => {
    try {
        await Artist.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description
        })

        res.redirect(`/edit-artist/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
});

/*
    DELETE /
    Admin - Delete Artist
*/

router.delete('/delete-artist/:id', authMiddleware, async (req, res) => {
    try {
        await Artist.deleteOne( { _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

/*
    GET /
    Admin - Logout
*/

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = router;