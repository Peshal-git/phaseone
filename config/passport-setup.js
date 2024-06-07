const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
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
            new User({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture
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
                username: profile.displayName,
                facebookId: profile.id,
                thumbnail: profile.photos[0].value
            }).save().then((newUser) => {
                console.log(`New user created: ${newUser}`)
                done(null, newUser)
            })
        }
    })
}))