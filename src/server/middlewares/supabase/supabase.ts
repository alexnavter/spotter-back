import "../../../loadEnvironment.js";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { type CustomRequest } from "../../../types/types";
import { type NextFunction, type Response } from "express";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseBucket = process.env.SUPABASE_BUCKET!;

export const supabase = createClient(supabaseUrl, supabaseKey);

const supaBase = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageName = req.file?.filename;

    const imagePath = path.join("uploads", imageName!);

    const backupImage = await fs.readFile(imagePath);

    await supabase.storage.from(supabaseBucket).upload(imageName!, backupImage);

    const {
      data: { publicUrl },
    } = supabase.storage.from(supabaseBucket).getPublicUrl(imageName!);

    req.body.image = imagePath;
    req.body.backupImage = publicUrl;

    next();
  } catch (error) {
    const customError = new Error("Cannot upload the image");

    next(customError);
  }
};

export default supaBase;
