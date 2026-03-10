import { StackServerApp } from "@stackframe/stack";

export const stack = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/x-admin-portal",
    signUp: "/x-admin-portal",
    afterSignIn: "/x-admin-portal/dashboard",
    afterSignUp: "/x-admin-portal/dashboard",
  },
});
