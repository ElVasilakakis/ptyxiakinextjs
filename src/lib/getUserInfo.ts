import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function getUserInfo() {
  try {
    const session = await getServerSession(authOptions);
    
    return {
      avatar: 'U', // You might want to fetch this dynamically if possible
      email: session?.user?.email,
      username: session?.user?.username,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null; // Handle error case
  }
}