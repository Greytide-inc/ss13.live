// From code/game/objects/items/weapons/cosmetics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7148, "/obj/item/weapon/lipstick/random", "/obj/item/weapon/lipstick", {
	name: "lipstick",
});

// /obj/item/weapon/lipstick/random/proc/New  (code/game/objects/items/weapons/cosmetics.dm:30)  may sleep
rt.def("/obj/item/weapon/lipstick/random/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "colour", rt.op(f, "PickUnweighted", [7], ["red", "purple", "lime", "black", "green", "blue", "white"]));
	rt.setSv(f, "name", fmt("＀ lipstick", [rt.sv(f, "colour")]));
	return f.dot;
}, true);

rt.type(7144, "/obj/item/weapon/lipstick", "/obj/item/weapon", {
	colour: "red",
	open: 0,
	gender: "plural",
	name: "red lipstick",
	desc: "A generic brand of lipstick.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "lipstick",
	w_class: 1,
});

// /obj/item/weapon/lipstick/proc/attack_self  (code/game/objects/items/weapons/cosmetics.dm:37)
rt.def("/obj/item/weapon/lipstick/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let colored_overlay: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [colored_overlay, $0, $1, $2];
	rt.callSrc(f, "cut_overlays", []);
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "open"))) {
		$1 = $1;
		$2 = "closed";
	} else {
		$2 = "open";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You twist ％！ ＀.</span>", [$1, $2])]);
	rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
	if (truthy(rt.sv(f, "open"))) {
		rt.setFv(f, "color", (colored_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "lipstick_uncap_color"])), rt.sv(f, "colour"));
		rt.setSv(f, "icon_state", "lipstick_uncap");
		rt.callSrc(f, "add_overlay", [live(colored_overlay)]);
	} else {
		rt.setSv(f, "icon_state", "lipstick");
	}
	return f.dot;
});

// /obj/item/weapon/lipstick/proc/attack  (code/game/objects/items/weapons/cosmetics.dm:49)  may sleep
rt.def("/obj/item/weapon/lipstick/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null;
	let $0: any, $1: any;
	f.vars = () => [M, user, H, $0, $1];
	if (!truthy(rt.sv(f, "open"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (H = live(M)), "is_mouth_covered", [])))) {
			$0 = live(user);
			if (isEqual(live(H), live(user))) {
				$1 = "your";
			} else {
				$1 = "their";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>Remove ＀ mask!</span>", [$1])]);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "lip_style", live(H)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to wipe off the old lipstick first!</span>"]);
			return live(f.dot);
		}
		if (isEqual(live(H), live(user))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ does their lips with ％！.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You take a moment to apply ％！. Perfect!</span>", [live(f.src)])]);
			rt.setFv(f, "lip_style", live(H), "lipstick");
			rt.setFv(f, "lip_color", live(H), rt.sv(f, "colour"));
			yield* g.callName(f, live(H), "update_body", []);
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ begins to do ＀'s lips with ％！.</span>", [live(user), live(H), live(f.src)]), fmt("<span class='notice'>You begin to apply ％！ on ＀'s lips...</span>", [live(f.src), live(H)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(H)], rt.Args.Named)))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ does ＀'s lips with ％！.", [live(user), live(H), live(f.src)]), fmt("<span class='notice'>You apply ％！ on ＀'s lips.</span>", [live(f.src), live(H)])]);
				rt.setFv(f, "lip_style", live(H), "lipstick");
				rt.setFv(f, "lip_color", live(H), rt.sv(f, "colour"));
				yield* g.callName(f, live(H), "update_body", []);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Where are the lips on that?</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/paper/proc/attack  (code/game/objects/items/weapons/cosmetics.dm:83)  may sleep
rt.def("/obj/item/weapon/paper/proc/attack", function* attack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "mouth")) {
		if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (isEqual((H = live(f.args[0])), live(f.args[1]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You wipe off the lipstick with ＀.</span>", [live(f.src)])]);
				rt.setFv(f, "lip_style", live(H), null);
				yield* g.callName(f, live(H), "update_body", []);
			} else {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ begins to wipe ＀'s lipstick off with ％！.</span>", [live(f.args[1]), live(H), live(f.src)]), fmt("<span class='notice'>You begin to wipe off ＀'s lipstick...</span>", [live(H)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 10, "target", live(H)], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wipes ＀'s lipstick off with ％！.", [live(f.args[1]), live(H), live(f.src)]), fmt("<span class='notice'>You wipe off ＀'s lipstick.</span>", [live(H)])]);
					rt.setFv(f, "lip_style", live(H), null);
					yield* g.callName(f, live(H), "update_body", []);
				}
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(7149, "/obj/item/weapon/razor", "/obj/item/weapon", {
	flags: 64,
	name: "electric razor",
	desc: "The latest and greatest power razor born from the science of shaving.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "razor",
	w_class: 1,
});

