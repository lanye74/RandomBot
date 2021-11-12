import type {FlexiblePromise} from "../types.js";

export function createFlexiblePromise(): FlexiblePromise {
	let resolve: Function, reject: Function;

	const promise = new Promise((pResolve, pReject) => {
		resolve = pResolve;
		reject = pReject;
	});

	return {
		promise,
		resolve: resolve!,
		reject: reject!
	};
}
