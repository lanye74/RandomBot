import {createFlexiblePromise} from "./util/createFlexiblePromise.js";
import * as fs_bad from "fs-extra";
import * as path from "path";
// @ts-ignore
const fs: fs_bad = fs_bad.default;

import type {FSTask} from "./types.js";



export default class FSManager {
	private static queue: FSTask[] = [];
	private static operating: boolean = false;

	private static thisPath = import.meta.url.split("/");
	private static basePath = this.thisPath.slice(3, this.thisPath.length - 3).join("/"); // cuts off the file:/// and backtracks from src/js/FSManager.ts

	private static protectedFiles: Map<string, number> = new Map();
	private static haltedQueue: FSTask[] = []; // holds tasks that are waiting to write to a protected file
	private static protectID: number = 1;

	static async call<T = any>(operation: string, pathToOperate: string, data: any[] = [], fileProtector: number = 0): Promise<T> {
		const promise = createFlexiblePromise();

		const method = fs[operation];

		if(!method) {
			return Promise.reject("Invalid method");
		}


		this.queue.push(<FSTask>{
			promise,
			method,
			path: (path.isAbsolute(pathToOperate)) ? pathToOperate: path.join(this.basePath, pathToOperate),
			protectFile: fileProtector,
			data
		});

		if(this.queue.length === 1 && !this.operating) {
			setTimeout(() => {this.process()}, 0);
			// please don't ask me why I can't just do setTimeout(this.process, 0)
		}

		return this.queue[this.queue.length - 1].promise.promise;
	}

	static generateProtectiveID(): number {
		return ++this.protectID;
	}

	static release(what: string, id: number = 0) {
		const targetPath = (path.isAbsolute(what)) ? what : path.join(this.basePath, what);

		let targetIndexes: number[] = [];

		this.protectedFiles.delete(targetPath);


		let tasks: FSTask[] = [];

		if(id !== 0) {
			tasks = this.haltedQueue.filter((task, index) => { // verbose filter to capture index
				if(task.path === targetPath && task.protectFile === id) {
					targetIndexes.push(index);
					return true;
				}

				return false;
			});
		} else {
			tasks = this.haltedQueue.filter((task, index) => {
				if(task.path === targetPath) {
					targetIndexes.push(index);
					return true;
				}

				return false;
			});
		}


		if(tasks.length === 0) {
			return;
		}

		this.queue.push(...tasks);

		for(const index of targetIndexes) {
			this.haltedQueue.splice(index, 1);
		}
	}

	static async process(): Promise<void> {
		this.operating = true;

		const object = this.queue.shift();
		const {promise, method, path, protectFile, data} = object!;


		// time to handle path protection

		if(protectFile !== 0) {
			if(this.protectedFiles.has(path) && this.protectedFiles.get(path) !== protectFile) {
				this.haltedQueue.push(object!);

				if(this.queue.length === 0) return;

				this.process();
			} else if(this.protectedFiles.has(path) && this.protectedFiles.get(path) === protectFile) {
				this.release(path);
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
