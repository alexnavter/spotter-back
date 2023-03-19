import "../../../loadEnvironment.js";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { type CustomRequest } from "../../../types/types";
import { type NextFunction, type Response } from "express";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

const supaBase = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageName = req.file?.filename;

    const image = await fs.readFile(path.join("upload", imageName!));

    await supabase.storage.from("exercises").upload(imageName!, image);

    const {
      data: { publicUrl },
    } = supabase.storage.from("exercises").getPublicUrl(imageName!);

    req.body.image = image;
    req.body.backupImage = publicUrl;

    next();
  } catch (error) {
    const customError = new Error("Cannot upload the image");

    next(customError);
  }
};

export default supaBase;
