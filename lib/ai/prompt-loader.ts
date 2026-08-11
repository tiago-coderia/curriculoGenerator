import fs from 'fs';
import path from 'path';

export function loadPrompt(filename: string): string {
  const filepath = path.join(process.cwd(), 'prompts', filename);
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt file ${filename}:`, error);
    throw new Error(`Prompt file ${filename} could not be loaded.`);
  }
}
