import * as fs_bad from "fs-extra";
// @ts-ignore
const fs = fs_bad.default;



export default class FSManager {
	private static queue: Function[] = [];

	static async write(to: string, what: any): Promise<void> {
		// uhhh

		return new Promise(resolve => {
			// resolves only once processed in FSManager.process?
		});
	}

	private static async process(): Promise<void> {

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
