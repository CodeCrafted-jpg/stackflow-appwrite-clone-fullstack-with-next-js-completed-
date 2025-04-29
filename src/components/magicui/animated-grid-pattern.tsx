"use client"


import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useId, useRef, useState, useCallback } from "react";

interface GridPatternProps {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeDasharray?: string | number;
    numSquares?: number;
    className?: string;
    maxOpacity?: number;
    duration?: number;
    repeatDelay?: number; // Explicitly include it in the props
    [key: string]: any; // Allow other props
}

interface Square {
    id: number;
    pos: [number, number];
}

export function GridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = "0",
    numSquares = 50,
    className,
    maxOpacity = 0.5,
    duration = 4,
    ...props
}: GridPatternProps) {
    const id = useId();
    const containerRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [squares, setSquares] = useState<Square[]>([]);

    const getPos = useCallback((): [number, number] => {
        return [
            Math.floor((Math.random() * dimensions.width) / width),
            Math.floor((Math.random() * dimensions.height) / height),
        ];
    }, [dimensions.width, dimensions.height, width, height]);

    const generateSquares = useCallback(
        (count: number): Square[] => {
            return Array.from({ length: count }, (_, i) => ({
                id: i,
                pos: getPos(),
            }));
        },
        [getPos]
    );

    const updateSquarePosition = (id: number) => {
        setSquares(currentSquares =>
            currentSquares.map(sq =>
                sq.id === id ? { ...sq, pos: getPos() } : sq
            )
        );
    };

    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            setSquares(generateSquares(numSquares));
        }
    }, [dimensions, numSquares, generateSquares]);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        const container = containerRef.current;
        if (container) {
            observer.observe(container);
        }

        return () => {
            if (container) {
                observer.unobserve(container);
            }
        };
    }, []);

    // Filter out props that are not valid for the SVG element
    const svgProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => key !== "repeatDelay")
    );

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
                className
            )}
            {...svgProps} // Use the filtered props
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray.toString()}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
            <svg x={x} y={y} className="overflow-visible">
                {squares.map(({ pos: [x, y], id }, index) => (
                    <motion.rect
                        initial={{ opacity: 0 }}
                        animate={{ opacity: maxOpacity }}
                        transition={{
                            duration,
                            repeat: Infinity,
                            delay: index * 0.1,
                            repeatType: "reverse",
                            repeatDelay: props.repeatDelay, // Now you can use it here
                        }}
                        onAnimationComplete={() => updateSquarePosition(id)}
                        key={`${x}-${y}-${id}`}
                        width={width - 1}
                        height={height - 1}
                        x={x * width + 1}
                        y={y * height + 1}
                        fill="currentColor"
                        strokeWidth="0"
                    />
                ))}
            </svg>
        </svg>
    );
}

export default GridPattern;