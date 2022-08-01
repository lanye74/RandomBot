export function getObjectReference<T>(object: T): T {
	return {
		get value(): any {
			return object;
		},

		set value(to: any) {
			object = to;
		}
	}.value;
}



export function getPropertyReference<O extends object, K extends keyof O>(object: O, property: K): O[K] {
	return {
		get value(): any {
			return object[property];
		},

		set value(to: any) {
			object[property] = to;
		}
	}.value; // return the getters and setters without having to access ref.value
}
