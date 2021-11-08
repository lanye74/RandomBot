import type {ObjectKey} from "../types";



export function getObjectReference<T>(object: {[key: ObjectKey]: any}): T {
	return {
		get value(): any {
			return object;
		},

		set value(to: any) {
			object = to;
		}
	}.value;
}



export function getPropertyReference<T>(object: {[key: ObjectKey]: any}, prop: ObjectKey): T {
	return {
		get value(): any {
			return object[prop];
		},

		set value(to: any) {
			object[prop] = to;
		}
	}.value; // return the getters and setters without having to access ref.value
}
