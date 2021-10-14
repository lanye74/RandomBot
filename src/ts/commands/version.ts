import * as fs from "fs-extra";
//@ts-ignore
const {readFileSync} = fs.default;

import type {Command} from "../types";



const botVersion = JSON.parse(readFileSync("./package.json")).version;


export default function version(command: Command): void {
	command.channel.send(`Current bot version: ${botVersion}`);
}
