/**
 * Robust splitter: returns EXACTLY 4 sentences that each fit in the text box.
 * Strategy:
 * 1) Tokenize sentences reliably (avoid common abbreviations & numbers like 3.14).
 * 2) Ensure each sentence <= MAX_CHARS_PER_SENTENCE by word-wrapping/truncating with ellipsis.
 * 3) If < 4 sentences, split long ones by words to synthesize additional sentences.
 * 4) If > 4 sentences, keep the first 4 (already length-capped).
 *
 * Keep the original API signature to avoid changes elsewhere.
 */
export function splitTextIntoFourParts(text: string): string[] {
  const MAX_CHARS_PER_SENTENCE = 120; // Safe for typical 1080x1920 caption box at medium font sizes

  if (!text || text.trim().length === 0) {
    return ['', '', '', ''];
  }

  const clean = text
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const rawSentences = tokenizeSentences(clean);
  const limited: string[] = [];

  for (const s of rawSentences) {
    if (s.length <= MAX_CHARS_PER_SENTENCE) {
      limited.push(ensureSentenceEnding(s));
    } else {
      const chunks = chunkByWords(s, MAX_CHARS_PER_SENTENCE);
      for (let i = 0; i < chunks.length; i++) {
        const isLast = i === chunks.length - 1;
        const suffix = isLast ? '' : '…';
        limited.push(ensureSentenceEnding(chunks[i] + suffix));
      }
    }
    if (limited.length >= 8) break; // hard stop to avoid runaway
  }

  // If we still don't have 4, split the longest items by words until we do
  while (limited.length < 4) {
    const idx = indexOfLongest(limited);
    if (idx === -1) break;
    const longest = limited.splice(idx, 1)[0];
    const extra = chunkByWords(longest.replace(/[.!?…]+$/, ''), MAX_CHARS_PER_SENTENCE);
    if (extra.length <= 1) {
      // Could not split meaningfully; pad and bail
      limited.push(longest);
      break;
    }
    for (const e of extra) {
      limited.push(ensureSentenceEnding(e));
      if (limited.length === 4) break;
    }
  }

  // Trim to exactly 4
  const result = limited.slice(0, 4);
  while (result.length < 4) result.push('');
  return result;
}

// --- Helpers ---

const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'vs', 'etc', 'eg', 'ie',
  'fig', 'no', 'inc', 'ltd', 'co', 'dept', 'u.s', 'u.k', 'u.s.a', 'a.m', 'p.m'
]);

function tokenizeSentences(input: string): string[] {
  const sentences: string[] = [];
  let current = '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    current += ch;

    if (ch === '.' || ch === '!' || ch === '?') {
      const prevChar = input[i - 1] || '';
      const nextChar = input[i + 1] || '';

      // Protect numbers like 3.14
      const prevIsDigit = /\d/.test(prevChar);
      const nextIsDigit = /\d/.test(nextChar);
      if (ch === '.' && prevIsDigit && nextIsDigit) {
        continue;
      }

      // Protect common abbreviations
      const prevWordMatch = current.match(/([A-Za-z.]+)\.?\s*$/);
      const prevWord = (prevWordMatch?.[1] || '').toLowerCase().replace(/\.+$/, '');
      const isAbbrev = ABBREVIATIONS.has(prevWord);
      if (isAbbrev) {
        continue;
      }

      // Boundary: punctuation followed by space or end
      const boundary = !nextChar || /\s/.test(nextChar);
      if (boundary) {
        sentences.push(current.trim());
        current = '';
        // Skip consecutive spaces after punctuation
        while (i + 1 < input.length && /\s/.test(input[i + 1])) i++;
      }
    }
  }
  if (current.trim()) sentences.push(current.trim());
  return sentences;
}

function chunkByWords(text: string, limit: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    const trial = current ? current + ' ' + word : word;
    if (trial.length <= limit) {
      current = trial;
    } else {
      if (current.length === 0) {
        // Single extremely long token
        chunks.push(word.slice(0, Math.max(1, limit - 1)) + '…');
      } else {
        chunks.push(current);
        current = word.length > limit ? word.slice(0, limit - 1) + '…' : word;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function ensureSentenceEnding(s: string): string {
  const trimmed = s.trim();
  if (/[.!?…]$/.test(trimmed)) return trimmed;
  return trimmed + '.';
}

function indexOfLongest(arr: string[]): number {
  if (arr.length === 0) return -1;
  let max = 0;
  let idx = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > max) {
      max = arr[i].length;
      idx = i;
    }
  }
  return idx;
}

/**
 * Validates and prepares image array to exactly 4 images
 * Duplicates images if there are fewer than 4, or takes first 4 if more
 */
export function prepareImageArray(images: string[]): string[] {
  if (!images || images.length === 0) {
    // Return placeholder images if none provided
    return Array(4).fill('https://via.placeholder.com/1080x1920/000000/FFFFFF?text=No+Image');
  }

  if (images.length >= 4) {
    return images.slice(0, 4);
  }

  // If fewer than 4 images, cycle through them to make 4
  const result: string[] = [];
  for (let i = 0; i < 4; i++) {
    result.push(images[i % images.length]);
  }
  
  return result;
}