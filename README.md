# warmup-node
warmup for nodejs application

# usage

```
npm install warmup-nodejs
```
or
```
yarn add warmup-nodejs
```

# example

```
import express from "express";
import * as bodyParser from "body-parser";
import {WarmupProcess} from "../src/warmupProcess";


const app = express();

const warmup = new WarmupProcess(__dirname);
warmup.run(app, "conf/tasks.json5").then(value => {
    console.log('success');
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}).catch(err => {
    console.log(err);
});

```




