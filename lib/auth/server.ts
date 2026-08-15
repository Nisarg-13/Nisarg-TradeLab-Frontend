import { auth } from "@clerk/nextjs/server";

export async function getServerAuthToken(): Promise<string | null> {
  return (await auth()).getToken();
}
