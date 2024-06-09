const express = require('express')
const router = express.Router()
const User = require('../models/user-model')

const adminCheck = (req, res, next) => {
    if (!req.user.isAdmin) {
        res.redirect('/')
    } else {
        next()
    }
}

router.get('/', adminCheck, async (req, res) => {
    let userData = await User.find()
    if (req.query.search) {
        const query = req.query.search
        userData = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: query, $options: 'i' } },
                { method: { $regex: query, $options: 'i' } },
            ],
        })

    }
    res.render('admindash', { user: userData })
})

module.exports = router