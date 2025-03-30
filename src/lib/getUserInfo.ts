import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function getUserInfo() {
  const session = await getServerSession(authOptions);
  return {
    email: session?.user?.email,
    username: session?.user?.username,
  };
}