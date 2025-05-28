"use client";

import { cn } from "@/lib/utils";
import { CSSProperties, ReactElement, ReactNode, useEffect, useRef, useState, useCallback } from "react";

// Hook to track mouse position
interface MousePosition {
    x: number;
    y: number;
}

function useMousePosition(): MousePosition {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    return mousePosition;
}

// MagicContainer component that handles mouse effects and elements resizing
interface MagicContainerProps {
    children?: ReactNode;
    className?: string;
}

const MagicContainer = ({ children, className }: MagicContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePosition = useMousePosition();
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const [boxes, setBoxes] = useState<HTMLElement[]>([]);

    // Memoized init function
    const init = useCallback(() => {
        if (containerRef.current) {
            containerSize.current.w = containerRef.current.offsetWidth;
            containerSize.current.h = containerRef.current.offsetHeight;
        }
    }, []); // No dependencies for init as it only uses refs and DOM properties, which are stable

    // Memoized onMouseMove function
    const onMouseMove = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const { w, h } = containerSize.current;
            const x = mousePosition.x - rect.left;
            const y = mousePosition.y - rect.top;
            const inside = x < w && x > 0 && y < h && y > 0;

            mouse.current.x = x;
            mouse.current.y = y;
            boxes.forEach(box => {
                const boxX = -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
                const boxY = -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
                box.style.setProperty("--mouse-x", `${boxX}px`);
                box.style.setProperty("--mouse-y", `${boxY}px`);

                if (inside) {
                    box.style.setProperty("--opacity", `1`);
                } else {
                    box.style.setProperty("--opacity", `0`);
                }
            });
        }
    }, [mousePosition, boxes]); // Dependencies for onMouseMove: mousePosition state and boxes state

    // Effect to initialize container size and get child elements once on mount
    // and whenever 'init' or 'containerRef' changes (though containerRef is stable)
    useEffect(() => {
        init();
        if (containerRef.current) {
            setBoxes(Array.from(containerRef.current.children).map(el => el as HTMLElement));
        }
    }, [init]); // Added 'init' as a dependency

    // Effect to re-initialize on window resize events
    useEffect(() => {
        init(); // Call init on mount and whenever init changes
        window.addEventListener("resize", init);

        return () => {
            window.removeEventListener("resize", init);
        };
    }, [init]); // Added 'init' as a dependency

    // Effect to update mouse position related styles
    useEffect(() => {
        onMouseMove();
    }, [mousePosition, onMouseMove]); // Added 'mousePosition' and 'onMouseMove' as dependencies

    return (
        <div className={cn("h-full w-full", className)} ref={containerRef}>
            {children}
        </div>
    );
};

// MagicCard component for rendering cards with mouse interaction
interface MagicCardProps {
    as?: ReactElement;
    className?: string;
    children?: ReactNode;
    size?: number;
    spotlight?: boolean;
    spotlightColor?: string;
    isolated?: boolean;
    background?: string;
    borderColor?: string;
}

const MagicCard: React.FC<MagicCardProps> = ({
    className,
    children,
    size = 600,
    // spotlight = true, // Commented out in original, keeping it for consistency
    spotlightColor = "rgba(255,255,255,0.03)",
    // isolated = true, // Commented out in original, keeping it for consistency
    borderColor = "hsl(0 0% 98%)",
    ...props
}) => {
    return (
        <div
            style={{
                "--mask-size": `${size}px`,
                "--border-color": `${borderColor}`,
                "--spotlight-color": spotlightColor,
            } as CSSProperties}
            className={cn(
                "relative z-0 h-full w-full rounded-2xl p-6",
                "bg-gray-300 dark:bg-gray-700", // Ensure these dark mode colors are appropriate
                "bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--border-color),transparent_100%)]",
                className
            )}
            {...props}
        >
            {children}

            {/* Background */}
            <div className={"absolute inset-[1px] -z-20 rounded-2xl bg-white dark:bg-black/95"} />
        </div>
    );
};

export { MagicCard, MagicContainer };