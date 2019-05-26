import {Application} from "express";
import {METHOD, Task} from "./task";
import axios from "axios";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import {debug} from "debug";
import {WarmupError} from "./warmupError";
import {randomPort, sleep} from "./utils";

export class Warmup {

    private readonly server: http.Server;
    private readonly hostname = "127.0.0.1";
    private readonly schema = "http";
    private debug = debug(Warmup.name);

    public constructor(app: Application, private readonly basepath: string) {
        this.server = http.createServer(app);

    }

    public async run(taskList: Task[]) {
        try {
            this.debug("begin");
            const port = await this.startServer();
            await sleep(500);
            this.debug("create client");
            const client = axios.create({
                baseURL: `${this.schema}://${this.hostname}:${port}`,
                timeout: 2000,
                responseType: 'text'
            });
            return await axios.all(taskList.map((task: Task) => {
                switch (task.method) {
                    case METHOD.GET:
                        return client.get(task.path);
                    case METHOD.POST:
                        if (typeof task.data !== "object") {
                            throw new WarmupError(`the data of ${task.path} is not object`)
                        }
                        return client.post(task.path, task.data);
                    case METHOD.JSON:
                        if (typeof task.data !== "string") {
                            throw new WarmupError(`the data of ${task.path} is not string`)
                        }
                        const datapath = path.resolve(this.basepath, task.data);
                        if (!fs.existsSync(datapath)) {
                            throw new WarmupError(`${datapath} not found`);
                        }
                        const data = fs.readFileSync(datapath);
                        this.debug(`post ${task.path}`);
                        return client.post(task.path, data, {
                            headers: {
                                "Content-Type": "application/json",
                                keepAlive: false
                            }
                        });
                    default:
                        throw new WarmupError(`${task.method} invalid;`);
                }
            }));
        } catch (e) {
            this.debug(e);
            throw e;
        } finally {
            this.debug("finish");
            await this.stopServer();
        }
    }

    private async startServer(): Promise<number> {
        let port = randomPort();
        this.debug(`get random port ${port}`);
        return new Promise<number>(async (resolve, reject) => {
            for (let i=0; i<20; ++i) {
                port += 1;
                this.debug(`try port ${port}`);
                try {
                    await new Promise<void>((resolve, reject) => {
                        this.server.listen(port);
                        this.server.on('listening', () => {
                            resolve();
                        });
                        this.server.on('error', err => {
                            this.debug("error");
                            reject(err);
                        });
                    });
                    this.debug(`use ${port}`);
                    resolve(port);
                    return ;
                } catch (e) {

                }
            }
            this.debug('not found');
            reject('not found');
        });
    }


    private async stopServer(): Promise<void> {
        this.debug("try to stop server");
        return new Promise<void>((resolve, reject) => {
            this.server.close(err => {
                if (err) {
                    this.debug(err);
                    reject(err);
                } else {
                    this.debug("close server");
                    resolve();
                }
            })
        });
    }
}
