import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.ObjectId,
    ref: 'User'
  }
})

const Post = mongoose.model("Post", postSchema);

export default Post;