import * as fs from "fs-extra";
//@ts-ignore
const {readFileSync} = fs.default;

import type {MessageCommand} from "../types";



const botVersion = JSON.parse(readFileSync("./package.json")).version;


export default function version(command: MessageCommand): void {
	command.channel.send(`Current bot version: ${botVersion}`);
}
