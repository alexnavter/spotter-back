import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  exercises: [],
});

const User = model("User", userSchema, "users");

export default User;
