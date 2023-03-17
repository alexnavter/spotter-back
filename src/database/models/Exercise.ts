import { model, Schema } from "mongoose";

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Upper body", "Lower body"],
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  muscles: {
    primary: {
      type: String,
      required: false,
    },
    secondary: {
      type: [String],
      default: [],
      required: false,
    },
  },
  description: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: false,
  },
  reps: {
    type: Number,
    required: false,
  },
  rest: {
    type: Number,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  backupImage: {
    type: String,
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Exercise = model("Exercise", exerciseSchema, "exercises");

export default Exercise;
