const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Path to your User model

console.log("Passport config loaded");


module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Modern Mongoose v9 async/await lookup
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }
      
      // Assumes you have a comparePassword method on your user schema
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
      
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    console.log("SERIALIZE USER:", user);
  
    const id = user?._id || user?.id;
  
    if (!id) {
      return done(new Error("No user id found in serializeUser"));
    }
  
    done(null, user.id.toString());
  });


  passport.deserializeUser(async (id, done) => {
    try{
      const user = await User.findById(id)
      done(null, user)
    }
    catch (err){
      done(err)
    }
    
  });
};