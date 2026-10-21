// From code/game/objects/effects/manifest.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11818, "/obj/effect/manifest", "/obj/effect", {
	name: "manifest",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
});

// /obj/effect/manifest/proc/New  (code/game/objects/effects/manifest.dm:7)
rt.def("/obj/effect/manifest/proc/New", function New(f: Frame) {
	rt.setFv(f, "invisibility", live(f.src), 101);
	return f.dot;
});

// /obj/effect/manifest/proc/manifest  (code/game/objects/effects/manifest.dm:10)  may sleep
rt.def("/obj/effect/manifest/proc/manifest", function* manifest(f: Frame) {
	let dat: Value = null, M: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [dat, M, _P, $e];
	dat = "<B>Crew Manifest</B>:<BR>";
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		dat = rt.modify(live(dat), fmt("    <B>＀</B> -  ＀<BR>", [rt.fv(f, "name", live(M)), (yield* g.callName(f, live(M), "get_assignment", []))]), add);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "info", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.fv(f, "loc", live(f.src))]))), live(dat));
	rt.setFv(f, "name", live(_P), "paper- 'Crew Manifest'");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
