import ping from "./commands/ping.js";
import kick from "./commands/kick.js";



const botCommands: {[name: string]: Function} = {
	ping: ping,
	kick: kick
};



export default botCommands; // putting this on the same line as declaration is bad?