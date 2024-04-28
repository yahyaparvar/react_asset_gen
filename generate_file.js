const fs = require('fs');

const fileName = 'output.txt';
const content = 'This is the content of my file.';

fs.writeFile(fileName, content, err => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    }
    console.log('File has been written successfully.');
});