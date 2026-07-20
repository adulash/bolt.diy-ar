#!/usr/bin/env node
/*
 * CI guard: fail when physical, direction-sensitive UnoCSS utility classes are
 * reintroduced in app/. Arabic RTL support relies on logical properties
 * (ms-/me-/ps-/pe-/start-/end-/border-s/border-e/rounded-s.../text-start/end).
 * A small allowlist covers genuinely direction-neutral cases (centering
 * transforms) and non-class matches.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PHYSICAL = /(?<![\w-])(?:hover:|focus:|active:|group-hover:|sm:|md:|lg:|xl:|dark:|rtl:|ltr:|disabled:|data-\[[^\]]+\]:)*-?(?:ml|mr|pl|pr|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)-(?:\d|\[|auto|px|full)|(?<![\w-])text-(?:left|right)(?![\w-])/;

// Substrings that, if present on the line, exempt it (direction-neutral, or an
// explicitly-marked LTR enclave for code/technical content).
const ALLOW = [
  '-translate-x-1/2', // centering
  'left-1/2',
  'right-1/2',
  'force-ltr', // LTR enclave (code/paths/keys) — physical props are intentional
  'rtl-ignore', // explicit per-line opt-out marker
];

// Files that are entirely LTR code/diff surfaces (see the RTL/LTR matrix).
const ALLOW_FILES = new Set(['app/styles/diff-view.css']);

const files = execSync('git ls-files app', { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /\.(tsx?|scss|css)$/.test(f))
  .filter((f) => !ALLOW_FILES.has(f));

const violations = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // A marker on the line itself or either of the two preceding lines exempts
    // it (covers `// rtl-ignore` above a multi-line const declaration).
    const near = [line, lines[i - 1] ?? '', lines[i - 2] ?? ''];

    if (ALLOW.some((a) => line.includes(a)) || near.some((l) => l.includes('rtl-ignore'))) {
      return;
    }

    if (PHYSICAL.test(line)) {
      violations.push(`${file}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error('Physical directional utility classes found (use logical properties for RTL):\n');
  console.error(violations.join('\n'));
  console.error(`\n${violations.length} violation(s). See uno.config.ts logical utilities.`);
  process.exit(1);
}

console.log('No physical directional utility classes found.');
