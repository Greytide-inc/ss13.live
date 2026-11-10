// Based on /tg/station's code/game/objects/effects/spawners/vaultspawner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11946, "/obj/effect/vaultspawner", "/obj/effect", {
	maxX: 6,
	maxY: 6,
	minX: 2,
	minY: 2,
});

// vaultspawner.dm:8
rt.def("/obj/effect/vaultspawner/proc/New", function* New(f: Frame, location: Value, lX: Value, uX: Value, lY: Value, uY: Value, type: Value) {
	let j: Value = null, _T: Value = null;
	lX ??= this.minX;
	uX ??= this.maxX;
	lY ??= this.minY;
	uY ??= this.maxY;
	if (!type) {
		type = pick("sandstone", "rock", "alien");
	}
	let lowBoundX: Value = location.x;
	let lowBoundY: Value = location.y;
	let hiBoundX: Value = location.x + rand(lX, uX);
	let hiBoundY: Value = location.y + rand(lY, uY);
	let z: Value = location.z;
	let i: Value = lowBoundX;
	while (i <= hiBoundX) {
		j = lowBoundY;
		while (j <= hiBoundY) {
			_T = rt.locate(i, j, z);
			if (i == lowBoundX || i == hiBoundX || j == lowBoundY || j == hiBoundY) {
				yield* _T.ChangeTurf(T("/turf/closed/wall/vault"));
			} else {
				yield* _T.ChangeTurf(T("/turf/open/floor/vault"));
			}
			_T.icon_state = `${type}vault`;
			j++;
		}
		i++;
	}
	yield* qdel(this);
	return f.dot;
}, true);
