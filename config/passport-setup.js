const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const LocalStrategy = require("passport-local")
const bcrypt = require('bcryptjs')

const keys = require('./keys')
const User = require('../models/user-model')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
            console.log(`User is ${currentUser}`)
            done(null, currentUser)

        } else {
            console.log(profile.emails[0].value)
            new User({
                method: "Google",
                name: profile.displayName,
                googleId: profile.id,
                email: profile.emails[0].value,
                thumbnail: profile._json.picture,
                isVerified: true
            }).save().then((newUser) => {
                console.log(`New user created: ${newUser}`)
                done(null, newUser)
            })
        }
    })
}))

passport.use(new FacebookStrategy({
    callbackURL: '/auth/facebook/redirect',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }).then((currentUser) => {
        if (currentUser) {
            console.log(`User is ${currentUser}`)
            done(null, currentUser)

        } else {
            new User({
                method: "Facebook",
                name: profile.displayName,
                facebookId: profile.id,
                email: profile.emails[0].value,
                thumbnail: profile.photos[0].value,
                isVerified: true
            }).save().then((newUser) => {
                console.log(`New user created: ${newUser}`)
                done(null, newUser)
            })
        }
    })
}))

passport.use(new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password"
    }, (username, password, done) => {
        User.findOne({ username: username })
            .then((currentUser) => {
                const isMatch = bcrypt.compare(currentUser.password, password)
                if (!isMatch) {
                    done(null, false, {
                        message: "Password is not valid."
                    })
                }
                else {
                    done(null, currentUser)
                }
            })
            .catch((error) => {
                done(null, false, {
                    message: "Could not find matching username."
                })

            })
    }))