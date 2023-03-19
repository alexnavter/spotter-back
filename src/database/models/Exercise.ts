import { model, Schema } from "mongoose";

export const exerciseSchema = new Schema({
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
    type: String,
    required: true,
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
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Exercise = model("Exercise", exerciseSchema, "exercises");
