import { animate } from 'motion';

export type FlipOptions = {
  duration?: number;
  distance?: number;
};

export function flip(node: HTMLElement, options: FlipOptions = {}) {
  let controls: { cancel?: () => void } | undefined;

  const run = () => {
    controls?.cancel?.();
    controls = animate(
      node,
      {
        opacity: [0, 1],
        transform: [
          `perspective(1200px) translateY(${options.distance ?? 14}px) rotateX(12deg)`,
          'perspective(1200px) translateY(0px) rotateX(0deg)'
        ]
      },
      {
        duration: options.duration ?? 0.24,
        easing: [0.16, 1, 0.3, 1]
      }
    );
  };

  requestAnimationFrame(run);

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
