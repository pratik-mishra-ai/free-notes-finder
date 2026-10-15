import { formatSize } from './format.js';

export const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

const REQUIRED = {
  title: 'Enter a note title.',
  subject: 'Choose a subject.',
  topic: 'Enter the topic.',
  semester: 'Choose a semester.',
  uploader: 'Enter your name.',
  description: 'Add a short description.',
};

export function validateFields(values) {
  const errors = {};
  Object.keys(REQUIRED).forEach((k) => {
    if (!String(values[k] || '').trim()) errors[k] = REQUIRED[k];
  });
  if (!errors.title && values.title.trim().length > 100) errors.title = 'Keep the title under 100 characters.';
  if (!errors.description && values.description.trim().length > 300) errors.description = 'Keep the description under 300 characters.';
  return errors;
}

// Returns an error message, or '' when the file is acceptable.
export function validateFile(file) {
  if (!file) return 'Choose a PDF file to upload.';
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isPdf) return 'Only PDF files are accepted.';
  if (file.size === 0) return 'This file is empty.';
  if (file.size > MAX_FILE_BYTES) return `This file is ${formatSize(file.size)}. The limit is ${formatSize(MAX_FILE_BYTES)}.`;
  return '';
}

// Reads a File as a Base64 PDF data URL and checks the %PDF header.
export function readPdfAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The file could not be read. Try selecting it again.'));
    reader.onload = () => {
      const base64 = String(reader.result).split(',')[1] || '';
      let header = '';
      try {
        header = atob(base64.slice(0, 8));
      } catch {
        /* invalid base64 */
      }
      if (!header.startsWith('%PDF')) {
        reject(new Error("This file isn't a valid PDF."));
        return;
      }
      resolve(`data:application/pdf;base64,${base64}`);
    };
    reader.readAsDataURL(file);
  });
}
