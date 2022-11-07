const path = require('path');
const fs = require('fs');

const { stdout } = process;

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

readStream.on('data', chunk => stdout.write(chunk));
