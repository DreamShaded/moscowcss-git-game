export function normalizeStep(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function stepIncludes(step: string, fragment: string): boolean {
  return ` ${normalizeStep(step)} `.includes(` ${fragment} `);
}

export function sequenceMatchesAnyVariant(
  user: string[],
  variants: string[][],
): boolean {
  return variants.some(v => v.length === user.length && v.every((step, i) => step === user[i]));
}
