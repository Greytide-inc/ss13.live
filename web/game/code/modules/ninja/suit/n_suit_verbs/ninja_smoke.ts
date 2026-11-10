// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_smoke.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// ninja_smoke.dm:6
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjasmoke", function* ninjasmoke(f: Frame) {
	let smoke: Value = null;
	if (this.ninjacost(0, N_SMOKE_BOMB)) return f.dot;
	let H: Value = this.affecting;
	yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/bad")))).set_up(4, H.loc);
	yield* smoke.start();
	playsound(H.loc, rt.rsc("sound/effects/bamf.ogg"), 50, 2);
	this.s_bombs--;
	to_chat(H, `<span class='notice'>There are <B>${this.s_bombs}</B> smoke bombs remaining.</span>`);
	this.s_coold = 1;
	return f.dot;
}, true);
