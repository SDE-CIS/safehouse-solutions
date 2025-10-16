import {Error} from "@/components/ui/error.tsx";

export function NotFoundRoute() {
    return (
        <Error title="404 - Not Found" text="Sorry, the page you are looking for does not exist." />
    );
}
