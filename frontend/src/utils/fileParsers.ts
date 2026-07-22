import mammoth from 'mammoth';

export interface ParsedFileResult {
  title: string;
  content: string; // TipTap compatible HTML or raw text
  fileName: string;
}

export const parseUploadedFile = async (file: File): Promise<ParsedFileResult> => {
  const fileName = file.name;
  const fileExt = fileName.split('.').pop()?.toLowerCase();

  const title = fileName.replace(/\.[^/.]+$/, '');

  if (fileExt === 'txt' || fileExt === 'md') {
    const text = await file.text();
    // Convert plain text or markdown to simple paragraphs for TipTap
    const paragraphs = text
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');

    const content = paragraphs || `<p>${escapeHtml(text)}</p>`;
    return { title, content, fileName };
  } else if (fileExt === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlContent = result.value || '<p></p>';
    return { title, content: htmlContent, fileName };
  } else {
    throw new Error('Unsupported file format. Please upload a .txt, .md, or .docx file.');
  }
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
