// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_net.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// ninja_net.dm:5
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjanet", function* ninjanet(f: Frame, C: Value) {
	let _T: Value = null, E: Value = null;
	if (!(!this.ninjacost(200, N_STEALTH_CANCEL) && rt.istype(C, T("/mob/living/carbon")))) return f.dot;
	let H: Value = this.affecting;
	if (C.client) {
		if (!rt.locateIn(f, T("/obj/structure/energy_net"), C.loc)) {
			for (_T of each(getline(H.loc, C.loc), T("/turf"))) {
				if (_T.density) {
					to_chat(H, "<span class='warning'>You may not use an energy net through solid obstacles!</span>");
					return f.dot;
				}
			}
			yield* H.Beam(C, "n_beam", { time: 15 });
			yield* H.say("Get over here!");
			E = (yield* new_(T("/obj/structure/energy_net"), C.loc));
			H.visible_message(`<span class='danger'>${H} caught ${C} with an energy net!</span>`, `<span class='notice'>You caught ${C} with an energy net!</span>`);
			E.affecting = C;
			E.master = H;
			rt.spawnTail(f, 0, "/obj/item/clothing/suit/space/space_ninja/proc/ninjanet: spawn at modules/ninja/suit/n_suit_verbs/ninja_net.dm:19", C, H, _T, E);
		} else {
			to_chat(H, `<span class='warning'>${C.p_they(1)} are already trapped inside an energy net!</span>`);
		}
	} else {
		to_chat(H, `<span class='warning'>${C.p_they(1)} will bring no honor to your Clan!</span>`);
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/clothing/suit/space/space_ninja/proc/ninjanet, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ninjanet: spawn at modules/ninja/suit/n_suit_verbs/ninja_net.dm:19", function* (f: Frame, C: Value, H: Value, _T: Value, E: Value) {
	yield* E.process(C);
	return null;
});
