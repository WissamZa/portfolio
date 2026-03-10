import { StackServerApp } from "@stackframe/stack";

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const secretServerKey = process.env.STACK_SECRET_SERVER_KEY;
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

if (!projectId || !secretServerKey) {
  console.error("STACK AUTH ERROR: NEXT_PUBLIC_STACK_PROJECT_ID or STACK_SECRET_SERVER_KEY is missing in environment variables.");
}

export const stack = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: projectId || "missing-project-id",
  secretServerKey: secretServerKey || "missing-secret-key",
  publishableClientKey: publishableClientKey,
  urls: {
    signIn: "/x-admin-portal",
    signUp: "/x-admin-portal",
    afterSignIn: "/x-admin-portal/dashboard",
    afterSignUp: "/x-admin-portal/dashboard",
  },
});
