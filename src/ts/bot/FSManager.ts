import * as fs_bad from "fs-extra";
import * as path from "path";
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
	private static protectID: number = 1;


	// if the read is intended to have a write follow up, protect the file until write is called with id
	static async read(pathToRead: string, flags: any[] = [], writeIntent: number = 0): Promise<any> {
		const promise = createFSPromise();

		console.log("pushing read to queue")

		this.queue.push(<FSTask>{
			promise,
			operation: "readFile",
			path: path.join(this.basePath, pathToRead), // this needs to be an absolute path
			protectFile: writeIntent,
			data: flags
		});

		console.log({text: "queue from read", queue: this.queue});

		if(this.queue.length === 1 && !this.operating) {
			setTimeout(() => {console.log("process call resolved in read"); this.process();}, 0);
		}

		console.log("returning")

		return this.queue[this.queue.length - 1].promise.promise;
	}

	static async write(pathToWrite: string, data: any[], writeResolved: number = 0): Promise<any> {
		const promise = createFSPromise();

		console.log("pushing write to queue")

		this.queue.push(<FSTask>{
			promise,
			operation: "writeFile",
			path: path.join(this.basePath, pathToWrite),
			protectFile: writeResolved,
			data
		});

		console.log({text: "queue from write", queue: this.queue});

		if(this.queue.length === 1 && !this.operating) {
			setTimeout(() => {console.log("process call resolved in write"); this.process();}, 0);
		}

		return this.queue[this.queue.length - 1].promise.promise;
	}

	static generateProtectiveID(): number {
		return ++this.protectID;
	}

	static release(what: string, id: number = 0) {
		this.releaseInternal(path.join(this.basePath, what), id);
	}

	private static releaseInternal(targetPath: string, id: number = 0) {
		let targetIndexes: number[] = [];

		this.protectedFiles.delete(targetPath);


		let tasks: FSTask[];

		if(id !== 0) {
			tasks = this.haltedQueue.filter((task, index) => { // verbose filter to capture index
				if(task.path === targetPath && task.protectFile === id) {
					targetIndexes.push(index);
					return true;
				}

				return false;
			});
		} else {
			tasks = this.haltedQueue.filter((task, index) => { // verbose filter to capture index
				if(task.path === targetPath) {
					targetIndexes.push(index);
					return true;
				}

				return false;
			});
		}


		if(!tasks) {
			return;
		}

		this.queue.push(...tasks); // there will only be one but ok

		for(const index of targetIndexes) {
			this.haltedQueue.splice(index, 1);
		}
	}

	static async process(): Promise<void> {
		this.operating = true;

		console.log(this.queue);

		const object = this.queue.shift();

		console.log(object);
		console.log("---------------");

		const {promise, operation, path, protectFile, data} = object!;
		const method: Function = fs[operation];


		// time to handle path protection

		if(protectFile !== 0) {
			if(this.protectedFiles.has(path) && this.protectedFiles.get(path) !== protectFile) {
				this.haltedQueue.push(object!);

				if(this.queue.length === 0) return;

				this.process();
			} else if(this.protectedFiles.has(path) && this.protectedFiles.get(path) === protectFile) {
				this.releaseInternal(path);
			} else if(!this.protectedFiles.has(path)) {
				this.protectedFiles.set(path, protectFile);
			}
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
