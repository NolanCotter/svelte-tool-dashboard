import { animate } from 'motion';

export type FlipOptions = {
  duration?: number;
  distance?: number;
  turns?: number;
  immediate?: boolean;
};

export function flip(node: HTMLElement, options: FlipOptions = {}) {
  let controls: { cancel?: () => void } | undefined;

  const run = () => {
    controls?.cancel?.();
    const turns = options.turns ?? 3;
    const distance = options.distance ?? 18;
    controls = animate(
      node,
      {
        opacity: [0.74, 1],
        transform: [
          `perspective(1200px) translateY(${distance}px) rotateX(26deg) rotateY(-8deg)`,
          `perspective(1200px) translateY(${distance * 0.45}px) rotateX(-18deg) rotateY(5deg)`,
          `perspective(1200px) translateY(${distance * 0.2}px) rotateX(12deg) rotateY(-3deg)`,
          'perspective(1200px) translateY(0px) rotateX(0deg) rotateY(0deg)'
        ]
      },
      {
        duration: options.duration ?? 0.34,
        easing: [0.11, 0.96, 0.2, 1],
        times: turns > 2 ? [0, 0.38, 0.72, 1] : [0, 0.46, 0.82, 1]
      }
    );
  };

  if (options.immediate) {
    run();
  } else {
    requestAnimationFrame(run);
  }

  return {
    update(nextOptions: FlipOptions = {}) {
      options = { ...options, ...nextOptions };
      requestAnimationFrame(run);
    },
    destroy() {
      controls?.cancel?.();
    }
  };
}
