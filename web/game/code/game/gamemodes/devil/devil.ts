// From code/game/gamemodes/devil/devil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/check_devil_bane_multiplier  (code/game/gamemodes/devil/devil.dm:2)  may sleep
rt.def("/mob/living/proc/check_devil_bane_multiplier", function* check_devil_bane_multiplier(f: Frame, weapon: Value, attacker: Value) {
	let devilInfo: Value = null, H: Value = null, U: Value = null;
	let $0: any;
	f.vars = () => [weapon, attacker, devilInfo, H, U, $0];
	$0 = rt.gv(f, "bane", (devilInfo = (yield* g.callName(f, rt.sv(f, "mind"), "has_antag_datum", [T("/datum/antagonist/devil")]))));
	if ($0 === "whiteclothes") {
		if (truthy((rt.istype(live(attacker), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "w_uniform", (H = live(attacker)))) && truthy((rt.istype(rt.fv(f, "w_uniform", live(H)), T("/obj/item/clothing/under")) ? 1 : 0)))) {
				if ((truthy((U = rt.fv(f, "w_uniform", live(H)))) && truthy(rt.index(rt.gl("whiteness"), rt.fv(f, "type", live(U)))))) {
					yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＀ seems to have been harmed by the purity of ＀'s clothes.</span>", [live(f.src), live(attacker)]), "<span class='notice'>Unsullied white clothing is disrupting your form.</span>"]);
					return add(rt.index(rt.gl("whiteness"), rt.fv(f, "type", live(U))), 1);
				}
			}
		}
	} else if ($0 === "toolbox") {
		if (truthy((rt.istype(live(weapon), T("/obj/item/weapon/storage/toolbox")) ? 1 : 0))) {
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>The ＀ seems unusually robust this time.</span>", [live(weapon)]), fmt("<span class='notice'>The ＀ is your unmaking!</span>", [live(weapon)])]);
			return 2.5;
		}
	} else if ($0 === "harvest") {
		if (truthy((rt.istype(live(weapon), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0))) {
			yield* g.srcCall(f, "visible_message", "<span class='warning'>The spirits of the harvest aid in the exorcism.</span>", "<span class='notice'>The harvest spirits are harming you.</span>");
			yield* g.srcCall(f, "Knockdown", 40);
			yield* g.call(f, P("/proc/qdel"), null, [live(weapon)]);
			return 2;
		}
	}
	return 1;
}, true);
