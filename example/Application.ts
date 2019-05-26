import express from "express";
import * as bodyParser from "body-parser";
import {WarmupProcess} from "../src/warmupProcess";


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get("/get",(req, res) => {
    console.log("/get");
    console.log(req.body);
    console.log(typeof req.body);
    res.send('use /get');
});

app.post('/post', (req, res) => {
    console.log("/post");
    console.log(req.body);
    console.log(typeof req.body);
    res.send('use /post');
});
app.post('/json', (req, res) => {
    console.log("/json");
    console.log(req.body);
    console.log(typeof req.body);
    res.send('use json');
});

const warmup = new WarmupProcess(__dirname);
warmup.run(app, "conf/tasks.json5").then(value => {
    console.log('success');
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}).catch(err => {
    console.log(err);
});

