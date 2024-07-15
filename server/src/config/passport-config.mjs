import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUserByEmail, findUserById } from '../services/userService.mjs'
import bcrypt from 'bcryptjs'

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    console.log('Local strategy called with email:', email)
    try {
      const user = await findUserByEmail(email)
      if (!user) {
        console.log('Authentication failed: Incorrect email')
        return done(null, false, { message: 'Incorrect email.' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        console.log('Authentication failed: Incorrect password')
        return done(null, false, { message: 'Incorrect password.' })
      }
      console.log('Local strategy authentication successful, user:', user)
      return done(null, user)
    } catch (err) {
      console.error('Error in local strategy:', err)
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user)
  done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
  console.log('DeserializeUser called with id:', id)
  try {
    const user = await findUserById(id)
    if (!user) {
      console.log('User not found:', id)
      return done(null, false)
    }
    console.log('Deserializing user:', user)
    done(null, user)
  } catch (err) {
    console.error('Error in deserializeUser:', err)
    done(err, null)
  }
})

export default passport
