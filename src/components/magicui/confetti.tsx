import confetti, { Options as BaseConfettiOptions, Shape } from "canvas-confetti";

interface ConfettiOptions extends BaseConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    flat?: boolean;
    ticks?: number;
    origin?: { x: number; y: number };
    colors?: string[];
    shapes?: Shape[];
    zIndex?: number;
    disableForReducedMotion?: boolean;
    useWorker?: boolean;
    resize?: boolean;
    canvas?: HTMLCanvasElement | null;
    scalar?: number;
}

const Confetti = (options: ConfettiOptions): void => {
    if (
        options.disableForReducedMotion &&
        window.matchMedia("(prefers-reduced-motion)").matches
    ) {
        return;
    }

    const confettiInstance = options.canvas
        ? confetti.create(options.canvas, {
              resize: options.resize ?? true,
              useWorker: options.useWorker ?? true,
          })
        : confetti;

    confettiInstance({ ...options });
};

interface ShapePathOptions {
    path: string;
    scalar?: number;
    [key: string]: unknown;
}

interface ShapeTextOptions {
    text: string;
    scalar?: number;
    [key: string]: unknown;
}

Confetti.shapeFromPath = (options: ShapePathOptions): Shape => {
    return confetti.shapeFromPath({ ...options });
};

Confetti.shapeFromText = (options: ShapeTextOptions): Shape => {
    return confetti.shapeFromText({ ...options });
};

export { Confetti };
