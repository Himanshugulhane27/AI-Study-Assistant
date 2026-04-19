const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

class FileService {
  async extractText(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8');
    }
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    }
    return '';
  }

  deleteFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUploadConfig() {
    return {
      destination: 'uploads/',
      allowedExtensions: ['.pdf', '.txt'],
      maxFileSize: 10 * 1024 * 1024
    };
  }
}

module.exports = new FileService();
