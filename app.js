const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const registerRoutes = require('./routes/register-routes')
const adminRoutes = require('./routes/admin-routes')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const session = require('express-session')
const passport = require('passport')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')

const staticPath = path.join(__dirname, "/public")
const templatePath = path.join(__dirname, "/templates/views")
const partialsPath = path.join(__dirname, "/templates/partials")

app.use(express.static(staticPath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.set('view engine', 'hbs')
app.set('views', templatePath)
hbs.registerPartials(partialsPath)

app.use(session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: false
}))

app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(keys.mongodb.dbURI)
    .then(() => { console.log("Connection Successful") })
    .catch((e) => { console.log("No connection") })

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/register', registerRoutes)
app.use('/admin', adminRoutes)

app.get("/", (req, res) => {
    res.render('index', { user: req.user })
})

app.listen(8000, () => {
    console.log("Server running at port 8000")
})