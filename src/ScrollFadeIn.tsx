import { useEffect, useRef } from "react";

type Props = {
    blacklistClasses?: string[];
    setFirstChildNoFade?: boolean;
    as?: keyof JSX.IntrinsicElements;
    id?: string;
    className?: string;
    children: React.ReactNode;
    revealItemsAlreadyInViewport?: boolean;
};

export default function ScrollFadeIn({
    blacklistClasses = ["no-fade"],
    setFirstChildNoFade = true,
    as = "main",
    id,
    className,
    children,
    revealItemsAlreadyInViewport = true,
}: Props) {
    const ref = useRef<HTMLElement | null>(null);
    const ioRef = useRef<IntersectionObserver | null>(null);

    const Component = as as any;

    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        if (setFirstChildNoFade) {
            const first = root.firstElementChild as HTMLElement | null;
            if (first && !first.classList.contains("no-fade")) {
                first.classList.add("no-fade");
            }
        }

        const hasBlacklist = blacklistClasses.length > 0;
        const blacklistSelector = hasBlacklist
            ? blacklistClasses.map((c) => `.${c}`).join(", ")
            : null;

        const io =
            ioRef.current ??
            new IntersectionObserver(
                (entries, self) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            (entry.target as HTMLElement).classList.add("fade-in-visible");
                            self.unobserve(entry.target);
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: "0px 0px 10% 0px",
                    threshold: 0.01,
                }
            );
        ioRef.current = io;

        const isAlreadyInViewport = (el: HTMLElement) => {
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            return r.top < vh * 0.7 && r.bottom > 0;
        };

        const shouldSkip = (el: HTMLElement) =>
            !!(hasBlacklist && blacklistSelector && el.closest(blacklistSelector));

        const register = (el: HTMLElement) => {
            if (shouldSkip(el)) return;

            if (el.classList.contains("fade-in-visible")) return;

            if (revealItemsAlreadyInViewport && isAlreadyInViewport(el)) {
                el.classList.remove("fade-in-init");
                el.classList.add("fade-in-visible");
                return;
            }

            if (!el.classList.contains("fade-in-init")) {
                el.classList.add("fade-in-init");
            }
            io.observe(el);
        };

        root.querySelectorAll<HTMLElement>("*").forEach(register);

        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                m.addedNodes.forEach((n) => {
                    if (n.nodeType !== 1) return;
                    const el = n as HTMLElement;
                    register(el);
                    el.querySelectorAll<HTMLElement>("*").forEach(register);
                });
            }
        });
        mo.observe(root, { childList: true, subtree: true });

        return () => {
            mo.disconnect();
        };
    }, [blacklistClasses, setFirstChildNoFade, revealItemsAlreadyInViewport]);

    return (
        <Component ref={ref} id={id} className={className}>
            {children}
        </Component>
    );
}
