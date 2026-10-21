// From code/modules/mob/living/simple_animal/friendly/dog.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5050, "/mob/living/simple_animal/pet/dog", "/mob/living/simple_animal/pet", {
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	faction: null,
	see_in_dark: 5,
	speak_chance: 1,
	turns_per_move: 10,
});

// /mob/living/simple_animal/pet/dog/proc/<init>  (code/modules/mob/living/simple_animal/friendly/dog.dm:11)
rt.def("/mob/living/simple_animal/pet/dog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("YAP", "Woof!", "Bark!", "AUUUUUU"));
	rt.setSv(f, "speak_emote", rt.list("barks", "woofs"));
	rt.setSv(f, "emote_hear", rt.list("barks!", "woofs!", "yaps.", "pants."));
	rt.setSv(f, "emote_see", rt.list("shakes its head.", "chases its tail.", "shivers."));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("dog"));
	return f.dot;
});

rt.type(5051, "/mob/living/simple_animal/pet/dog/corgi", "/mob/living/simple_animal/pet/dog", {
	shaved: 0,
	inventory_head: null,
	inventory_back: null,
	facehugger: null,
	nofur: 0,
	name: "１corgi",
	real_name: "corgi",
	desc: "It's a corgi.",
	icon_state: "corgi",
	icon_living: "corgi",
	icon_dead: "corgi_dead",
	butcher_results: null,
	childtype: null,
	animal_species: rt.typePath("/mob/living/simple_animal/pet/dog"),
	gold_core_spawnable: 2,
});

// /mob/living/simple_animal/pet/dog/corgi/proc/<init>  (code/modules/mob/living/simple_animal/friendly/dog.dm:25)
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), 3, T("/obj/item/stack/sheet/animalhide/corgi"), 1]));
	$0 = $0;
	rt.setSv(f, "childtype", rt.alist(f, [T("/mob/living/simple_animal/pet/dog/corgi/puppy"), 95, T("/mob/living/simple_animal/pet/dog/corgi/puppy/void"), 5]));
	return f.dot;
});

rt.type(5056, "/mob/living/simple_animal/pet/dog/pug", "/mob/living/simple_animal/pet/dog", {
	name: "１pug",
	real_name: "pug",
	desc: "It's a pug.",
	icon: rt.rsc("icons/mob/pets.dmi"),
	icon_state: "pug",
	icon_living: "pug",
	icon_dead: "pug_dead",
	butcher_results: null,
	gold_core_spawnable: 2,
});

// /mob/living/simple_animal/pet/dog/pug/proc/<init>  (code/modules/mob/living/simple_animal/friendly/dog.dm:43)
rt.def("/mob/living/simple_animal/pet/dog/pug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/pug"), 3]));
	return f.dot;
});

// /mob/living/simple_animal/pet/dog/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/dog.dm:47)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/proc/Initialize", function* Initialize(f: Frame) {
	let dog_area: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [dog_area, D, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	dog_area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	D = null;
	rt.forList(f, 0, live(dog_area), T("/obj/structure/bed/dogbed"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!truthy(rt.fv(f, "owner", live(D)))) {
			yield* g.callName(f, live(D), "update_owner", [live(f.src)]);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/dog.dm:55)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "regenerate_icons");
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/death  (code/modules/mob/living/simple_animal/friendly/dog.dm:60)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.callSuper(f, [live(gibbed)]);
	yield* g.srcCall(f, "regenerate_icons");
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/show_inv  (code/modules/mob/living/simple_animal/friendly/dog.dm:64)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if (truthy(rt.fv(f, "stat", live(user)))) {
		return live(f.dot);
	}
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/getarmor  (code/modules/mob/living/simple_animal/friendly/dog.dm:85)
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	let armorval: Value = null;
	f.vars = () => [armorval];
	armorval = 0;
	if (truthy(live(def_zone))) {
		if (isEqual(live(def_zone), "head")) {
			if (truthy(rt.sv(f, "inventory_head"))) {
				armorval = rt.index(rt.fv(f, "armor", rt.sv(f, "inventory_head")), live(type));
			}
		} else {
			if (truthy(rt.sv(f, "inventory_back"))) {
				armorval = rt.index(rt.fv(f, "armor", rt.sv(f, "inventory_back")), live(type));
			}
		}
		return live(armorval);
	} else {
		if (truthy(rt.sv(f, "inventory_head"))) {
			armorval = rt.modify(live(armorval), rt.index(rt.fv(f, "armor", rt.sv(f, "inventory_head")), live(type)), add);
		}
		if (truthy(rt.sv(f, "inventory_back"))) {
			armorval = rt.modify(live(armorval), rt.index(rt.fv(f, "armor", rt.sv(f, "inventory_back")), live(type)), add);
		}
	}
	return multiply(live(armorval), 0.5);
});

