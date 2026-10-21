// The VM's random number generator: xoshiro128** seeded through splitmix32.
//
// BYOND's own generator can't be reproduced: rand_seed() exists, but its algorithm is
// undocumented and its output differs between builds and hosts, so a BYOND run and a VM run never
// draw the same numbers. We pick a small, well-known seedable generator instead, so two VM runs
// with the same seed make exactly the same random choices (the differential testing
// depends on that). Tests against BYOND therefore only check the *shape* of random results
// (range, integer-ness, which values can appear), never the values themselves.
//
// The default seed is fixed (not time-based) so headless runs are reproducible unless the host
// asks otherwise. DM's rand_seed(n) reseeds.

export class Random {
	private s0 = 0;
	private s1 = 0;
	private s2 = 0;
	private s3 = 0;

	constructor(seed = 0x5eed) {
		this.seed(seed);
	}

	seed(n: number): void {
		let x = n >>> 0;
		const next = () => {
			// splitmix32
			x = (x + 0x9e3779b9) >>> 0;
			let z = x;
			z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
			z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
			return (z ^ (z >>> 16)) >>> 0;
		};
		this.s0 = next();
		this.s1 = next();
		this.s2 = next();
		this.s3 = next();
		if ((this.s0 | this.s1 | this.s2 | this.s3) === 0) this.s0 = 1;
	}

	/** A uniform 32-bit unsigned integer. */
	nextU32(): number {
		const result = Math.imul(rotl(Math.imul(this.s1, 5) >>> 0, 7), 9) >>> 0;
		const t = (this.s1 << 9) >>> 0;
		this.s2 ^= this.s0;
		this.s3 ^= this.s1;
		this.s1 ^= this.s2;
		this.s0 ^= this.s3;
		this.s2 ^= t;
		this.s3 = rotl(this.s3, 11);
		this.s0 >>>= 0;
		this.s1 >>>= 0;
		this.s2 >>>= 0;
		this.s3 >>>= 0;
		return result;
	}

	/** A uniform float in [0, 1). */
	next(): number {
		return this.nextU32() / 4294967296;
	}

	/** A uniform integer in [lo, hi] (inclusive). */
	int(lo: number, hi: number): number {
		return lo + Math.floor(this.next() * (hi - lo + 1));
	}
}

function rotl(x: number, k: number): number {
	return ((x << k) | (x >>> (32 - k))) >>> 0;
}
