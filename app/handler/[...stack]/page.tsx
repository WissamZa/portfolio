import { StackHandler } from "@stackframe/stack";
import { stack } from "@/lib/stack";

export default async function Handler(props: {
  params: Promise<{ stack: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return (
    <StackHandler
      app={stack}
      routeProps={{ params, searchParams }}
      fullPage
    />
  );
}