// /obj/item/weapon/razor/proc/shave  (code/game/objects/items/weapons/cosmetics.dm:115)  may sleep
rt.def("/obj/item/weapon/razor/proc/shave", function* shave(f: Frame, H: Value, location: Value) {
	f.vars = () => [H, location];
	if (live(location) === null) {
		location = "mouth";
	}
	if (isEqual(live(location), "mouth")) {
		rt.setFv(f, "facial_hair_style", live(H), "Shaved");
	} else {
		rt.setFv(f, "hair_style", live(H), "Skinhead");
	}
	yield* g.callName(f, live(H), "update_hair", []);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 20, 1]);
	return f.dot;
}, true);

// /obj/item/weapon/razor/proc/attack  (code/game/objects/items/weapons/cosmetics.dm:125)  may sleep
rt.def("/obj/item/weapon/razor/proc/attack", function* attack(f: Frame) {
	let H: Value = null, location: Value = null, H_loc: Value = null;
	f.vars = () => [H, location, H_loc];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.args[0]);
		if (isEqual((location = rt.fv(f, "zone_selected", live(f.args[1]))), "mouth")) {
			if (!truthy((rt.isIn(f, 3, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is no facial hair to shave!</span>"]);
				return live(f.dot);
			}
			if (!truthy((yield* g.call(f, P("/proc/get_location_accessible"), null, [live(H), live(location)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The mask is in the way!</span>"]);
				return live(f.dot);
			}
			if (isEqual(rt.fv(f, "facial_hair_style", live(H)), "Shaved")) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Already clean-shaven!</span>"]);
				return live(f.dot);
			}
			if (isEqual(live(H), live(f.args[1]))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to shave their facial hair with ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You take a moment to shave your facial hair with ＀...</span>", [live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(H)], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ shaves his facial hair clean with ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You finish shaving with ＀. Fast and clean!</span>", [live(f.src)])]);
					yield* g.srcCall(f, "shave", live(H), live(location));
				}
			} else {
				H_loc = rt.fv(f, "loc", live(H));
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ tries to shave ＀'s facial hair with ＀.</span>", [live(f.args[1]), live(H), live(f.src)]), fmt("<span class='notice'>You start shaving ＀'s facial hair...</span>", [live(H)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(H)], rt.Args.Named)))) {
					if (isEqual(live(H_loc), rt.fv(f, "loc", live(H)))) {
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ shaves off ＀'s facial hair with ＀.</span>", [live(f.args[1]), live(H), live(f.src)]), fmt("<span class='notice'>You shave ＀'s facial hair clean off.</span>", [live(H)])]);
						yield* g.srcCall(f, "shave", live(H), live(location));
					}
				}
			}
		} else {
			if (isEqual(live(location), "head")) {
				if (!truthy((rt.isIn(f, 2, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is no hair to shave!</span>"]);
					return live(f.dot);
				}
				if (!truthy((yield* g.call(f, P("/proc/get_location_accessible"), null, [live(H), live(location)])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The headgear is in the way!</span>"]);
					return live(f.dot);
				}
				if (((isEqual(rt.fv(f, "hair_style", live(H)), "Bald") || isEqual(rt.fv(f, "hair_style", live(H)), "Balding Hair")) || isEqual(rt.fv(f, "hair_style", live(H)), "Skinhead"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is not enough hair left to shave!</span>"]);
					return live(f.dot);
				}
				if (isEqual(live(H), live(f.args[1]))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to shave their head with ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to shave your head with ＀...</span>", [live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 5, "target", live(H)], rt.Args.Named)))) {
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ shaves his head with ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You finish shaving with ＀.</span>", [live(f.src)])]);
						yield* g.srcCall(f, "shave", live(H), live(location));
					}
				} else {
					H_loc = rt.fv(f, "loc", live(H));
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ tries to shave ＀'s head with ＀!</span>", [live(f.args[1]), live(H), live(f.src)]), fmt("<span class='notice'>You start shaving ＀'s head...</span>", [live(H)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(H)], rt.Args.Named)))) {
						if (isEqual(live(H_loc), rt.fv(f, "loc", live(H)))) {
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ shaves ＀'s head bald with ＀!</span>", [live(f.args[1]), live(H), live(f.src)]), fmt("<span class='notice'>You shave ＀'s head bald.</span>", [live(H)])]);
							yield* g.srcCall(f, "shave", live(H), live(location));
						}
					}
				}
			} else {
				yield* g.callSuper(f, [], rt.Args.Same);
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });
