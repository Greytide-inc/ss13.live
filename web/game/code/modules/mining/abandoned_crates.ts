// Based on /tg/station's code/modules/mining/abandoned_crates.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


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

// abandoned_crates.dm:15
rt.def("/obj/structure/closet/crate/secure/loot/proc/New", function* New(f: Frame) {
	let dig: Value = null, loot: Value = null, i_2: Value = null, newitem: Value = null, newcoin: Value = null, newitem_3: Value = null;
	let $e: any;
	yield* parent_proc();
	let digits: Value = list("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
	this.code = "";
	let i: Value = 0;
	while (i < this.codelen) {
		this.code += (dig = pick(digits));
		digits -= dig;
		i++;
	}
	const subject = (loot = rand(1, 100));
	if (rt.inRange(subject, 1, 5)) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), this);
		yield* new_(T("/obj/item/weapon/lighter"), this);
	} else if (rt.inRange(subject, 6, 10)) {
		yield* new_(T("/obj/item/weapon/bedsheet"), this);
		yield* new_(T("/obj/item/weapon/kitchen/knife"), this);
		yield* new_(T("/obj/item/weapon/wirecutters"), this);
		yield* new_(T("/obj/item/weapon/screwdriver"), this);
		yield* new_(T("/obj/item/weapon/weldingtool"), this);
		yield* new_(T("/obj/item/weapon/hatchet"), this);
		yield* new_(T("/obj/item/weapon/crowbar"), this);
	} else if (rt.inRange(subject, 11, 15)) {
		yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this);
	} else if (rt.inRange(subject, 16, 20)) {
		rt.forRange(f, 0, 1, 10, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* new_(T("/obj/item/weapon/ore/diamond"), this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 21, 25)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* new_(T("/obj/item/weapon/poster/random_contraband"), this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 26, 30)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 3, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/noreact"), this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 31, 35)) {
		yield* new_(T("/obj/item/seeds/firelemon"), this);
	} else if (rt.inRange(subject, 36, 40)) {
		yield* new_(T("/obj/item/weapon/melee/baton"), this);
	} else if (rt.inRange(subject, 41, 45)) {
		yield* new_(T("/obj/item/clothing/under/shorts/red"), this);
		yield* new_(T("/obj/item/clothing/under/shorts/blue"), this);
	} else if (rt.inRange(subject, 46, 50)) {
		yield* new_(T("/obj/item/clothing/under/chameleon"), this);
		i_2 = null;
		rt.forRange(f, 0, 1, 7, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* new_(T("/obj/item/clothing/neck/tie/horrible"), this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 51, 52)) {
		yield* new_(T("/obj/item/weapon/melee/classic_baton"), this);
	} else if (rt.inRange(subject, 53, 54)) {
		yield* new_(T("/obj/item/toy/balloon"), this);
	} else if (rt.inRange(subject, 55, 56)) {
		newitem = pick(typesof(T("/obj/item/toy/prize")) - T("/obj/item/toy/prize"));
		yield* new_(newitem, this);
	} else if (rt.inRange(subject, 57, 58)) {
		yield* new_(T("/obj/item/toy/syndicateballoon"), this);
	} else if (rt.inRange(subject, 59, 60)) {
		yield* new_(T("/obj/item/borg/upgrade/modkit/aoe/mobs"), this);
		yield* new_(T("/obj/item/clothing/suit/space"), this);
		yield* new_(T("/obj/item/clothing/head/helmet/space"), this);
	} else if (rt.inRange(subject, 61, 62)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* new_(T("/obj/item/clothing/head/kitty"), this);
			yield* new_(T("/obj/item/clothing/neck/petcollar"), this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 63, 64)) {
		i_2 = null;
		rt.forRange(f, 0, 1, rand(4, 7), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			newcoin = pick(T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/silver"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/iron"), T("/obj/item/weapon/coin/gold"), T("/obj/item/weapon/coin/diamond"), T("/obj/item/weapon/coin/plasma"), T("/obj/item/weapon/coin/uranium"));
			yield* new_(newcoin, this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 65, 66)) {
		yield* new_(T("/obj/item/clothing/suit/ianshirt"), this);
		yield* new_(T("/obj/item/clothing/suit/hooded/ian_costume"), this);
	} else if (rt.inRange(subject, 67, 68)) {
		i_2 = null;
		rt.forRange(f, 0, 1, rand(4, 7), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			newitem_3 = pick(typesof(T("/obj/item/weapon/stock_parts")) - T("/obj/item/weapon/stock_parts") - T("/obj/item/weapon/stock_parts/subspace"));
			yield* new_(newitem_3, this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 69, 70)) {
		i_2 = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			yield* new_(T("/obj/item/weapon/ore/bluespace_crystal"), this);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange(subject, 71, 72)) {
		yield* new_(T("/obj/item/weapon/pickaxe/drill"), this);
	} else if (rt.inRange(subject, 73, 74)) {
		yield* new_(T("/obj/item/weapon/pickaxe/drill/jackhammer"), this);
	} else if (rt.inRange(subject, 75, 76)) {
		yield* new_(T("/obj/item/weapon/pickaxe/diamond"), this);
	} else if (rt.inRange(subject, 77, 78)) {
		yield* new_(T("/obj/item/weapon/pickaxe/drill/diamonddrill"), this);
	} else if (rt.inRange(subject, 79, 80)) {
		yield* new_(T("/obj/item/weapon/cane"), this);
		yield* new_(T("/obj/item/clothing/head/collectable/tophat"), this);
	} else if (rt.inRange(subject, 81, 82)) {
		yield* new_(T("/obj/item/weapon/gun/energy/plasmacutter"), this);
	} else if (rt.inRange(subject, 83, 84)) {
		yield* new_(T("/obj/item/toy/katana"), this);
	} else if (rt.inRange(subject, 85, 86)) {
		yield* new_(T("/obj/item/weapon/defibrillator/compact"), this);
	} else if (subject === 87) {
		yield* new_(T("/obj/item/weed_extract"), this);
	} else if (subject === 88) {
		yield* new_(T("/obj/item/organ/brain"), this);
	} else if (subject === 89) {
		yield* new_(T("/obj/item/organ/brain/alien"), this);
	} else if (subject === 90) {
		yield* new_(T("/obj/item/organ/heart"), this);
	} else if (subject === 91) {
		yield* new_(T("/obj/item/device/soulstone/anybody"), this);
	} else if (subject === 92) {
		yield* new_(T("/obj/item/weapon/katana"), this);
	} else if (subject === 93) {
		yield* new_(T("/obj/item/weapon/dnainjector/xraymut"), this);
	} else if (subject === 94) {
		yield* new_(T("/obj/item/weapon/storage/backpack/clown"), this);
		yield* new_(T("/obj/item/clothing/under/rank/clown"), this);
		yield* new_(T("/obj/item/clothing/shoes/clown_shoes"), this);
		yield* new_(T("/obj/item/device/pda/clown"), this);
		yield* new_(T("/obj/item/clothing/mask/gas/clown_hat"), this);
		yield* new_(T("/obj/item/weapon/bikehorn"), this);
		yield* new_(T("/obj/item/toy/crayon/rainbow"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/spray/waterflower"), this);
	} else if (subject === 95) {
		yield* new_(T("/obj/item/clothing/under/rank/mime"), this);
		yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), this);
		yield* new_(T("/obj/item/device/pda/mime"), this);
		yield* new_(T("/obj/item/clothing/gloves/color/white"), this);
		yield* new_(T("/obj/item/clothing/mask/gas/mime"), this);
		yield* new_(T("/obj/item/clothing/head/beret"), this);
		yield* new_(T("/obj/item/clothing/suit/suspenders"), this);
		yield* new_(T("/obj/item/toy/crayon/mime"), this);
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing"), this);
	} else if (subject === 96) {
		yield* new_(T("/obj/item/weapon/hand_tele"), this);
	} else if (subject === 97) {
		yield* new_(T("/obj/item/clothing/mask/balaclava"));
		yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/pistol"), this);
		yield* new_(T("/obj/item/ammo_box/magazine/m10mm"), this);
	} else if (subject === 98) {
		yield* new_(T("/obj/item/weapon/katana/cursed"), this);
	} else if (subject === 99) {
		yield* new_(T("/obj/item/weapon/storage/belt/champion"), this);
		yield* new_(T("/obj/item/clothing/mask/luchador"), this);
	} else if (subject === 100) {
		yield* new_(T("/obj/item/clothing/head/bearpelt"), this);
	}
	return f.dot;
}, true);

// abandoned_crates.dm:157
rt.def("/obj/structure/closet/crate/secure/loot/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let input: Value = null, sanitised: Value = null, sanitycheck: Value = null, i: Value = null, j: Value = null;
	if (this.locked) {
		to_chat(user, "<span class='notice'>The crate is locked with a Deca-code lock.</span>");
		input = (yield* g.op(f, "Prompt", [2], ["", "Deca-Code Lock", `Enter ${this.codelen} digits. All digits must be unique.`, f.usr, null]));
		if (user.canUseTopic(this, 1)) {
			sanitised = list();
			sanitycheck = 1;
			i = 1;
			while (i <= rt.length(input)) {
				sanitised += text2num(copytext(input, i, i + 1));
				i++;
			}
			i = 1;
			while (i <= rt.length(input) - 1) {
				j = i + 1;
				while (j <= rt.length(input)) {
					if (rt.index(sanitised, i) == rt.index(sanitised, j)) {
						sanitycheck = null;
					}
					j++;
				}
				i++;
			}
			if (input == this.code) {
				to_chat(user, "<span class='notice'>The crate unlocks!</span>");
				this.locked = 0;
				this.cut_overlays();
				this.add_overlay("securecrateg");
			} else if (input === null || sanitycheck === null || rt.length(input) != this.codelen) {
				to_chat(user, "<span class='notice'>You leave the crate alone.</span>");
			} else {
				to_chat(user, "<span class='warning'>A red light flashes.</span>");
				this.lastattempt = input;
				this.attempts--;
				if (this.attempts == 0) {
					yield* this.boom(user);
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// abandoned_crates.dm:185
rt.def("/obj/structure/closet/crate/secure/loot/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!user.canUseTopic(this)) {
		return f.dot;
	}
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// abandoned_crates.dm:191
rt.def("/obj/structure/closet/crate/secure/loot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	let guess: Value = null, answer: Value = null, bulls: Value = null, cows: Value = null, i: Value = null;
	if (this.locked) {
		if (rt.istype(W, T("/obj/item/weapon/card/emag"))) {
			yield* this.boom(user);
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/device/multitool"))) {
			to_chat(user, "<span class='notice'>DECA-CODE LOCK REPORT:</span>");
			if (this.attempts == 1) {
				to_chat(user, "<span class='warning'>* Anti-Tamper Bomb will activate on next failed access attempt.</span>");
			} else {
				to_chat(user, `<span class='notice'>* Anti-Tamper Bomb will activate after ${this.attempts} failed access attempts.</span>`);
			}
			if (this.lastattempt !== null) {
				guess = list();
				answer = list();
				bulls = 0;
				cows = 0;
				i = 1;
				while (i <= rt.length(this.lastattempt)) {
					guess += text2num(copytext(this.lastattempt, i, i + 1));
					i++;
				}
				i = 1;
				while (i <= rt.length(this.lastattempt)) {
					answer += text2num(copytext(this.code, i, i + 1));
					i++;
				}
				i = 1;
				while (i < this.codelen + 1) {
					if (answer.Find(rt.index(guess, i), 1, this.codelen + 1)) {
						cows++;
					}
					if (rt.index(answer, i) == rt.index(guess, i)) {
						bulls++;
						cows--;
					}
					i++;
				}
				to_chat(user, `<span class='notice'>Last code attempt, ${this.lastattempt}, had ${bulls} correct digits at correct positions and ${cows} correct digits at incorrect positions.</span>`);
			}
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// abandoned_crates.dm:222
rt.def("/obj/structure/closet/crate/secure/loot/proc/togglelock", function* togglelock(f: Frame, user: Value) {
	if (this.locked) {
		yield* this.boom(user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// abandoned_crates.dm:227
rt.def("/obj/structure/closet/crate/secure/loot/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* this.boom();
	return f.dot;
}, true);
