// server.js

const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    const options = {
        convertImage: mammoth.images.imgElement((image) => {
            return fs.readFileSync(image, { encoding: 'base64' });
        }),
    };

    try {
        const result = await mammoth.convertToHtml({ path: filePath }, options);
        const html = result.value;

        // Add a page break and download button to the HTML content
        const modifiedHtml = `<div class="page-break">${html}</div>`;

        res.send(modifiedHtml);
    } catch (error) {
        console.error('Error converting document:', error);
        res.status(500).send('Error converting document.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});



// const express = require('express');
// const multer = require('multer');
// const mammoth = require('mammoth');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.static('public'));

// const storage = multer.diskStorage({
//     destination: 'uploads/',
//     filename: (req, file, callback) => {
//         callback(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage });

// app.post('/upload', upload.single('document'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     const filePath = req.file.path;
//     const options = {
//         convertImage: mammoth.images.imgElement((image) => {
//             return fs.readFileSync(image, { encoding: 'base64' });
//         }),
//     };

//     mammoth.convertToHtml({ path: filePath }, options)
//         .then((result) => {
//             const html = result.value;
//             res.send(html);
//         })
//         .catch((error) => {
//             console.error('Error converting document:', error);
//             res.status(500).send('Error converting document.');
//         });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port http://localhost:${port}`);
// });
