import * as fs from "fs-extra";
//@ts-ignore
const {readFileSync} = fs.default;

import type {Command} from "../types";



export default function version(command: Command): void {
	const version = JSON.parse(readFileSync("./package.json")).version;

	command.channel.send(`Current bot version: ${version}`);
}
