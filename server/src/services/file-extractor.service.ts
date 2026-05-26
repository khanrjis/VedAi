import fs from 'node:fs/promises';
import path from 'node:path';

export const extractSourceTextFromFile = async (filePath?: string): Promise<string> => {
  if (!filePath) {
    return '';
  }

  const fileExtension = path.extname(filePath).toLowerCase();

  if (fileExtension === '.txt' || fileExtension === '.md' || fileExtension === '.json') {
    return fs.readFile(filePath, 'utf8');
  }

  return '';
};