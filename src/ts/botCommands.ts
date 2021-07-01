import ping from "./commands/ping.js";



const botCommands: {[name: string]: Function} = {
	ping: ping
};



export default botCommands; // putting this on the same line as declaration is bad?