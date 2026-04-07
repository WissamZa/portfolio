import { StackServerApp } from '@stackframe/stack';

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const secretServerKey = process.env.STACK_SECRET_SERVER_KEY;
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

if (!projectId || !secretServerKey) {
  // eslint-disable-next-line no-console
  console.error(
    'STACK AUTH ERROR: NEXT_PUBLIC_STACK_PROJECT_ID or STACK_SECRET_SERVER_KEY is missing. ' +
    'Authentication will not work until these are set in your environment.'
  );
}

export const stack = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  projectId: projectId ?? '',
  secretServerKey: secretServerKey ?? '',
  publishableClientKey: publishableClientKey,
  urls: {
    handler: '/handler',
    signIn: '/en/x-admin-portal',
    signUp: '/en/x-admin-portal',
    afterSignIn: '/en/x-admin-portal/dashboard',
    afterSignUp: '/en/x-admin-portal/dashboard',
  },
});
