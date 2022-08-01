export function getCallerFile(index: number = 0) {
	return getCallStack()[index + 2]; // [0] = this function, [1] = file invoking this, [2] = target
}



export function getCallStack(): string[] {
	const err = new Error();

	Error.prepareStackTrace = (_error, stack) => stack;

	const {stack} = err;

	Error.prepareStackTrace = undefined;

	// @ts-ignore
	return stack!.map(a => a.getFileName());
}
