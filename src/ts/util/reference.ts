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



export function getPropertyReference<O extends {[key: PropertyKey]: any}, K extends keyof O>(object: O, prop: K): O[K] {
	return {
		get value(): any {
			return object[prop];
		},

		set value(to: any) {
			object[prop] = to;
		}
	}.value; // return the getters and setters without having to access ref.value
}
