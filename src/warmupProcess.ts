import * as path from "path";
import * as JSON5 from "json5";
import * as fs from "fs";
import {WarmupError} from "./warmupError";
import {Task} from "./task";
import {Warmup} from "./warmup";
import {Application} from "express";
import {AxiosResponse} from "axios";

export class WarmupProcess {

    public constructor(
        private basedir: string
    ) {

    }

    public async run(app: Application,config: string): Promise<AxiosResponse<any>[]> {
        const configPath = path.resolve(this.basedir, config);
        const configData = JSON5.parse(fs.readFileSync(configPath).toString());
        if (!Array.isArray(configData.taskList)) {
            throw new WarmupError("taskList not array");
        }
        const taskList = new Array<Task>();
        for (const item of configData.taskList) {
            const task: Task = Object.assign(new Task(), item);
            taskList.push(task);
        }
        return new Warmup(app, this.basedir).run(taskList);
    }
}
