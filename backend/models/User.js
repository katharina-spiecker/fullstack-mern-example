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
  }
})

// Mongoose will automatically call the toJSON method whenever the document is transformed to JSON
// Mongoose ruft die toJSON Methode automatisch auf, wenn das Dokument in JSON Format transformiert wird
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model("User", userSchema);

export default User;