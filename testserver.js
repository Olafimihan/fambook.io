'use strict';
let express = require('express');
// let mysql = require('mysql');

let app = express();

let port = process.env.PORT || 2000;
let cron = require('cron');
let CronJob = require('cron').CronJob;

let cors = require('cors');
let bodyParser = require('body-parser');

let multer = require('multer');
let path = require('path');

let nodemailer = require('nodemailer');

 
let numeral = require('numeral');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let http = require('http');
let ejs = require('ejs');


let publicPath = path.join(__dirname, 'public');

let htmlPath = path.join(__dirname, 'views/html');

let socketIO = require('socket.io');
let server = http.createServer(app);

/** instantiate socket.io here */
let io = socketIO(server);

let fs = require('fs');
 
let dateFormat = require('dateformat');
const { Console } = require('console');
const { connect } = require('http2');
let outResultArray = [];

// ================================================================
// setup our express application
// ================================================================
app.set('view engine', 'html');
app.use('public', express.static(process.cwd() + 'public'));
// app.engine('html', require('ejs').renderFile);

app.set('views', __dirname);
app.use(express.static(htmlPath));
app.use(cors());
 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads/');
     },
     filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname);
        // cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
     }
});

 console.log(storage)

 
app.get('/', (req, res)=>{
    console.log(req.hostname)
    res.send(__dirname +  '/views/index.html')
})
   
 
server.listen(port, function() {
    // console.log('Server listening on port ' + port + '...');
    console.log(`Server listening on port ${port}`)
});

 
