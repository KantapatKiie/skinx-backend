// src/post.model.ts
import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  postedAt: Date;
  postedBy: string;
  tags: string[];
}

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedAt: { type: Date, required: true },
  postedBy: { type: String, required: true },
  tags: { type: Array, required: true },
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