// /mob/living/simple_animal/pet/dog/corgi/proc/attackby  (code/modules/mob/living/simple_animal/friendly/dog.dm:100)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/razor")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "shaved"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't shave this corgi, it's already been shaved!</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "nofur"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'> You can't shave this corgi, it doesn't have a fur coat!</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to shave ＀ using ％！.", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You start to shave ＀ using ％！...</span>", [live(f.src), live(f.args[0])])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ shaves ＀'s hair using ％！.", [live(f.args[1]), live(f.src), live(f.args[0])])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 20, 1]);
			rt.setSv(f, "shaved", 1);
			rt.setSv(f, "icon_living", fmt("＀_shaved", [rt.initial(f, live(f.src), "icon_living")]));
			rt.setSv(f, "icon_dead", fmt("＀_shaved_dead", [rt.initial(f, live(f.src), "icon_living")]));
			if (isEqual(rt.sv(f, "stat"), 0)) {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_living"));
			} else {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_dead"));
			}
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_corgi_fluff");
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /mob/living/simple_animal/pet/dog/corgi/proc/Topic  (code/modules/mob/living/simple_animal/friendly/dog.dm:125)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/Topic", function* Topic(f: Frame) {
	let remove_from: Value = null, add_to: Value = null, item_to_add: Value = null, allowed: Value = null, i: Value = null;
	let $0: any, $e: any;
	f.vars = () => [remove_from, add_to, item_to_add, allowed, i, $0, $e];
	// tg_js: incapacitated too (cuffed, stunned), as the other strip menus' canUseTopic does
	if (truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "remove_inv"))) {
		if ((!truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))) || !(((truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/monkey")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0))))) {
			return live(f.dot);
		}
		$0 = (remove_from = rt.at(live(f.args[1]), "remove_inv"));
		if ($0 === "head") {
			if (truthy(rt.sv(f, "inventory_head"))) {
				rt.setFv(f, "loc", rt.sv(f, "inventory_head"), rt.fv(f, "loc", live(f.src)));
				rt.setSv(f, "inventory_head", null);
				yield* g.srcCall(f, "update_corgi_fluff");
				yield* g.srcCall(f, "regenerate_icons");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>There is nothing to remove from its ＀.</span>", [live(remove_from)])]);
				return live(f.dot);
			}
		} else if ($0 === "back") {
			if (truthy(rt.sv(f, "inventory_back"))) {
				rt.setFv(f, "loc", rt.sv(f, "inventory_back"), rt.fv(f, "loc", live(f.src)));
				rt.setSv(f, "inventory_back", null);
				yield* g.srcCall(f, "update_corgi_fluff");
				yield* g.srcCall(f, "regenerate_icons");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>There is nothing to remove from its ＀.</span>", [live(remove_from)])]);
				return live(f.dot);
			}
		}
		yield* g.srcCall(f, "show_inv", live(f.usr));
	} else {
		if (truthy(rt.at(live(f.args[1]), "add_inv"))) {
			if ((!truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))) || !(((truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/monkey")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0))))) {
				return live(f.dot);
			}
			$0 = (add_to = rt.at(live(f.args[1]), "add_inv"));
			if ($0 === "head") {
				yield* g.srcCall(f, "place_on_head", (yield* g.callName(f, live(f.usr), "get_active_held_item", [])), live(f.usr));
			} else if ($0 === "back") {
				if (truthy(rt.sv(f, "inventory_back"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It's already wearing something!</span>"]);
					return live(f.dot);
				} else {
					if (!truthy((item_to_add = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))))) {
						yield* g.callName(f, live(f.usr), "visible_message", [fmt("＀ pets ＀.", [live(f.usr), live(f.src)]), fmt("<span class='notice'>You rest your hand on ＀'s back for a moment.</span>", [live(f.src)])]);
						return live(f.dot);
					}
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it on ＀'s back!</span>", [live(item_to_add), live(f.src)])]);
						return live(f.dot);
					}
					if (truthy((rt.istype(live(item_to_add), T("/obj/item/weapon/grenade/plastic")) ? 1 : 0))) {
						yield* g.callName(f, live(item_to_add), "afterattack", [live(f.src), live(f.usr), 1]);
						return live(f.dot);
					}
					allowed = 0;
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "dog_fashion", live(item_to_add)), T("/datum/dog_fashion/back")])))) {
						allowed = 1;
					}
					if (!truthy(live(allowed))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You set ＀ on ＀'s back, but it falls off!</span>", [live(item_to_add), live(f.src)])]);
						rt.setFv(f, "loc", live(item_to_add), rt.sv(f, "loc"));
						if (truthy(rt.op(f, "Prob", [], [25]))) {
							yield* g.call(f, P("/proc/step_rand"), null, [live(item_to_add)]);
						}
						i = null;
						rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 8, 4, rt.sv(f, "dir")));
						while (($e = rt.next(f, 0)) !== undefined) {
							i = $e;
							yield* g.srcCall(f, "setDir", live(i));
							yield* g.call(f, P("/proc/sleep"), null, [1]);
						}
						rt.endFor(f, 0);
						return live(f.dot);
					}
					yield* g.callName(f, live(f.usr), "drop_item", []);
					rt.setFv(f, "loc", live(item_to_add), live(f.src));
					rt.setFv(f, "inventory_back", live(f.src), live(item_to_add));
					yield* g.srcCall(f, "update_corgi_fluff");
					yield* g.srcCall(f, "regenerate_icons");
				}
			}
			yield* g.srcCall(f, "show_inv", live(f.usr));
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/simple_animal/pet/dog/corgi/proc/place_on_head  (code/modules/mob/living/simple_animal/friendly/dog.dm:216)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/place_on_head", function* place_on_head(f: Frame, item_to_add: Value, user: Value) {
	let valid: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [item_to_add, user, valid, i, $e];
	if (truthy((rt.istype(live(item_to_add), T("/obj/item/weapon/grenade/plastic")) ? 1 : 0))) {
		yield* g.callName(f, live(item_to_add), "afterattack", [live(f.src), live(user), 1]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "inventory_head"))) {
		if (truthy(live(user))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't put more than one hat on ＀!</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	if (!truthy(live(item_to_add))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ pets ＀.", [live(user), live(f.src)]), fmt("<span class='notice'>You rest your hand on ＀'s head for a moment.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "drop_item", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it on ＀'s head!</span>", [live(item_to_add), live(f.src)])]);
		return 0;
	}
	valid = 0;
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "dog_fashion", live(item_to_add)), T("/datum/dog_fashion/head")])))) {
		valid = 1;
	}
	if (truthy(live(valid))) {
		if (rt.le(rt.sv(f, "health"), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class ='notice'>There is merely a dull, lifeless look in ＀'s eyes as you put the ＀ on ＀.</span>", [rt.sv(f, "real_name"), live(item_to_add), (yield* g.srcCall(f, "p_them"))])]);
		} else {
			if (truthy(live(user))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ puts ＀ on ＀'s head.  ＀ looks at ＀ and barks once.", [live(user), live(item_to_add), rt.sv(f, "real_name"), live(f.src), live(user)]), fmt("<span class='notice'>You put ＀ on ＀'s head.  ＀ gives you a peculiar look, then wags ＀ tail once and barks.</span>", [live(item_to_add), rt.sv(f, "real_name"), live(f.src), (yield* g.srcCall(f, "p_their"))]), "<span class='italics'>You hear a friendly-sounding bark.</span>"]);
			}
		}
		rt.setFv(f, "loc", live(item_to_add), live(f.src));
		rt.setFv(f, "inventory_head", live(f.src), live(item_to_add));
		yield* g.srcCall(f, "update_corgi_fluff");
		yield* g.srcCall(f, "regenerate_icons");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You set ＀ on ＀'s head, but it falls off!</span>", [live(item_to_add), live(f.src)])]);
		rt.setFv(f, "loc", live(item_to_add), rt.sv(f, "loc"));
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			yield* g.call(f, P("/proc/step_rand"), null, [live(item_to_add)]);
		}
		i = null;
		rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 8, 4, rt.sv(f, "dir")));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.srcCall(f, "setDir", live(i));
			yield* g.call(f, P("/proc/sleep"), null, [1]);
		}
		rt.endFor(f, 0);
	}
	return live(valid);
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/update_corgi_fluff  (code/modules/mob/living/simple_animal/friendly/dog.dm:262)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/update_corgi_fluff", function* update_corgi_fluff(f: Frame) {
	let DF: Value = null;
	f.vars = () => [DF];
	rt.setSv(f, "name", rt.sv(f, "real_name"));
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	rt.setSv(f, "speak", rt.list("YAP", "Woof!", "Bark!", "AUUUUUU"));
	rt.setSv(f, "speak_emote", rt.list("barks", "woofs"));
	rt.setSv(f, "emote_hear", rt.list("barks!", "woofs!", "yaps.", "pants."));
	rt.setSv(f, "emote_see", rt.list("shakes its head.", "chases its tail.", "shivers."));
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	yield* g.srcCall(f, "set_light", 0);
	if ((truthy(rt.sv(f, "inventory_head")) && truthy(rt.fv(f, "dog_fashion", rt.sv(f, "inventory_head"))))) {
		yield* g.callName(f, (DF = (yield* g.new_(f, rt.fv(f, "dog_fashion", rt.sv(f, "inventory_head")), [live(f.src)]))), "apply", [live(f.src)]);
	}
	if (!(truthy(rt.sv(f, "inventory_back")) && truthy(rt.fv(f, "dog_fashion", rt.sv(f, "inventory_back"))))) return f.dot;
	yield* g.callName(f, (DF = (yield* g.new_(f, rt.fv(f, "dog_fashion", rt.sv(f, "inventory_back")), [live(f.src)]))), "apply", [live(f.src)]);
	return f.dot;
}, true);

