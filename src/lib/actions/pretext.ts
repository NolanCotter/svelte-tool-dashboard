import { layout, prepare, setLocale } from '@chenglou/pretext';

export type PretextOptions = {
  min?: number;
  max?: number;
  density?: number;
  maxLines?: number;
  locale?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resolveFont(node: HTMLElement, size: number) {
  const style = getComputedStyle(node);
  const fontStyle = style.fontStyle || 'normal';
  const fontWeight = style.fontWeight || '700';
  const fontFamily = style.fontFamily || 'Inter, system-ui, sans-serif';
  return `${fontStyle} ${fontWeight} ${size}px ${fontFamily}`;
}

export function pretext(node: HTMLElement, options: PretextOptions = {}) {
  const settings = {
    min: options.min ?? 18,
    max: options.max ?? 88,
    density: options.density ?? 0.58,
    maxLines: options.maxLines ?? 2,
    locale: options.locale ?? node.closest('[lang]')?.getAttribute('lang') ?? document.documentElement.lang ?? undefined
  };

  if (settings.locale) {
    setLocale(settings.locale);
  }

  let frame = 0;

  const fit = () => {
    const width = node.getBoundingClientRect().width || 1;
    const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();

    if (!text) {
      return;
    }

    const baseline = clamp(width / Math.max(text.length * settings.density, 1), settings.min, settings.max);
    let low = settings.min;
    let high = Math.max(settings.min, settings.max);
    let best = baseline;

    for (let i = 0; i < 10; i += 1) {
      const size = clamp((low + high) / 2, settings.min, settings.max);
      const prepared = prepare(text, resolveFont(node, size));
      const result = layout(prepared, width, Math.max(size * 0.92, 1));

      if (result.lineCount <= settings.maxLines) {
        best = size;
        low = size;
      } else {
        high = size;
      }
    }

    const next = clamp(Math.min(best, baseline), settings.min, settings.max);
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

      if (settings.locale) {
        setLocale(settings.locale);
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    },
    destroy() {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    }
  };
}
