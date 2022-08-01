export default function sleep(duration: number) {
	return new Promise(res => setTimeout(res, duration));
}