rt.type(5052, "/mob/living/simple_animal/pet/dog/corgi/Ian", "/mob/living/simple_animal/pet/dog/corgi", {
	turns_since_scan: 0,
	movement_target: null,
	age: 0,
	record_age: 1,
	memory_saved: 0,
	saved_head: null,
	name: "Ian",
	real_name: "Ian",
	gender: "male",
	desc: "It's the HoP's beloved corgi.",
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/dog.dm:298)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Initialize", function* Initialize(f: Frame) {
	let target: Value = null, _P: Value = null;
	f.vars = () => [target, _P];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "Read_Memory");
	if (isEqual(rt.sv(f, "age"), 0)) {
		if (truthy((target = rt.getStep(f, rt.sv(f, "loc"), 0)))) {
			rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/mob/living/simple_animal/pet/dog/corgi/puppy"), [live(target)]))), "Ian");
			rt.setFv(f, "real_name", live(_P), "Ian");
			rt.setFv(f, "gender", live(_P), "male");
			rt.setFv(f, "desc", live(_P), "It's the HoP's beloved corgi puppy.");
			yield* g.srcCall(f, "Write_Memory", 0);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (!isEqual(rt.sv(f, "age"), rt.sv(f, "record_age"))) return f.dot;
		rt.setSv(f, "icon_state", "old_corgi");
		rt.setSv(f, "icon_living", "old_corgi");
		rt.setSv(f, "icon_dead", "old_corgi_dead");
		rt.setSv(f, "desc", fmt("At a ripe old age of ＀ Ian's not as spry as he used to be, but he'll always be the HoP's beloved corgi.", [rt.sv(f, "record_age")]));
		rt.setSv(f, "turns_per_move", 20);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life  (code/modules/mob/living/simple_animal/friendly/dog.dm:320)
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life", function Life(f: Frame) {
	if ((isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 4) && !truthy(rt.sv(f, "memory_saved")))) {
		rt.callSrc(f, "Write_Memory", [0]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/pet/dog/corgi/Ian/proc/death  (code/modules/mob/living/simple_animal/friendly/dog.dm:325)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/death", function* death(f: Frame) {
	if (!truthy(rt.sv(f, "memory_saved"))) {
		yield* g.srcCall(f, "Write_Memory", 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Read_Memory  (code/modules/mob/living/simple_animal/friendly/dog.dm:330)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Read_Memory", function* Read_Memory(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setSv(f, "age", rt.input(f, rt.R.index, null, [(S = (yield* g.new_(f, T("/savefile"), ["data/npc_saves/Ian.sav"]))), "age"]));
	rt.setSv(f, "record_age", rt.input(f, rt.R.index, null, [live(S), "record_age"]));
	rt.setSv(f, "saved_head", rt.input(f, rt.R.index, null, [live(S), "saved_head"]));
	if (rt.sv(f, "age") === null) {
		rt.setSv(f, "age", 0);
	}
	if (rt.sv(f, "record_age") === null) {
		rt.setSv(f, "record_age", 1);
	}
	if (!truthy(rt.sv(f, "saved_head"))) return f.dot;
	yield* g.srcCall(f, "place_on_head", (yield* g.new_(f, rt.sv(f, "saved_head"), [])));
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Write_Memory  (code/modules/mob/living/simple_animal/friendly/dog.dm:344)
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Write_Memory", function Write_Memory(f: Frame, dead: Value) {
	let S: Value = null;
	f.vars = () => [S];
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/Ian.sav"]);
	if (!truthy(live(dead))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "age", add(rt.sv(f, "age"), 1)], false);
		if (rt.gt(add(rt.sv(f, "age"), 1), rt.sv(f, "record_age"))) {
			rt.op(f, "OutputReference", [rt.R.index], [live(S), "record_age", add(rt.sv(f, "record_age"), 1)], false);
		}
		if (truthy(rt.sv(f, "inventory_head"))) {
			rt.op(f, "OutputReference", [rt.R.index], [live(S), "saved_head", rt.fv(f, "type", rt.sv(f, "inventory_head"))], false);
		}
	} else {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "age", 0], false);
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "saved_head", null], false);
	}
	rt.setSv(f, "memory_saved", 1);
	return f.dot;
});

