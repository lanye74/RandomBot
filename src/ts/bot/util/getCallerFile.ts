export default function getCallerFile(index: number = 0) {
	const err = new Error();

	Error.prepareStackTrace = (_error, stack) => stack;

	const stack = err.stack;

	Error.prepareStackTrace = undefined;

	// @ts-ignore
	return stack![index + 2].getFileName(); // [0] = this function, [1] = file invoking this, [2] = target
}
