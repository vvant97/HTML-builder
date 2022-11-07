const path = require('path');
const fs = require('fs');

function copyDir() {
  fs.readdir(path.join(__dirname, 'files'), (error, files) => {
    if (error) throw error;
      
    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, error => {
      if (error) throw error;
    });
      
    for (const file of files) {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        error => {
          if (error) throw error;
        }
      );
    }

    fs.readdir(path.join(__dirname, 'files-copy'), (error, filesCopy) => {
      if (error) throw error;

      const nonExistentFile = filesCopy
        .filter(file => !files.includes(file))
        .join('');

      if (nonExistentFile) {
        fs.unlink(path.join(__dirname, 'files-copy', nonExistentFile), error => {
          if (error) throw error;
        });
      }
    });
  });
}

copyDir();
