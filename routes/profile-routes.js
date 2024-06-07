const express = require('express')
const router = express.Router()
const hbs = require('hbs')

hbs.registerHelper('removeTrailingSlash', function (url) {
    return url.endsWith('/') ? url.slice(0, -1) : url
})

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login')
    } else {
        next()
    }
}

router.get('/', authCheck, (req, res) => {
    res.render('profile', { user: req.user })
})

module.exports = router