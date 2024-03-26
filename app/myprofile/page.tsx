import prisma from "@/client";
import monthYear from "@/components/functions/monthYear";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Profile from "../components/Profile";
import { addUsername, updateUser } from "../lib/UserFetch";
export async function generateMetadata({ params }): Promise<Metadata> {
  const Title = monthYear() + " Current online gambling guide list";
  const description =
    "Online casino guides with detailed information on slots, games and bonus types along with how to instructions.";
  return {
    metadataBase: new URL("https://www.allfreechips.com"),
    title: Title,
    description: description,
  };
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  if (userEmail == undefined) {
    userEmail = "never@addUsername.no"; //  stop prisma from returning a val on undefined
  }

  let user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      afcRewards: true,
    },
    where: {
      email: userEmail,
    },
  });

  if (!userEmail) {
    user = null;
  }

  if (user && user.email && (!user.name || user.name === "")) {
    const name = await updateUser();
    if (name && name.length > 0) revalidatePath("/myprofile");
  }

  return <Profile user={user} addUsername={addUsername} />;
}
