// Based on /tg/station's code/game/objects/effects/manifest.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11818, "/obj/effect/manifest", "/obj/effect", {
	name: "manifest",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
});

// manifest.dm:7
rt.def("/obj/effect/manifest/proc/New", function New(f: Frame) {
	this.invisibility = INVISIBILITY_ABSTRACT;
	return f.dot;
});

// manifest.dm:10
rt.def("/obj/effect/manifest/proc/manifest", function* manifest(f: Frame) {
	let M: Value = null, _P: Value = null;
	let dat: Value = "<B>Crew Manifest</B>:<BR>";
	for (M of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		dat += `    <B>${M.name}</B> -  ${M.get_assignment()}<BR>`;
	}
	(_P = (yield* new_(T("/obj/item/weapon/paper"), this.loc))).info = dat;
	_P.name = "paper- 'Crew Manifest'";
	yield* qdel(this);
	return f.dot;
}, true);
