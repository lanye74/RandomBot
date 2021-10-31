import * as fs_bad from "fs-extra";
import * as path from "path";
import getCallerFile from "./util/getCallerFile.js";
// @ts-ignore
const fs = fs_bad.default;



type FSPromise = {
	promise: Promise<any>,
	resolve: Function,
	reject: Function
};

type FSTask = {
	promise: FSPromise,
	operation: string,
	path: string,
	invoker: string,
	protectFile: number,
	data: any[]
};



function createFSPromise(): FSPromise {
	let resolve, reject;

	const promise = new Promise((pResolve, pReject) => {
		resolve = pResolve;
		reject = pReject;
	});

	return {
		promise,
		// @ts-ignore -- yes, it's fine
		resolve,
		// @ts-ignore
		reject
	}
}



export default class FSManager {
	private static queue: FSTask[] = [];
	private static operating: boolean = false;

	private static thisPath = import.meta.url.split("/");
	private static basePath = this.thisPath.slice(3, this.thisPath.length - 4).join("/"); // cuts off the file:/// and backtracks from src/js/bot/FSManager.ts

	private static protectedFiles: Map<string, number> = new Map();
	private static haltedQueue: FSTask[] = []; // holds tasks that are waiting to write to a protected file
	private static protectID: number = 0;


	// if the read is intended to have a write follow up, protect the file until write is called with id
	static async read(pathToRead: string, writeIntent: number): Promise<void> {
		const promise = createFSPromise();

		this.queue.push(<FSTask>{
			promise,
			operation: "read",
			path: path.join(this.basePath, pathToRead), // this needs to be an absolute path
			invoker: getCallerFile(),
			protectFile: writeIntent,
			data: []
		});

		if(this.queue.length === 1 && !this.operating) {
			this.process();
		}

		return this.queue[this.queue.length - 1].promise.promise;
	}

	static generateProtectiveID(): number {
		return ++this.protectID;
	}

	private static async process(): Promise<void> {
		this.operating = true;

		const object = this.queue.shift();

		const {promise, operation, path, protectFile, data} = object!;
		const method: Function = fs[operation];


		// time to handle path protection

		if(this.protectedFiles.has(path) && !(this.protectedFiles.get(path) === protectFile)) {
			this.haltedQueue.push(object!);

			if(this.queue.length === 0) return;

			this.process();
		}

		if(this.protectedFiles.has(path) && this.protectedFiles.get(path) === protectFile) {
			this.protectedFiles.delete(path);

			this.queue.push(...this.haltedQueue.filter(task => task.path === path));
			this.haltedQueue = this.haltedQueue.filter(task => task.path !== path);
		}


		const output = await method.apply(null, [path, ...data]);

		if(output) {
			promise.resolve(output);
		} else {
			promise.resolve();
		}

		this.operating = false;


		if(this.queue.length === 0) return;

		this.process();
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
