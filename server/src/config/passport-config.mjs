import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUserByEmailAndPassword, findUserById } from '../services/userService.mjs'

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await findUserByEmailAndPassword(email, password)
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user)
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id)
    console.log('Deserialized user:', user)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export { passport }
