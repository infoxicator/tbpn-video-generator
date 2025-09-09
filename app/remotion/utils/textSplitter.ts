/**
 * Intelligently splits text into exactly 4 meaningful portions
 * Prioritizes sentence boundaries and balanced content distribution
 */
export function splitTextIntoFourParts(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return ['', '', '', ''];
  }

  // Clean and normalize the text
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  // Split by sentences first
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) {
    return ['', '', '', ''];
  }

  // If we have 4 or fewer sentences, use one per part
  if (sentences.length <= 4) {
    const result = [...sentences];
    // Pad with empty strings if needed
    while (result.length < 4) {
      result.push('');
    }
    return result.slice(0, 4);
  }

  // For more than 4 sentences, distribute them across 4 parts
  const targetLength = Math.floor(cleanText.length / 4);
  const parts: string[] = [];
  let currentPart = '';
  let currentLength = 0;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const willExceedTarget = currentLength + sentence.length > targetLength;
    const isLastSentence = i === sentences.length - 1;
    const needsMoreParts = parts.length < 3; // We need to leave room for the last part
    
    if (willExceedTarget && currentPart.length > 0 && needsMoreParts) {
      // Finish current part and start new one
      parts.push(currentPart.trim());
      currentPart = sentence;
      currentLength = sentence.length;
    } else {
      // Add to current part
      currentPart += (currentPart.length > 0 ? ' ' : '') + sentence;
      currentLength += sentence.length + (currentPart.length > sentence.length ? 1 : 0);
    }
    
    // If this is the last sentence, or we have 3 parts already, finish up
    if (isLastSentence || parts.length === 3) {
      parts.push(currentPart.trim());
      break;
    }
  }

  // Ensure we have exactly 4 parts
  while (parts.length < 4) {
    parts.push('');
  }

  return parts.slice(0, 4);
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