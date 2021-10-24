export default function sleep(duration: number): any {
	return new Promise(res => setTimeout(res, duration));
}
