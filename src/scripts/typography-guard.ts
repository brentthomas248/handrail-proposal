const sentinelSelector = [
  '.flyer-cover h1',
  '.cover-description',
  '.deal-rate',
  '.rate-reason',
  '.rate-scope',
  '.window-steps p',
  '.partnership-details p',
].join(',');

/** Watch authored text metrics without adding work to the camera ticker. */
export function watchTypography(
  sheet: HTMLElement,
  onChange: (compatible: boolean) => void,
): { check: () => boolean } {
  const lengthProperties = [
    'font-size',
    'letter-spacing',
    'word-spacing',
    'margin-bottom',
  ];
  const canRegister = typeof CSS.registerProperty === 'function';
  if (canRegister)
    for (const property of lengthProperties)
      try {
        CSS.registerProperty({
          name: `--authored-${property}`,
          syntax: '<length>',
          inherits: true,
          initialValue: '0px',
        });
      } catch (error) {
        if (!(
          error instanceof DOMException &&
          error.name === 'InvalidModificationError'
        ))
          throw error;
      }

  const elements = [...sheet.querySelectorAll<HTMLElement>(sentinelSelector)];
  let previous: boolean | undefined;
  let pending = false;
  const numeric = (value: string) =>
    value === 'normal' ? 0 : Number.parseFloat(value);
  const matches = (actual: number, expected: number) =>
    Number.isFinite(actual) &&
    Number.isFinite(expected) &&
    Math.abs(actual - expected) < 0.1;

  function check(): boolean {
    // Older browsers retain the ordinary document instead of accepting an
    // unverified camera layout when typed CSS length values are unavailable.
    return (
      canRegister &&
      elements.every((element) => {
        const style = getComputedStyle(element);
        const fontSize = numeric(style.fontSize);
        const lineHeight = Number.parseFloat(
          style.getPropertyValue('--authored-line-height'),
        );
        return (
          matches(numeric(style.lineHeight), lineHeight * fontSize) &&
          lengthProperties.every(
            (property) =>
              (property === 'margin-bottom' && element.tagName !== 'P') ||
              matches(
                numeric(style.getPropertyValue(property)),
                numeric(style.getPropertyValue(`--authored-${property}`)),
              ),
          )
        );
      })
    );
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const compatible = check();
      if (compatible !== previous) {
        previous = compatible;
        onChange(compatible);
      }
    });
  }

  const resize = new ResizeObserver(schedule);
  elements.forEach((element) => resize.observe(element));
  // Exclude renderer-owned writes. Text style changes, stylesheet injection,
  // extension classes and inherited root styles still trigger one check.
  const nonCameraStyle = (value: string | null) =>
    (value ?? '')
      .replace(
        /(?:^|;)\s*(?:display|transform(?:-origin)?|--(?:panel-height|stage-height|front-shade|back-shade|back-ink-alpha|crease-opacity|tour-progress))\s*:[^;]*/g,
        '',
      )
      .replace(/[;\s]/g, '');
  const observer = new MutationObserver((records) => {
    if (
      records.some((record) => {
        const element =
          record.target instanceof Element
            ? record.target
            : record.target.parentElement;
        if (!element) return false;
        if (
          element.closest('style') ||
          element.matches('link[rel="stylesheet"]')
        )
          return true;
        if (record.type === 'childList')
          return [...record.addedNodes, ...record.removedNodes].some(
            (node) =>
              node instanceof Element &&
              (node.matches('style, link[rel="stylesheet"]') ||
                node.querySelector('style, link[rel="stylesheet"]')),
          );
        if (record.type !== 'attributes') return false;
        if (record.attributeName === 'style')
          return (
            nonCameraStyle(record.oldValue) !==
            nonCameraStyle(element.getAttribute('style'))
          );
        if (record.attributeName === 'class')
          return (
            (record.oldValue ?? '').replace(/\bcamera-ready\b/g, '').trim() !==
            (element.getAttribute('class') ?? '')
              .replace(/\bcamera-ready\b/g, '')
              .trim()
          );
        return true;
      })
    )
      schedule();
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['style', 'class', 'href', 'media', 'disabled'],
  });
  document.addEventListener(
    'load',
    (event) => {
      if (event.target instanceof HTMLLinkElement) schedule();
    },
    true,
  );
  document.fonts.addEventListener('loadingdone', schedule);
  previous = check();
  return { check };
}
