// From code/modules/ninja/suit/n_suit_verbs/ninja_net.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninjanet  (code/modules/ninja/suit/n_suit_verbs/ninja_net.dm:5)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjanet", function* ninjanet(f: Frame, C: Value) {
	let H: Value = null, _T: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [C, H, _T, E, $e];
	if (!(!truthy((yield* g.srcCall(f, "ninjacost", 200, 1))) && truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	H = rt.sv(f, "affecting");
	if (truthy(rt.fv(f, "client", live(C)))) {
		if (!truthy(rt.locateIn(f, T("/obj/structure/energy_net"), rt.fv(f, "loc", live(C))))) {
			_T = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [rt.fv(f, "loc", live(H)), rt.fv(f, "loc", live(C))])), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy(rt.fv(f, "density", live(_T)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You may not use an energy net through solid obstacles!</span>"]);
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
			yield* g.callName(f, live(H), "Beam", [null, live(C), null, "n_beam", "time", 15], rt.Args.Named);
			yield* g.callName(f, live(H), "say", ["Get over here!"]);
			E = (yield* g.new_(f, T("/obj/structure/energy_net"), [rt.fv(f, "loc", live(C))]));
			yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ caught ＀ with an energy net!</span>", [live(H), live(C)]), fmt("<span class='notice'>You caught ＀ with an energy net!</span>", [live(C)])]);
			rt.setFv(f, "affecting", live(E), live(C));
			rt.setFv(f, "master", live(E), live(H));
			rt.spawnTail(f, 0, "/obj/item/clothing/suit/space/space_ninja/proc/ninjanet: spawn at modules/ninja/suit/n_suit_verbs/ninja_net.dm:19", C, H, _T, E);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>＀ are already trapped inside an energy net!</span>", [(yield* g.callName(f, live(C), "p_they", [1]))])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>＀ will bring no honor to your Clan!</span>", [(yield* g.callName(f, live(C), "p_they", [1]))])]);
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/clothing/suit/space/space_ninja/proc/ninjanet, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ninjanet: spawn at modules/ninja/suit/n_suit_verbs/ninja_net.dm:19", function* (f: Frame, C: Value, H: Value, _T: Value, E: Value) {
	f.vars = () => [C, H, _T, E];
	yield* g.callName(f, live(E), "process", [live(C)]);
	return null;
});
