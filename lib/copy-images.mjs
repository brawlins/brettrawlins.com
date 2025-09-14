import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { fileURLToPath } from "url";

const fsPromises = fs.promises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.join(__dirname, "../public/images/posts");
const postsDir = path.join(__dirname, "../content/posts");

async function copyImagesToPublic(images, slug) {
  for (const image of images) {
    await fsPromises.copyFile(
      `${postsDir}/${slug}/${image}`,
      `${targetDir}/${slug}/${image}`
    );
  }
}

async function createPostImageFoldersForCopy() {
  // Get every post folder: post-one, post-two etc.
  const postSlugs = await fsPromises.readdir(postsDir);

  for (const slug of postSlugs) {
    const postPath = path.join(postsDir, slug);
    const stat = await fsPromises.stat(postPath);
    if (!stat.isDirectory()) continue; // Skip if not a directory

    const allowedImageFileExtensions = [".png", ".jpg", ".jpeg", ".gif"];

    // Read all files inside current post folder
    const postDirFiles = await fsPromises.readdir(postPath);

    // Filter out files with allowed file extension (images)
    const images = postDirFiles.filter(file =>
      allowedImageFileExtensions.includes(path.extname(file))
    );

    if (images.length) {
      // Create a folder for images of this post inside public
      await fsPromises.mkdir(`${targetDir}/${slug}`, { recursive: true });

      await copyImagesToPublic(images, slug);
    }
  }
}

await fsExtra.emptyDir(targetDir);
await createPostImageFoldersForCopy();
