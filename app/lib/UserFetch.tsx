"use server";
import prisma from "@/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { del, head, put } from "@vercel/blob";
const sharp = require("sharp");
export async function getLoginUser() {
  "use server";
  try {
    const session = await getServerSession(authOptions);
    let user: any = session?.user;
    return user;
  } catch (err) {
    console.log(err);
  }
  return undefined;
}

export async function updateUser() {
  "use server";
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const username = session?.user?.name;

  // when username does not exist though user login
  if (userEmail && (!username || username === "")) {
    const originUsers = await prisma.vb_user.findMany({
      select: {
        username: true,
        user_afc: true,
      },
      where: {
        email: userEmail,
      },
    });

    // when this user exist in origin site
    if (originUsers && originUsers.length > 0) var user: any = originUsers[0];

    // update user information if this user exist in original site
    try {
      const updateuser = await prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          name: user?.username,
          afcRewards: user?.user_afc,
          emailVerified: new Date(),
        },
      });

      return updateuser?.name;
    } catch (err) {
      console.log(err);
    }
  }
  return username;
}

export async function addUsername(
  email: string,
  id: string,
  username: string,
  avatar: any,
) {
  "use server";
  let newUrl;
  if (avatar) {
    const key2 = id + Math.floor(Math.random() * 100); // make image name diff for cache
    avatar = await downloadAndStore(key2, avatar);
    newUrl = key2 + "." + avatar.type;

    const oldBlob = await getUserBlob(id);

    if (oldBlob) {
      // destroy old stored image
      await del(oldBlob, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    }
  }

  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: username,
        image: newUrl,
        vercel_image_store: avatar.url,
        emailVerified: new Date(),
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
  return false;
}

async function downloadAndStore(key: string, file: any) {
  try {
    // Convert the Blob to Buffer

    // const temo = file;
    // const buffer = temo.split(";base64,").pop(); // strip off base64 code
    // let imgBuffer = Buffer.from(buffer, "base64");
    if (!file) {
      return null;
    }
    const base64Data = file.split(",")[1]; // Extract base64 data
    const buffer = Buffer.from(base64Data, "base64"); // Convert base64 to Buffer

    // Resize the image with Sharp
    const resizedImageBuffer = await sharp(Buffer.from(buffer))
      .resize({ width: 300, withoutEnlargement: true }) // Resize to max width of 600 pixels
      .toBuffer();

    // Get the image type
    const metadata = await sharp(Buffer.from(buffer)).metadata();
    const imageType = metadata.format;

    // Convert the resized image buffer to Blob
    const resizedImageBlob = new Blob([resizedImageBuffer], {
      type: `image/${imageType}`,
    });

    //image: resizedImageBlob, type: imageType };

    // save blob in vercel
    let av_name = key + "." + imageType;
    const blob = await put(av_name, resizedImageBlob, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const newImage = { url: blob.url, type: imageType };
    return newImage;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}

async function getUserBlob(id) {
  const blobV = await prisma.user.findFirst({
    where: { id: id },
    select: { vercel_image_store: true },
  });

  return blobV?.vercel_image_store;
}
