/** Mount the semantic document on physical panels; restore the same nodes for reading. */
export function mountPaper(sheet: HTMLElement): () => void {
  const document = sheet.querySelector<HTMLElement>('.proposal-content');
  if (!document) return () => {};
  const sections = [
    ...document.querySelectorAll<HTMLElement>('[data-print-panel]'),
  ];
  const placements = sections.map((section) => {
    const face = sheet.querySelector<HTMLElement>(
      `.fold-panel[data-panel="${section.dataset.printPanel}"] > .panel-face`,
    );
    if (!face) throw new Error('A proposal section has no paper panel.');
    return { section, face };
  });
  for (const { section, face } of placements)
    face.insertBefore(section, face.querySelector('.panel-colophon'));
  return () => {
    for (const section of sections) document.append(section);
  };
}
