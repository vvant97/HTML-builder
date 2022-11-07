const path = require('path');
const fs = require('fs');

// Project directory creation
fs.mkdir(
  path.join(__dirname, 'project-dist'), 
  { recursive: true }, 
  (error) => {
    if (error) throw error;
});

// Assets directory creation
fs.mkdir(
  path.join(__dirname, 'project-dist', 'assets'),
  { recursive: true },
  (error) => {
    if (error) throw error;
  }
);

// Assets folders creation
fs.readdir(path.join(__dirname, 'assets'), (error, folders) => {
  if (error) throw error;
  for (const folder of folders) {
    fs.mkdir(
      path.join(__dirname, 'project-dist', 'assets', folder),
      { recursive: true },
      (error) => {
        if (error) throw error;

        // Copying files in assets folders
        fs.readdir(path.join(__dirname, 'assets', folder), (error, files) => {
          if (error) throw error;
          
          for (const file of files) {
            const fileSrc = path.join(__dirname, 'assets', folder, file);
            const fileDest = path.join(__dirname, 'project-dist', 'assets', folder, file);
            fs.copyFile(fileSrc, fileDest, (error) => {
              if (error) return;
            });
          }
        });
      }
    );
  }
});

// Style.css creation
fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), (error) => {
  if (error) return;
});

// Bundling styles into style.css
fs.readdir(path.join(__dirname, 'styles'), (error, files) => {
  if (error) throw error;
  const filteredFiles = files.filter(file => {
    const filePath = path.join(__dirname, 'styles', file);
    const objectSymbols = Object.getOwnPropertySymbols(file);
    if (path.extname(filePath) === '.css' && file[objectSymbols[0]] !== 2) return file;
  });

  for (const file of filteredFiles) {
    const filePath = path.join(__dirname, 'project-dist', 'style.css');
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

// Copy html file to dist directory
fs.copyFile(
  path.join(__dirname, 'template.html'),
  path.join(__dirname, 'project-dist', 'index.html'),
  (error) => {
    if (error) throw error;
  }
);

// Templating index.html
fs.readFile(
  path.join(__dirname, 'project-dist', 'index.html'),
  (error, data) => {
    if (error) throw error;
    let buffered = data.toString();

    fs.readdir(path.join(__dirname, 'components'), (error, files) => {
      if (error) throw error;
      
      for (const file of files) {
        const fileName = file.split('.').splice(0, 1).join('');
        const fileExt = path.extname(path.join(__dirname, 'components', file));

        if (buffered.includes(`{{${fileName}}}`)) {
          fs.readFile(path.join(__dirname, 'components', file), (error, fileData) => {
            if (error) throw error;
            buffered = buffered.replace(`{{${fileName}}}`, fileData.toString());

            fs.writeFile(path.join(
              __dirname, 'project-dist', 'index.html'), 
              buffered, 
              (error) => {
                if (error) throw error;
              }
            );
          });
        }
      }
    });
  }
);
