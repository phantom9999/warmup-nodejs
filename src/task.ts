
export enum METHOD {
    GET = 'get',
    POST = 'post',
    JSON = 'json',
    DEFAULT = "default"
}

export class Task {
    public constructor(
        public method: METHOD = METHOD.DEFAULT,
        public path: string = "",
        public data: string|object = ""
    ) { }
}

