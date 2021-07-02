export default class BitMath {
	static power2Sum(input: number, collectedPowers: number[] = []): number[] {
		// 1 digit: 2^0-3
		// 2 digit: 2^4-6
		// 3: 2^7-9
		// 4: 2^10-13

		const digits = input.toString().length;

		let guessPower = (digits * 3);


		if(input === 0) {
			return collectedPowers;
		}

		while((2 ** guessPower) > input) {
			guessPower--;
		}

		while(2 ** (guessPower + 1) < input) { // simplify?
			guessPower++;
		}

		collectedPowers.push(guessPower);


		return this.power2Sum(input - (2 ** guessPower), collectedPowers);
	}

	static power2SumNew(input: number): number[] {
		const bits = input.toString(2).split("").map(bit => parseInt(bit)).reverse(); // not necessary to parseInt, but nice
		// note: .map(parseInt) fails for some reason, second bit becomes NaN

		console.log(bits)

		const bitLocations: number[] = [];

		for(let i = 0; i < bits.length; i++) {
			if(bits[i] === 0) {
				continue;
			} else {
				bitLocations.push(i);
			}
		}

		return bitLocations;
	}
}