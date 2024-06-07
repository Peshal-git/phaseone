const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport-setup')

router.get("/login", (req, res) => {
    res.render('login')
})

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })

})

router.get("/google", passport.authenticate('google', {
    scope: ['profile']
}))

router.get("/google/redirect", passport.authenticate('google'), (req, res) => {
    res.redirect('/profile')
})

router.get("/facebook", passport.authenticate('facebook', {
    scope: ['email']
}))

router.get('/facebook/redirect', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

module.exports = router