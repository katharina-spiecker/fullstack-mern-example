import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  },
  pwdResetToken: {
    type: String
  },
  pwdResetTokenExpiresAt: {
    type: Date
  }
})

// mongoose will automatically call the method whenever the document is transformed to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model("User", userSchema);

export default User;