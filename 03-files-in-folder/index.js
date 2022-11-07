const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const { stdout: output } = process;

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (error, files) => {
    if (error) throw error;

    const filteredFiles = files.filter(file => {
      const objectSymbols = Object.getOwnPropertySymbols(file);
      return file[objectSymbols[0]] !== 2;
    });

    filteredFiles.forEach(file => {
      const fileName = file.name
      .split('.')
      .splice(0, 1)
      .join('');

      const fileExt = path
        .extname(path.join(__dirname, 'secret-folder', file.name))
        .slice(1);

      function getFileSize (path) {  
        return new Promise((resolve) => {
          resolve(fsPromises.stat(path));
        });
      }
      
      async function showFileInfo() {
        const sizeInBytes = await getFileSize(path.join(__dirname, 'secret-folder', file.name));
        
        output.write(`${fileName} - `);
        output.write(`${fileExt} - `);
        output.write(`${(sizeInBytes.size / 1000).toString()}kb\n`);
      }

      showFileInfo();
    });
});
