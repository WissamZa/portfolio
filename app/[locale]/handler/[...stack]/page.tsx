import { StackHandler } from "@stackframe/stack";
import { stack } from "@/lib/stack";

export default function Handler(props: any) {
    return <StackHandler fullPage app={stack} routeProps={props} />;
}
