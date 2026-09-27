/** Mount visual panels while exposing one complete, camera-independent document. */
export function mountPaper(
  sheet: HTMLElement,
  onReadingFocus: (original: HTMLElement) => void,
): () => void {
  const content = sheet.querySelector<HTMLElement>('.proposal-content');
  if (!content) return () => {};
  const sections = [
    ...content.querySelectorAll<HTMLElement>('[data-print-panel]'),
  ];
  const placements = sections.map((section) => {
    const face = sheet.querySelector<HTMLElement>(
      `.fold-panel[data-panel="${section.dataset.printPanel}"] > .panel-face`,
    );
    if (!face) throw new Error('A proposal section has no paper panel.');
    return { section, face };
  });
  const copy = content.cloneNode(true) as HTMLElement;
  const originals = [...content.querySelectorAll<HTMLElement>('a[href]')];
  const links = [...copy.querySelectorAll<HTMLElement>('a[href]')];
  const tabIndexes = originals.map((link) => link.getAttribute('tabindex'));
  links.forEach((link, index) => {
    link.addEventListener('focus', () => onReadingFocus(originals[index]));
  });

  // These repeated labels belong to separate phone camera views, not the
  // ordinary document. Its shared heading and terms remain in the transcript.
  copy.querySelectorAll('.rate-context, .rate-common').forEach((node) => {
    node.remove();
  });
  const elements = [...copy.querySelectorAll<HTMLElement>('*')];
  const ids = new Map<string, string>();
  for (const element of elements) {
    if (element.id) {
      const id = `tour-transcript-${element.id}`;
      ids.set(element.id, id);
      element.id = id;
    }
    element.removeAttribute('class');
    element.removeAttribute('style');
    for (const attribute of [...element.attributes]) {
      if (attribute.name.startsWith('data-'))
        element.removeAttribute(attribute.name);
    }
    // Display spans and flex rows supplied visual word boundaries in print.
    // Preserve those boundaries after removing the camera typography classes.
    for (const child of [...element.children]) {
      if (child.previousSibling instanceof Element)
        element.insertBefore(sheet.ownerDocument.createTextNode(' '), child);
    }
  }
  for (const element of elements) {
    for (const attribute of [
      'aria-labelledby',
      'aria-describedby',
      'headers',
    ]) {
      const references = element.getAttribute(attribute);
      if (references)
        element.setAttribute(
          attribute,
          references
            .split(/\s+/)
            .map((id) => ids.get(id) ?? id)
            .join(' '),
        );
    }
    const href = element.getAttribute('href');
    if (href?.startsWith('#') && ids.has(href.slice(1)))
      element.setAttribute('href', `#${ids.get(href.slice(1))}`);
  }
  const transcript = sheet.ownerDocument.createElement('article');
  transcript.id = 'tour-transcript';
  transcript.className = 'tour-transcript sr-only';
  transcript.setAttribute(
    'aria-label',
    sheet.getAttribute('aria-label') ?? 'Growth partnership proposal',
  );
  transcript.append(...copy.childNodes);
  const journey = sheet.closest('.flyer-journey');
  if (!journey?.parentElement)
    throw new Error('The paper needs a journey container for its transcript.');
  journey.before(transcript);
  const originalAriaHidden = sheet.getAttribute('aria-hidden');
  sheet.setAttribute('aria-hidden', 'true');
  originals.forEach((link) => {
    link.tabIndex = -1;
  });
  for (const { section, face } of placements)
    face.insertBefore(section, face.querySelector('.panel-colophon'));
  return () => {
    transcript.remove();
    if (originalAriaHidden === null) sheet.removeAttribute('aria-hidden');
    else sheet.setAttribute('aria-hidden', originalAriaHidden);
    originals.forEach((link, index) => {
      const tabIndex = tabIndexes[index];
      if (tabIndex === null) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', tabIndex);
    });
    for (const section of sections) content.append(section);
  };
}
