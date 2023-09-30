import path from "path";
import sharp from "sharp";
import fs from "fs";
import {
  InternalServerErrorMessage,
  NotFoundMessage,
} from "../../../base/keys/messages.js";
import { ERROR, resolveAliasPath } from "../../../module.js";

const MAX_IMAGE_SIZE = 1024;

export async function processImage(req, res) {
  try {
    const { image_name } = req.params;
    const { width, height } = req.query;

    const imageDirectory = path.join(
      resolveAliasPath("@core"),
      "static",
      "images"
    );

    const imagePath = path.join(imageDirectory, image_name);

    // Check if the image exists
    if (!(await imageExists(imagePath))) {
      res.status(404).send(NotFoundMessage(req, "Image not found"));
      return;
    }

    let image = sharp(imagePath);

    if (width && height) {
      const resizedImage = image.resize(parseInt(width), parseInt(height), {
        fit: "fill",
        withoutEnlargement: false,
      });

      const processedImage = await resizedImage.toBuffer();

      res.set("Content-Type", "image/jpeg");
      res.status(200).send(processedImage);
    } else {
      if (width) {
        image = image.resize(parseInt(width), null, {
          withoutEnlargement: false,
        });
      } else if (height) {
        image = image.resize(null, parseInt(height), {
          withoutEnlargement: false,
        });
      }

      const processedImage = await image.toBuffer();

      res.set("Content-Type", "image/jpeg");
      res.status(200).send(processedImage);
    }
  } catch (error) {
    ERROR(error);
    InternalServerErrorMessage(req, "Could not load image");
  }
}

async function imageExists(imagePath) {
  try {
    await fs.promises.access(imagePath);
    return true;
  } catch (error) {
    return false;
  }
}
