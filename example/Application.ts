import express from "express";
import * as bodyParser from "body-parser";
import {WarmupProcess} from "../src/warmupProcess";


const app = express();
app.use(bodyParser.json());
app.get("/get",(req, res) => {
    console.log(req.body);
    console.log(typeof req.body);
    res.send('use /get');
});

app.post('/post', (req, res) => {
    console.log(req.body);
    console.log(typeof req.body);
    res.send('use /post');
});
app.post('/json', (req, res) => {
    res.send('use json');
});

const warmup = new WarmupProcess(__dirname);
warmup.run(app, "conf/task.json5").then(value => {
    console.log('success');
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}).catch(err => {
    console.log(err);
});

