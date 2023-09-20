const express = require('express');
const app = express();
const cors = require('cors');
// Enable CORS for all routes
app.use(cors());
const fs = require('fs');
const multer = require('multer'); // upload to server;

const t = require('tesseract.js');


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage}).single('inputImgText')
app.set("view engine", "ejs");


// ROUTES
app.get("/", async (req,res) => {
    res.render('Index')
})

app.post('/upload',  (req,res) => {
    upload( req, res, err => {
        if(err) return console.log("upload errr", err)
        fs.readFile(`./uploads/${req.file.originalname}`, async (err, fd) => {
            if(err) return console.log("file read err", err);
            const worker = await t.createWorker();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(fd);
            console.log("text",text);
            await worker.terminate();
            return
        });

    })
      
})

// start server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`runnin'on PORT=${PORT}`));



