// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// ninja_adrenaline.dm:5
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost", function* ninjaboost(f: Frame) {
	let H: Value = null, fraction: Value = null;
	if (this.ninjacost(0, N_ADRENALINE)) return f.dot;
	yield* (H = this.affecting).SetUnconscious(0);
	yield* H.SetStun(0);
	yield* H.SetKnockdown(0);
	rt.spawnTail(f, 30, "/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:11", H, fraction);
	rt.spawnTail(f, 70, "/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:13", H, fraction);
	this.a_boost--;
	to_chat(H, `<span class='notice'>There are <B>${this.a_boost}</B> adrenaline boosts remaining.</span>`);
	this.s_coold = 3;
	return f.dot;
}, true);

// a spawn(70) body of /obj/item/clothing/suit/space/space_ninja/proc/ninjaboost, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:13", function* (f: Frame, H: Value, fraction: Value) {
	if (this.reagents.total_volume) {
		fraction = min(this.a_transfer / this.reagents.total_volume, 1);
		yield* this.reagents.reaction(H, 5, fraction);
	}
	yield* this.reagents.trans_id_to(H, "radium", this.a_transfer);
	to_chat(H, "<span class='danger'>You are beginning to feel the after-effect of the injection.</span>");
	return null;
});

// a spawn(30) body of /obj/item/clothing/suit/space/space_ninja/proc/ninjaboost, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:11", function* (f: Frame, H: Value, fraction: Value) {
	yield* H.say(pick("A CORNERED FOX IS MORE DANGEROUS THAN A JACKAL!", "HURT ME MOOORRREEE!", "IMPRESSIVE!"));
	return null;
});
