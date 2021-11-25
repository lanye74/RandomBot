import type {FlexiblePromise} from "../types/types.js";



export default function createFlexiblePromise(): FlexiblePromise {
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
