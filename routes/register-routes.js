const express = require('express')
const router = express.Router()
const User = require('../models/user-model')

router.get("/", (req, res) => {
    res.render("register")
})

router.post("/", async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.confirmpassword

        if (password === cpassword) {
            new User({
                name: req.body.firstname + req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            }).save()
                .then((newUser) => {
                    console.log(`New user created: ${newUser}`)
                })
            res.redirect('/profile')
        } else {
            res.send("Passwords do not match")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router