import { model, Schema } from "mongoose";

export const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
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
    type: String,
    required: false,
  },
  reps: {
    type: String,
    required: false,
  },
  rest: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
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
