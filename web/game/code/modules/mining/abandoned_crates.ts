// From code/modules/mining/abandoned_crates.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12276, "/obj/structure/closet/crate/secure/loot", "/obj/structure/closet/crate/secure", {
	code: null,
	lastattempt: null,
	attempts: 10,
	codelen: 4,
	tamperproof: 90,
	name: "abandoned crate",
	desc: "What could be inside?",
	icon_state: "securecrate",
	integrity_failure: 0,
});

// /obj/structure/closet/crate/secure/loot/proc/New  (code/modules/mining/abandoned_crates.dm:15)  may sleep
rt.def("/obj/structure/closet/crate/secure/loot/proc/New", function* New(f: Frame) {
	let digits: Value = null, i: Value = null, dig: Value = null, loot: Value = null, i_2: Value = null, newitem: Value = null, newcoin: Value = null, newitem_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [digits, i, dig, loot, i_2, newitem, newcoin, newitem_3, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	digits = rt.list("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
	rt.setSv(f, "code", "");
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.sv(f, "codelen"))) {
		rt.modSrcVar(f, "code", (dig = rt.op(f, "PickUnweighted", [1], [live(digits)])), add);
		(digits = rt.modify(live(digits), live(dig), subtract));
		i = rt.inc(live(i), 1);
	}
	$0 = (loot = (yield* g.call(f, P("/proc/rand"), null, [1, 100])));
	if (rt.inRange($0, 1, 5)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/lighter"), [live(f.src)]);
	} else if (rt.inRange($0, 6, 10)) {
		yield* g.new_(f, T("/obj/item/weapon/bedsheet"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/kitchen/knife"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/hatchet"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	} else if (rt.inRange($0, 11, 15)) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]);
	} else if (rt.inRange($0, 16, 20)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 10, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* g.new_(f, T("/obj/item/weapon/ore/diamond"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 21, 25)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* g.new_(f, T("/obj/item/weapon/poster/random_contraband"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 26, 30)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 3, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/noreact"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 31, 35)) {
		yield* g.new_(f, T("/obj/item/seeds/firelemon"), [live(f.src)]);
	} else if (rt.inRange($0, 36, 40)) {
		yield* g.new_(f, T("/obj/item/weapon/melee/baton"), [live(f.src)]);
	} else if (rt.inRange($0, 41, 45)) {
		yield* g.new_(f, T("/obj/item/clothing/under/shorts/red"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/under/shorts/blue"), [live(f.src)]);
	} else if (rt.inRange($0, 46, 50)) {
		yield* g.new_(f, T("/obj/item/clothing/under/chameleon"), [live(f.src)]);
		i_2 = null;
		rt.forRange(f, 0, 1, 7, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* g.new_(f, T("/obj/item/clothing/neck/tie/horrible"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 51, 52)) {
		yield* g.new_(f, T("/obj/item/weapon/melee/classic_baton"), [live(f.src)]);
	} else if (rt.inRange($0, 53, 54)) {
		yield* g.new_(f, T("/obj/item/toy/balloon"), [live(f.src)]);
	} else if (rt.inRange($0, 55, 56)) {
		newitem = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/toy/prize")])), T("/obj/item/toy/prize"))]);
		yield* g.new_(f, live(newitem), [live(f.src)]);
	} else if (rt.inRange($0, 57, 58)) {
		yield* g.new_(f, T("/obj/item/toy/syndicateballoon"), [live(f.src)]);
	} else if (rt.inRange($0, 59, 60)) {
		yield* g.new_(f, T("/obj/item/borg/upgrade/modkit/aoe/mobs"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/space"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/head/helmet/space"), [live(f.src)]);
	} else if (rt.inRange($0, 61, 62)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* g.new_(f, T("/obj/item/clothing/head/kitty"), [live(f.src)]);
			yield* g.new_(f, T("/obj/item/clothing/neck/petcollar"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 63, 64)) {
		i_2 = null;
		rt.forRange(f, 0, 1, (yield* g.call(f, P("/proc/rand"), null, [4, 7])), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			newcoin = rt.op(f, "PickUnweighted", [10], [T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/gold"), T("/obj/item/weapon/coin/diamond"), T("/obj/item/weapon/coin/plasma"), T("/obj/item/weapon/coin/uranium")]);
			yield* g.new_(f, live(newcoin), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 65, 66)) {
		yield* g.new_(f, T("/obj/item/clothing/suit/ianshirt"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/hooded/ian_costume"), [live(f.src)]);
	} else if (rt.inRange($0, 67, 68)) {
		i_2 = null;
		rt.forRange(f, 0, 1, (yield* g.call(f, P("/proc/rand"), null, [4, 7])), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			newitem_3 = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/stock_parts")])), T("/obj/item/weapon/stock_parts")), T("/obj/item/weapon/stock_parts/subspace"))]);
			yield* g.new_(f, live(newitem_3), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 69, 70)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* g.new_(f, T("/obj/item/weapon/ore/bluespace_crystal"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 71, 72)) {
		yield* g.new_(f, T("/obj/item/weapon/pickaxe/drill"), [live(f.src)]);
	} else if (rt.inRange($0, 73, 74)) {
		yield* g.new_(f, T("/obj/item/weapon/pickaxe/drill/jackhammer"), [live(f.src)]);
	} else if (rt.inRange($0, 75, 76)) {
		yield* g.new_(f, T("/obj/item/weapon/pickaxe/diamond"), [live(f.src)]);
	} else if (rt.inRange($0, 77, 78)) {
		yield* g.new_(f, T("/obj/item/weapon/pickaxe/drill/diamonddrill"), [live(f.src)]);
	} else if (rt.inRange($0, 79, 80)) {
		yield* g.new_(f, T("/obj/item/weapon/cane"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/head/collectable/tophat"), [live(f.src)]);
	} else if (rt.inRange($0, 81, 82)) {
		yield* g.new_(f, T("/obj/item/weapon/gun/energy/plasmacutter"), [live(f.src)]);
	} else if (rt.inRange($0, 83, 84)) {
		yield* g.new_(f, T("/obj/item/toy/katana"), [live(f.src)]);
	} else if (rt.inRange($0, 85, 86)) {
		yield* g.new_(f, T("/obj/item/weapon/defibrillator/compact"), [live(f.src)]);
	} else if ($0 === 87) {
		yield* g.new_(f, T("/obj/item/weed_extract"), [live(f.src)]);
	} else if ($0 === 88) {
		yield* g.new_(f, T("/obj/item/organ/brain"), [live(f.src)]);
	} else if ($0 === 89) {
		yield* g.new_(f, T("/obj/item/organ/brain/alien"), [live(f.src)]);
	} else if ($0 === 90) {
		yield* g.new_(f, T("/obj/item/organ/heart"), [live(f.src)]);
	} else if ($0 === 91) {
		yield* g.new_(f, T("/obj/item/device/soulstone/anybody"), [live(f.src)]);
	} else if ($0 === 92) {
		yield* g.new_(f, T("/obj/item/weapon/katana"), [live(f.src)]);
	} else if ($0 === 93) {
		yield* g.new_(f, T("/obj/item/weapon/dnainjector/xraymut"), [live(f.src)]);
	} else if ($0 === 94) {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/clown"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/under/rank/clown"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/clown_shoes"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/pda/clown"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/gas/clown_hat"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/bikehorn"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/toy/crayon/rainbow"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/waterflower"), [live(f.src)]);
	} else if ($0 === 95) {
		yield* g.new_(f, T("/obj/item/clothing/under/rank/mime"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/device/pda/mime"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/gloves/color/white"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/gas/mime"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/head/beret"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/suspenders"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/toy/crayon/mime"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing"), [live(f.src)]);
	} else if ($0 === 96) {
		yield* g.new_(f, T("/obj/item/weapon/hand_tele"), [live(f.src)]);
	} else if ($0 === 97) {
		yield* g.new_(f, T("/obj/item/clothing/mask/balaclava"), []);
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/pistol"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/ammo_box/magazine/m10mm"), [live(f.src)]);
	} else if ($0 === 98) {
		yield* g.new_(f, T("/obj/item/weapon/katana/cursed"), [live(f.src)]);
	} else if ($0 === 99) {
		yield* g.new_(f, T("/obj/item/weapon/storage/belt/champion"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/mask/luchador"), [live(f.src)]);
	} else if ($0 === 100) {
		yield* g.new_(f, T("/obj/item/clothing/head/bearpelt"), [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/structure/closet/crate/secure/loot/proc/attack_hand  (code/modules/mining/abandoned_crates.dm:157)  may sleep
rt.def("/obj/structure/closet/crate/secure/loot/proc/attack_hand", function* attack_hand(f: Frame) {
	let input: Value = null, sanitised: Value = null, sanitycheck: Value = null, i: Value = null, j: Value = null;
	f.vars = () => [input, sanitised, sanitycheck, i, j];
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The crate is locked with a Deca-code lock.</span>"]);
		input = (yield* g.op(f, "Prompt", [2], ["", "Deca-Code Lock", fmt("Enter ＀ digits. All digits must be unique.", [rt.sv(f, "codelen")]), live(f.usr), null]));
		if (truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [live(f.src), 1])))) {
			sanitised = rt.list();
			sanitycheck = 1;
			i = null;
			i = 1;
			while (rt.le(live(i), rt.length(live(input)))) {
				sanitised = rt.modify(live(sanitised), (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(input), live(i), add(live(i), 1)]))])), add);
				i = rt.inc(live(i), 1);
			}
			i = null;
			i = 1;
			while (rt.le(live(i), subtract(rt.length(live(input)), 1))) {
				j = null;
				j = add(live(i), 1);
				while (rt.le(live(j), rt.length(live(input)))) {
					if (isEqual(rt.index(live(sanitised), live(i)), rt.index(live(sanitised), live(j)))) {
						sanitycheck = null;
					}
					j = rt.inc(live(j), 1);
				}
				i = rt.inc(live(i), 1);
			}
			if (isEqual(live(input), rt.sv(f, "code"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The crate unlocks!</span>"]);
				rt.setSv(f, "locked", 0);
				yield* g.srcCall(f, "cut_overlays");
				yield* g.srcCall(f, "add_overlay", "securecrateg");
			} else {
				if (((live(input) === null || live(sanitycheck) === null) || !isEqual(rt.length(live(input)), rt.sv(f, "codelen")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You leave the crate alone.</span>"]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>A red light flashes.</span>"]);
					rt.setSv(f, "lastattempt", live(input));
					rt.incSrcVar(f, "attempts", -1, true);
					if (isEqual(rt.sv(f, "attempts"), 0)) {
						yield* g.srcCall(f, "boom", live(f.args[0]));
					}
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/closet/crate/secure/loot/proc/AltClick  (code/modules/mining/abandoned_crates.dm:185)  may sleep
rt.def("/obj/structure/closet/crate/secure/loot/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/closet/crate/secure/loot/proc/attackby  (code/modules/mining/abandoned_crates.dm:191)  may sleep
rt.def("/obj/structure/closet/crate/secure/loot/proc/attackby", function* attackby(f: Frame) {
	let guess: Value = null, answer: Value = null, bulls: Value = null, cows: Value = null, i: Value = null;
	f.vars = () => [guess, answer, bulls, cows, i];
	if (truthy(rt.sv(f, "locked"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/emag")) ? 1 : 0))) {
			yield* g.srcCall(f, "boom", live(f.args[1]));
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>DECA-CODE LOCK REPORT:</span>"]);
				if (isEqual(rt.sv(f, "attempts"), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>* Anti-Tamper Bomb will activate on next failed access attempt.</span>"]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>* Anti-Tamper Bomb will activate after ＀ failed access attempts.</span>", [rt.fv(f, "attempts", live(f.src))])]);
				}
				if (rt.sv(f, "lastattempt") !== null) {
					guess = rt.list();
					answer = rt.list();
					bulls = 0;
					cows = 0;
					i = null;
					i = 1;
					while (rt.le(live(i), rt.length(rt.sv(f, "lastattempt")))) {
						guess = rt.modify(live(guess), (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "lastattempt"), live(i), add(live(i), 1)]))])), add);
						i = rt.inc(live(i), 1);
					}
					i = null;
					i = 1;
					while (rt.le(live(i), rt.length(rt.sv(f, "lastattempt")))) {
						answer = rt.modify(live(answer), (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "code"), live(i), add(live(i), 1)]))])), add);
						i = rt.inc(live(i), 1);
					}
					i = null;
					i = 1;
					while (rt.lt(live(i), add(rt.sv(f, "codelen"), 1))) {
						if (truthy((yield* g.callName(f, live(answer), "Find", [rt.index(live(guess), live(i)), 1, add(rt.sv(f, "codelen"), 1)])))) {
							cows = rt.inc(live(cows), 1);
						}
						if (isEqual(rt.index(live(answer), live(i)), rt.index(live(guess), live(i)))) {
							bulls = rt.inc(live(bulls), 1);
							cows = rt.inc(live(cows), -1);
						}
						i = rt.inc(live(i), 1);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Last code attempt, ＀, had ＀ correct digits at correct positions and ＀ correct digits at incorrect positions.</span>", [rt.sv(f, "lastattempt"), live(bulls), live(cows)])]);
				}
				return live(f.dot);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user"] });

// /obj/structure/closet/crate/secure/loot/proc/togglelock  (code/modules/mining/abandoned_crates.dm:222)  may sleep
rt.def("/obj/structure/closet/crate/secure/loot/proc/togglelock", function* togglelock(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "boom", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/closet/crate/secure/loot/proc/deconstruct  (code/modules/mining/abandoned_crates.dm:227)  may sleep
rt.def("/obj/structure/closet/crate/secure/loot/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.srcCall(f, "boom");
	return f.dot;
}, true);
