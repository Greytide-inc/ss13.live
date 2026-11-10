// Based on /tg/station's code/game/objects/structures/destructible_structures.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12147, "/obj/structure/destructible", "/obj/structure", {
	break_message: "<span class='warning'>The strange, admin-y structure breaks!</span>",
	break_sound: rt.rsc("sound/magic/clockwork/invoke_general.ogg"),
	debris: null,
	max_integrity: 100,
	obj_integrity: 100,
});

// destructible_structures.dm:9
rt.def("/obj/structure/destructible/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null, i: Value = null;
	let $e: any;
	disassembled ??= 1;
	if (!disassembled) {
		if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
			if (rt.istype(this.debris, T("/list"))) {
				for (I of each(this.debris)) {
					i = null;
					rt.forRange(f, 1, 1, rt.index(this.debris, I), 1);
					while (($e = rt.next(f, 1)) !== undefined) {
						i = $e;
						yield* new_(I, rt.getStep(f, this, 0));
					}
					rt.endFor(f, 1);
				}
			}
		}
		if (this.break_message) {
			this.visible_message(this.break_message);
		}
		if (this.break_sound) {
			playsound(this, this.break_sound, 50, 1);
		}
	}
	yield* qdel(this);
	return 1;
}, true);
