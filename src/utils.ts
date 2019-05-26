
export function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    })
}

export function randomPort() {
    return Math.floor(Math.random() * 40001) + 10000;
}
