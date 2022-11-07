const path = require('path');
const fs = require('fs');

fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), error => {
  if (error) return;
});

fs.readdir(path.join(__dirname, 'styles'), (error, files) => {
  if (error) throw error;
  const filteredFiles = files.filter(file => {
    const filePath = path.join(__dirname, 'styles', file);
    const objectSymbols = Object.getOwnPropertySymbols(file);
    if (path.extname(filePath) === '.css' && file[objectSymbols[0]] !== 2) return file;
  });

  for (const file of filteredFiles) {
    const filePath = path.join(__dirname, 'project-dist', 'bundle.css');
    const filteredFilePath = path.join(__dirname, 'styles', file);
    
    fs.readFile(filteredFilePath, (error, buffer) => {
      if (error) throw error;

      const fileInfo = buffer.toString();
      fs.appendFile(filePath, `${fileInfo}\n`, error => {
        if (error) throw error;
      })
    });
  }
});