// /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life  (code/modules/mob/living/simple_animal/friendly/dog.dm:358)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life", function* Life(f: Frame) {
	let S: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [S, i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled")))) return f.dot;
	rt.incSrcVar(f, "turns_since_scan", 1, true);
	if (rt.gt(rt.sv(f, "turns_since_scan"), 5)) {
		rt.setSv(f, "turns_since_scan", 0);
		if ((truthy(rt.sv(f, "movement_target")) && !(truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "movement_target"))]))) || truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "movement_target")), T("/mob/living/carbon/human")) ? 1 : 0))))) {
			rt.setSv(f, "movement_target", null);
			rt.setSv(f, "stop_automated_movement", 0);
		}
		if ((!truthy(rt.sv(f, "movement_target")) || !truthy((rt.isIn(f, rt.fv(f, "loc", rt.sv(f, "movement_target")), (yield* g.call(f, P("/proc/oview"), null, [live(f.src), 3]))) ? 1 : 0)))) {
			rt.setSv(f, "movement_target", null);
			rt.setSv(f, "stop_automated_movement", 0);
			S = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(f.src), 3])), T("/obj/item/weapon/reagent_containers/food/snacks"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(S))]))) || truthy((rt.istype(rt.fv(f, "loc", live(S)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
					rt.setSv(f, "movement_target", live(S));
					break;
				}
			}
			rt.endFor(f, 0);
		}
		if (truthy(rt.sv(f, "movement_target"))) {
			rt.setSv(f, "stop_automated_movement", 1);
			yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.sv(f, "movement_target"), 1]);
			yield* g.call(f, P("/proc/sleep"), null, [3]);
			yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.sv(f, "movement_target"), 1]);
			yield* g.call(f, P("/proc/sleep"), null, [3]);
			yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.sv(f, "movement_target"), 1]);
			if (truthy(rt.sv(f, "movement_target"))) {
				if (rt.lt(rt.gv(f, "x", rt.fv(f, "loc", rt.sv(f, "movement_target"))), rt.fv(f, "x", live(f.src)))) {
					yield* g.srcCall(f, "setDir", 8);
				} else {
					if (rt.gt(rt.gv(f, "x", rt.fv(f, "loc", rt.sv(f, "movement_target"))), rt.fv(f, "x", live(f.src)))) {
						yield* g.srcCall(f, "setDir", 4);
					} else {
						if (rt.lt(rt.gv(f, "y", rt.fv(f, "loc", rt.sv(f, "movement_target"))), rt.fv(f, "y", live(f.src)))) {
							yield* g.srcCall(f, "setDir", 2);
						} else {
							if (rt.gt(rt.gv(f, "y", rt.fv(f, "loc", rt.sv(f, "movement_target"))), rt.fv(f, "y", live(f.src)))) {
								yield* g.srcCall(f, "setDir", 1);
							} else {
								yield* g.srcCall(f, "setDir", 2);
							}
						}
					}
				}
				if (!truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "movement_target"))))) {
					return live(f.dot);
				}
				if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "movement_target"))])))) {
					yield* g.callName(f, rt.sv(f, "movement_target"), "attack_animal", [live(f.src)]);
				} else {
					if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "movement_target")), T("/mob/living/carbon/human")) ? 1 : 0))) {
						if (truthy(rt.op(f, "Prob", [], [20]))) {
							yield* g.srcCall(f, "emote", "me", 1, fmt("stares at ＀'s ＀ with a sad puppy-face", [rt.fv(f, "loc", rt.sv(f, "movement_target")), rt.sv(f, "movement_target")]));
						}
					}
				}
			}
		}
	}
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [2], ["dances around.", "chases its tail!"]));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:406", S, i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:406", function* (f: Frame, S: Value, i: Value) {
	let $e: any;
	f.vars = () => [S, i, $e];
	i = null;
	rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "setDir", live(i));
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/pet/dog/corgi/proc/regenerate_icons  (code/modules/mob/living/simple_animal/friendly/dog.dm:414)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	let head_icon: Value = null, DF: Value = null, back_icon: Value = null, facehugger_overlay: Value = null;
	f.vars = () => [head_icon, DF, back_icon, facehugger_overlay];
	yield* g.srcCall(f, "cut_overlays");
	if (truthy(rt.sv(f, "inventory_head"))) {
		head_icon = null;
		if (!truthy(rt.gv(f, "obj_icon_state", (DF = (yield* g.new_(f, rt.fv(f, "dog_fashion", rt.sv(f, "inventory_head")), [live(f.src)])))))) {
			rt.setFv(f, "obj_icon_state", live(DF), rt.fv(f, "icon_state", rt.sv(f, "inventory_head")));
		}
		if (!truthy(rt.fv(f, "obj_alpha", live(DF)))) {
			rt.setFv(f, "obj_alpha", live(DF), rt.fv(f, "alpha", rt.sv(f, "inventory_head")));
		}
		if (!truthy(rt.fv(f, "obj_color", live(DF)))) {
			rt.setFv(f, "obj_color", live(DF), rt.fv(f, "color", rt.sv(f, "inventory_head")));
		}
		if (rt.le(rt.sv(f, "health"), 0)) {
			rt.setFv(f, "pixel_y", (head_icon = (yield* g.callName(f, live(DF), "get_overlay", ["dir", 4], rt.Args.Named))), -8);
			rt.setFv(f, "transform", live(head_icon), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "transform", live(head_icon)), 180])));
		} else {
			head_icon = (yield* g.callName(f, live(DF), "get_overlay", []));
		}
		yield* g.srcCall(f, "add_overlay", live(head_icon));
	}
	if (truthy(rt.sv(f, "inventory_back"))) {
		back_icon = null;
		if (!truthy(rt.gv(f, "obj_icon_state", (DF = (yield* g.new_(f, rt.fv(f, "dog_fashion", rt.sv(f, "inventory_back")), [live(f.src)])))))) {
			rt.setFv(f, "obj_icon_state", live(DF), rt.fv(f, "icon_state", rt.sv(f, "inventory_back")));
		}
		if (!truthy(rt.fv(f, "obj_alpha", live(DF)))) {
			rt.setFv(f, "obj_alpha", live(DF), rt.fv(f, "alpha", rt.sv(f, "inventory_back")));
		}
		if (!truthy(rt.fv(f, "obj_color", live(DF)))) {
			rt.setFv(f, "obj_color", live(DF), rt.fv(f, "color", rt.sv(f, "inventory_back")));
		}
		if (rt.le(rt.sv(f, "health"), 0)) {
			rt.setFv(f, "pixel_y", (back_icon = (yield* g.callName(f, live(DF), "get_overlay", ["dir", 4], rt.Args.Named))), -11);
			rt.setFv(f, "transform", live(back_icon), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "transform", live(back_icon)), 180])));
		} else {
			back_icon = (yield* g.callName(f, live(DF), "get_overlay", []));
		}
		yield* g.srcCall(f, "add_overlay", live(back_icon));
	}
	if (truthy(rt.sv(f, "facehugger"))) {
		facehugger_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/mask.dmi")]));
		if (truthy((rt.istype(live(f.src), T("/mob/living/simple_animal/pet/dog/corgi/puppy")) ? 1 : 0))) {
			rt.setFv(f, "icon_state", live(facehugger_overlay), "facehugger_corgipuppy");
		} else {
			rt.setFv(f, "icon_state", live(facehugger_overlay), "facehugger_corgi");
		}
		yield* g.srcCall(f, "add_overlay", live(facehugger_overlay));
	}
	if (truthy(rt.sv(f, "pcollar"))) {
		yield* g.srcCall(f, "add_overlay", rt.sv(f, "collar"));
		yield* g.srcCall(f, "add_overlay", rt.sv(f, "pettag"));
	}
	return live(f.dot);
}, true);

