export type PretextOptions = {
  min?: number;
  max?: number;
  density?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function pretext(node: HTMLElement, options: PretextOptions = {}) {
  const settings = {
    min: options.min ?? 18,
    max: options.max ?? 88,
    density: options.density ?? 0.58
  };

  let frame = 0;

  const fit = () => {
    const width = node.getBoundingClientRect().width || 1;
    const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();

    if (!text) {
      return;
    }

    const target = width / Math.max(text.length * settings.density, 1);
    const next = clamp(target, settings.min, settings.max);
    node.style.setProperty('--pretext-size', `${next}px`);
    node.style.fontSize = `var(--pretext-size)`;
    node.style.lineHeight = '0.92';
    node.style.textWrap = 'balance';
  };

  const observer =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(fit);
        });

  observer?.observe(node);
  requestAnimationFrame(fit);

  return {
    update(nextOptions: PretextOptions = {}) {
      Object.assign(settings, nextOptions);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    },
    destroy() {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    }
  };
}
