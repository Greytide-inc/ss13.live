// From code/game/objects/structures/destructible_structures.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12147, "/obj/structure/destructible", "/obj/structure", {
	break_message: "<span class='warning'>The strange, admin-y structure breaks!</span>",
	break_sound: rt.rsc("sound/magic/clockwork/invoke_general.ogg"),
	debris: null,
	max_integrity: 100,
	obj_integrity: 100,
});

// /obj/structure/destructible/proc/deconstruct  (code/game/objects/structures/destructible_structures.dm:9)  may sleep
rt.def("/obj/structure/destructible/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [disassembled, I, i, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(live(disassembled))) {
		if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
			if (truthy((rt.istype(rt.sv(f, "debris"), T("/list")) ? 1 : 0))) {
				I = null;
				rt.forList(f, 0, rt.sv(f, "debris"));
				while (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					i = null;
					rt.forRange(f, 1, 1, rt.index(rt.sv(f, "debris"), live(I)), 1);
					while (($e = rt.next(f, 1)) !== undefined) {
						i = $e;
						yield* g.new_(f, live(I), [rt.getStep(f, live(f.src), 0)]);
					}
					rt.endFor(f, 1);
				}
				rt.endFor(f, 0);
			}
		}
		if (truthy(rt.sv(f, "break_message"))) {
			yield* g.srcCall(f, "visible_message", rt.sv(f, "break_message"));
		}
		if (truthy(rt.sv(f, "break_sound"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "break_sound"), 50, 1]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);
