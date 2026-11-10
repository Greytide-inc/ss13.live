// Based on /tg/station's code/game/objects/structures/dresser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12730, "/obj/structure/dresser", "/obj/structure", {
	anchored: 1,
	name: "dresser",
	desc: "A nicely-crafted wooden dresser. It's filled with lots of undies.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "dresser",
	density: 1,
});

// dresser.dm:10
rt.def("/obj/structure/dresser/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	if (!rt.istype(_P, T("/obj/item/weapon/wrench"))) return f.dot;
	let $0: any = user;
	to_chat($0, `<span class='notice'>You begin to ${this.anchored ? "unwrench" : "wrench"} ${this}.</span>`);
	playsound(this, _P.usesound, 50, 1);
	if (!(yield* do_after(user, 20, { target: this }))) return f.dot;
	to_chat(user, `<span class='notice'>You successfully ${this.anchored ? "unwrench" : "wrench"} ${this}.</span>`);
	this.anchored = (!this.anchored ? 1 : 0);
	return f.dot;
}, true);

// dresser.dm:18
rt.def("/obj/structure/dresser/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/mineral/wood"), rt.getStep(f, this, 0), 10);
	yield* qdel(this);
	return f.dot;
}, true);

// dresser.dm:22
rt.def("/obj/structure/dresser/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, new_undies: Value = null, new_undershirt: Value = null, new_socks: Value = null;
	if (!this.Adjacent(user)) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	if ((H = user).dna && H.dna.species && rt.isIn(f, NO_UNDERWEAR, H.dna.species.species_traits)) {
		to_chat(user, "<span class='warning'>You are not capable of wearing underwear.</span>");
		return f.dot;
	}
	let choice: Value = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Underwear, Undershirt, or Socks?", user, list("Underwear", "Undershirt", "Socks")]));
	if (!this.Adjacent(user)) {
		return f.dot;
	}
	if (choice === "Underwear") {
		if (new_undies = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Select your underwear", user, GLOB.underwear_list]))) {
			H.underwear = new_undies;
		}
	} else if (choice === "Undershirt") {
		if (new_undershirt = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Select your undershirt", user, GLOB.undershirt_list]))) {
			H.undershirt = new_undershirt;
		}
	} else if (choice === "Socks") {
		if (new_socks = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Select your socks", user, GLOB.socks_list]))) {
			H.socks = new_socks;
		}
	}
	yield* this.add_fingerprint(H);
	yield* H.update_body();
	return f.dot;
}, true);