rt.type(5053, "/mob/living/simple_animal/pet/dog/corgi/puppy", "/mob/living/simple_animal/pet/dog/corgi", {
	pass_flags: 16,
	name: "１corgi puppy",
	real_name: "corgi",
	desc: "It's a corgi puppy!",
	icon_state: "puppy",
	icon_living: "puppy",
	icon_dead: "puppy_dead",
	density: 0,
	mob_size: 1,
});

// /mob/living/simple_animal/pet/dog/corgi/puppy/proc/Topic  (code/modules/mob/living/simple_animal/friendly/dog.dm:482)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/puppy/proc/Topic", function* Topic(f: Frame) {
	if ((truthy(rt.at(live(f.args[1]), "remove_inv")) || truthy(rt.at(live(f.args[1]), "add_inv")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You can't fit this on ＀!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(5055, "/mob/living/simple_animal/pet/dog/corgi/Lisa", "/mob/living/simple_animal/pet/dog/corgi", {
	turns_since_scan: 0,
	puppies: 0,
	name: "Lisa",
	real_name: "Lisa",
	gender: "female",
	desc: "It's a corgi with a cute pink bow.",
	icon_state: "lisa",
	icon_living: "lisa",
	icon_dead: "lisa_dead",
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Topic  (code/modules/mob/living/simple_animal/friendly/dog.dm:522)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Topic", function* Topic(f: Frame) {
	if ((truthy(rt.at(live(f.args[1]), "remove_inv")) || truthy(rt.at(live(f.args[1]), "add_inv")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>＀ already has a cute bow!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life  (code/modules/mob/living/simple_animal/friendly/dog.dm:528)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life", function* Life(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "make_babies");
	if (!((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled")))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [2], ["dances around.", "chases her tail."]));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:535", i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:535", function* (f: Frame, i: Value) {
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "setDir", live(i));
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/pet/dog/pug/proc/Life  (code/modules/mob/living/simple_animal/friendly/dog.dm:541)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/pug/proc/Life", function* Life(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled")))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [1], ["chases its tail."]));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/dog/pug/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:546", i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/pet/dog/pug/proc/Life, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/dog/pug/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:546", function* (f: Frame, i: Value) {
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "setDir", live(i));
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/pet/dog/proc/attack_hand  (code/modules/mob/living/simple_animal/friendly/dog.dm:552)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/proc/attack_hand", function* attack_hand(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "help") {
		yield* g.srcCall(f, "wuv", 1, live(f.args[0]));
	} else if ($0 === "harm") {
		yield* g.srcCall(f, "wuv", -1, live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/pet/dog/proc/wuv  (code/modules/mob/living/simple_animal/friendly/dog.dm:561)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/proc/wuv", function* wuv(f: Frame, change: Value, M: Value) {
	f.vars = () => [change, M];
	if (!truthy(live(change))) return f.dot;
	if (rt.gt(live(change), 0)) {
		if ((truthy(live(M)) && !isEqual(rt.sv(f, "stat"), 2))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/heart"), [rt.sv(f, "loc")]);
			yield* g.srcCall(f, "emote", "me", 1, "yaps happily!");
		}
	} else {
		if (!(truthy(live(M)) && !isEqual(rt.sv(f, "stat"), 2))) return f.dot;
		yield* g.srcCall(f, "emote", "me", 1, "growls!");
	}
	return f.dot;
}, true);
