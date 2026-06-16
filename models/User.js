const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
      type: String, 
      unique: true,
      required: true
    },
    email:  {
      type: String, 
      unique: true,
      required: true,
      lowercase: true
    }, 
    password:{
      type: String, 
      unique: true      
    },
    createdAt: {  // ✅ Track when user signed up
      type: Date,
      default: Date.now
  }
})

// password hash middleware 
UserSchema.pre('save', async function() {
    const user = this

    if (!user.isModified('password')){
       return; 
    }    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

  })


// Helper method for validating user's password 
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)    
}

module.exports = mongoose.model('User', UserSchema)