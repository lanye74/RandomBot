import * as fs_bad from "fs-extra";
// @ts-ignore
const fs = fs_bad.default;



type FSOperation = "read" | "write";


export default class FSManager {
	private static queue: [Promise<any>, FSOperation, ...any][] = [];
	private static operating: boolean = false;

	// if the read is intended to have a write follow up, protect the file until write is called with id
	static async read(what: string, writeIntent: string = "0"): Promise<void> {
		const promise = new Promise((res, rej) => {});
		const intent = (writeIntent !== "0") ? parseInt(writeIntent) : 0;

		const args: [Promise<any>, FSOperation, ...any] = [promise, "read", what];
		if(intent) args.push(intent); // this is complete ass but ok

		this.queue.push(args);


		if(this.queue.length === 1 && !this.operating) {
			this.process();
		}

		return this.queue[this.queue.length - 1][0];
	}

	private static async process(): Promise<void> {
		this.operating = true;

		const object = this.queue.shift();
	}
}

/*
fsmanager.push(read call)
.then(data)

const data = await fsmanager.read(file) ?

await fsmanager.write(data);


does this work?

(file)
const n = await fsmanager.promise(data);

(promise)
queue.push(data);

(queue resolver)
data.resolve();

(file)
// continues


*/
