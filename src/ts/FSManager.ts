import createFlexiblePromise from "./util/createFlexiblePromise.js";
import * as path from "path";

import * as fs_bad from "fs-extra";
// @ts-ignore
const fs: typeof fs_bad = fs_bad.default;

import type {FSTask, FSCall} from "./types/types.js";



export default class FSManager {
	private static queue: FSTask[] = [];
	private static operating: boolean = false;

	private static thisPath = import.meta.url.split("/");
	private static internalBasePath = this.thisPath.slice(3, this.thisPath.length - 3).join("/"); // cuts off the file:/// and backtracks from src/js/FSManager.ts
	private static externalBasePath = "";

	private static protectedFiles: Map<string, number> = new Map();
	private static haltedQueue: FSTask[] = []; // holds tasks that are waiting to write to a protected file
	private static protectID: number = 1;

	static async call<T = any>({method: operation, path: pathToOperate, data, fileProtector, internal}: FSCall): Promise<T> {
		const promise = createFlexiblePromise();

		const where = this.normalizePath(pathToOperate, internal ?? false);


		this.queue.push(<FSTask>{
			promise,
			operation,
			path: where,
			protectFile: fileProtector ?? 0,
			data: data ?? []
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

	static release(fileName: string, id: number = 0) {
		let targetIndexes: number[] = [];

		this.protectedFiles.delete(fileName);


		let tasks: FSTask[] = [];

		if(id !== 0) {
			tasks = this.haltedQueue.filter((task, index) => { // verbose filter to capture index
				if(task.path === fileName && task.protectFile === id) {
					targetIndexes.push(index);
					return true;
				}

				return false;
			});
		} else {
			tasks = this.haltedQueue.filter((task, index) => {
				if(task.path === fileName) {
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
		const {promise, operation, path, protectFile, data} = object!;



		const method = <Function>fs[operation as keyof typeof fs]; // eugh


		if(!method) {
			promise.reject("Invalid FS method called.");
			return;
		}


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

	static setExternalBasePath(to: string) {
		let preparedString: string | string[] = to;

		if(preparedString.startsWith("file:///")) {
			preparedString = preparedString.slice(8);
			preparedString += "/"; // ensure that it is treated as directory, if trailing, path.normalize will cut it out
		}

		this.externalBasePath = path.normalize(preparedString);
	}

	static normalizePath(pathToFix: string, internal: boolean = false): string {
		const pathNeeded = (internal) ? this.internalBasePath : this.externalBasePath;

		return (path.isAbsolute(pathToFix)) ? pathToFix : path.join(pathNeeded, pathToFix);
	}
}
