// Based on /tg/station's code/game/gamemodes/devil/devil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// devil.dm:2
rt.def("/mob/living/proc/check_devil_bane_multiplier", function* check_devil_bane_multiplier(f: Frame, weapon: Value, attacker: Value) {
	let devilInfo: Value = null, H: Value = null, U: Value = null;
	const bane = (devilInfo = this.mind.has_antag_datum(T("/datum/antagonist/devil"))).bane;
	if (bane === "whiteclothes") {
		if (rt.istype(attacker, T("/mob/living/carbon/human"))) {
			if ((H = attacker).w_uniform && rt.istype(H.w_uniform, T("/obj/item/clothing/under"))) {
				if ((U = H.w_uniform) && rt.index(GLOB.whiteness, U.type)) {
					this.visible_message(`<span class='warning'>${this} seems to have been harmed by the purity of ${attacker}'s clothes.</span>`, "<span class='notice'>Unsullied white clothing is disrupting your form.</span>");
					return rt.index(GLOB.whiteness, U.type) + 1;
				}
			}
		}
	} else if (bane === "toolbox") {
		if (rt.istype(weapon, T("/obj/item/weapon/storage/toolbox"))) {
			this.visible_message(`<span class='warning'>The ${weapon} seems unusually robust this time.</span>`, `<span class='notice'>The ${weapon} is your unmaking!</span>`);
			return 2.5;
		}
	} else if (bane === "harvest") {
		if (rt.istype(weapon, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			this.visible_message("<span class='warning'>The spirits of the harvest aid in the exorcism.</span>", "<span class='notice'>The harvest spirits are harming you.</span>");
			yield* this.Knockdown(40);
			yield* qdel(weapon);
			return 2;
		}
	}
	return 1;
}, true);
