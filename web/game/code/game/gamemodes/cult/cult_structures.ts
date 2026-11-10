// Based on /tg/station's code/game/gamemodes/cult/cult_structures.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12167, "/obj/structure/destructible/cult", "/obj/structure/destructible", {
	cooldowntime: 0,
	anchored: 1,
	density: 1,
	icon: rt.rsc("icons/obj/cult.dmi"),
	break_sound: rt.rsc("sound/hallucinations/veryfar_noise.ogg"),
	debris: null,
});

// cult_structures.dm:7
rt.def("/obj/structure/destructible/cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/stack/sheet/runed_metal"), 1]);
	return f.dot;
});

// cult_structures.dm:10
rt.def("/obj/structure/destructible/cult/proc/examine", function examine(f: Frame, user: Value) {
	let $2: any;
	parent_proc();
	let $0: any = user;
	let $1: any = this;
	if (this.anchored) {

		$2 = "";
	} else {
		$2 = "not ";
	}
	to_chat($0, fmt("<span class='notice'>＄！ is ＀secured to the floor.</span>", [$1, $2]));
	if (!((iscultist(user) || rt.istype(user, T("/mob/dead/observer"))) && this.cooldowntime > rt.worldTime(f))) return f.dot;
	to_chat(user, `<span class='cultitalic'>The magic in ${this} is too weak, ${this.p_they()} will be ready to use again in ${this.getETA()}.</span>`);
	return f.dot;
}, false);

// cult_structures.dm:16
rt.def("/obj/structure/destructible/cult/proc/examine_status", function examine_status(f: Frame, user: Value) {
	let t_It: Value = null, t_is: Value = null;
	if (iscultist(user) || rt.istype(user, T("/mob/dead/observer"))) {
		t_It = this.p_they(1);
		t_is = this.p_are();
		return `<span class='cult'>${t_It} ${t_is} at <b>${round(this.obj_integrity * 100 / this.max_integrity)}%</b> stability.</span>`;
	}
	return parent_proc();
}, false);

// cult_structures.dm:23
rt.def("/obj/structure/destructible/cult/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (rt.istype(M, T("/mob/living/simple_animal/hostile/construct/builder"))) {
		if (this.obj_integrity < this.max_integrity) {
			M.changeNext_move(8);
			this.obj_integrity = min(this.max_integrity, this.obj_integrity + 5);
			yield* this.Beam(M, { icon_state: "sendbeam", time: 4 });
			M.visible_message(fmt("<span class='danger'>＀ repairs ％<b>！</b>.</span>", [M, this]), `<span class='cult'>You repair <b>${this}</b>, leaving ${this.p_they()} at <b>${round(this.obj_integrity * 100 / this.max_integrity)}%</b> stability.</span>`);
		} else {
			to_chat(M, `<span class='cult'>You cannot repair ${this}, as ${this.p_they()} ${this.p_are()} undamaged!</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// cult_structures.dm:36
rt.def("/obj/structure/destructible/cult/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let $0: any, $1: any;
	if (rt.istype(I, T("/obj/item/weapon/tome")) && iscultist(user)) {
		this.anchored = (!this.anchored ? 1 : 0);
		$0 = user;
		if (this.anchored) {
			$1 = "";
		} else {
			$1 = "un";
		}
		to_chat($0, fmt("<span class='notice'>You ＀secure ％！ ＀ the floor.</span>", [$1, this, this.anchored ? "to" : "from"]));
		if (!this.anchored) {
			this.icon_state = `${rt.initial(f, this, "icon_state")}_off`;
		} else {
			this.icon_state = rt.initial(f, this, "icon_state");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cult_structures.dm:47
rt.def("/obj/structure/destructible/cult/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!((yield* this.take_damage(rand(25, 50), "fire")) && this)) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#FAE48C";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

// cult_structures.dm:54
rt.def("/obj/structure/destructible/cult/proc/getETA", function getETA(f: Frame) {
	let time: Value = (this.cooldowntime - rt.worldTime(f)) / 600;
	let eta: Value = `${round(time, 1)} minutes`;
	if (time <= 1) {
		eta = `${round((time = (this.cooldowntime - rt.worldTime(f)) * 0.1), 1)} seconds`;
	}
	return eta;
});

rt.type(12168, "/obj/structure/destructible/cult/talisman", "/obj/structure/destructible/cult", {
	name: "altar",
	desc: "A bloodstained altar dedicated to Nar-Sie.",
	icon_state: "talismanaltar",
	break_message: "<span class='warning'>The altar shatters, leaving only the wailing of the damned!</span>",
});

// cult_structures.dm:68
rt.def("/obj/structure/destructible/cult/talisman/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let pickedtype: Value = null;
	if (!iscultist(user)) {
		to_chat(user, "<span class='warning'>You're pretty sure you know exactly what this is used for and you can't seem to touch it.</span>");
		return f.dot;
	}
	if (!this.anchored) {
		to_chat(user, `<span class='cultitalic'>You need to anchor ${this} to the floor with a tome first.</span>`);
		return f.dot;
	}
	if (this.cooldowntime > rt.worldTime(f)) {
		to_chat(user, `<span class='cultitalic'>The magic in ${this} is weak, it will be ready to use again in ${this.getETA()}.</span>`);
		return f.dot;
	}
	let choice: Value = (yield* alert(user, "You study the schematics etched into the forge...", null, "Eldritch Whetstone", "Zealot's Blindfold", "Flask of Unholy Water"));
	if (choice === "Eldritch Whetstone") {
		pickedtype = T("/obj/item/weapon/sharpener/cult");
	} else if (choice === "Zealot's Blindfold") {
		pickedtype = T("/obj/item/clothing/glasses/night/cultblind");
	} else if (choice === "Flask of Unholy Water") {
		pickedtype = T("/obj/item/weapon/reagent_containers/food/drinks/bottle/unholywater");
	}
	if (!(this && !(!this || this.gc_destroyed) && this.anchored && pickedtype && this.Adjacent(user) && !user.incapacitated() && iscultist(user) && this.cooldowntime <= rt.worldTime(f))) return f.dot;
	this.cooldowntime = rt.worldTime(f) + 2400;
	let N: Value = (yield* new_(pickedtype, rt.getStep(f, this, 0)));
	to_chat(user, `<span class='cultitalic'>You kneel before the altar and your faith is rewarded with an ${N}!</span>`);
	return f.dot;
}, true);

rt.type(12169, "/obj/structure/destructible/cult/forge", "/obj/structure/destructible/cult", {
	light_range: 3,
	light_color: "#C48A18",
	name: "daemon forge",
	desc: "A forge used in crafting the unholy weapons used by the armies of Nar-Sie.",
	icon_state: "forge",
	break_message: "<span class='warning'>The force breaks apart into shards with a howling scream!</span>",
});

// cult_structures.dm:101
rt.def("/obj/structure/destructible/cult/forge/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let pickedtype: Value = null;
	if (!iscultist(user)) {
		to_chat(user, `<span class='warning'>The heat radiating from ${this} pushes you back.</span>`);
		return f.dot;
	}
	if (!this.anchored) {
		to_chat(user, `<span class='cultitalic'>You need to anchor ${this} to the floor with a tome first.</span>`);
		return f.dot;
	}
	if (this.cooldowntime > rt.worldTime(f)) {
		to_chat(user, `<span class='cultitalic'>The magic in ${this} is weak, it will be ready to use again in ${this.getETA()}.</span>`);
		return f.dot;
	}
	let choice: Value = (yield* alert(user, "You study the schematics etched into the forge...", null, "Shielded Robe", "Flagellant's Robe", "Nar-Sien Hardsuit"));
	if (choice === "Shielded Robe") {
		pickedtype = T("/obj/item/clothing/suit/hooded/cultrobes/cult_shield");
	} else if (choice === "Flagellant's Robe") {
		pickedtype = T("/obj/item/clothing/suit/hooded/cultrobes/berserker");
	} else if (choice === "Nar-Sien Hardsuit") {
		pickedtype = T("/obj/item/clothing/suit/space/hardsuit/cult");
	}
	if (!(this && !(!this || this.gc_destroyed) && this.anchored && pickedtype && this.Adjacent(user) && !user.incapacitated() && iscultist(user) && this.cooldowntime <= rt.worldTime(f))) return f.dot;
	this.cooldowntime = rt.worldTime(f) + 2400;
	let N: Value = (yield* new_(pickedtype, rt.getStep(f, this, 0)));
	to_chat(user, `<span class='cultitalic'>You work the forge as dark knowledge guides your hands, creating ${N}!</span>`);
	return f.dot;
}, true);

rt.type(12170, "/obj/structure/destructible/cult/pylon", "/obj/structure/destructible/cult", {
	heal_delay: 25,
	last_heal: 0,
	corrupt_delay: 50,
	last_corrupt: 0,
	light_range: 5,
	light_color: "#FA8282",
	name: "pylon",
	desc: "A floating crystal that slowly heals those faithful to Nar'Sie.",
	icon_state: "pylon",
	break_sound: rt.rsc("sound/effects/glassbr2.ogg"),
	break_message: "<span class='warning'>The blood-red crystal falls to the floor and shatters!</span>",
});

// cult_structures.dm:140
rt.def("/obj/structure/destructible/cult/pylon/proc/New", function* New(f: Frame) {
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cult_structures.dm:144
rt.def("/obj/structure/destructible/cult/pylon/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return (yield* parent_proc());
}, true);

// cult_structures.dm:148
rt.def("/obj/structure/destructible/cult/pylon/proc/process", function* process(f: Frame) {
	let L: Value = null, M: Value = null, _T: Value = null, F: Value = null;
	if (!this.anchored) {
		return f.dot;
	}
	if (this.last_heal <= rt.worldTime(f)) {
		this.last_heal = rt.worldTime(f) + this.heal_delay;
		for (L of each(range(5, this), T("/mob/living"))) {
			if (iscultist(L) || rt.istype(L, T("/mob/living/simple_animal/shade")) || rt.istype(L, T("/mob/living/simple_animal/hostile/construct"))) {
				if (L.health != L.maxHealth) {
					yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, this, 0), "#960000");
					if (rt.istype(L, T("/mob/living/carbon/human"))) {
						yield* L.adjustBruteLoss(-1, 0);
						yield* L.adjustFireLoss(-1, 0);
						yield* L.updatehealth();
					}
					if (rt.istype(L, T("/mob/living/simple_animal/shade")) || rt.istype(L, T("/mob/living/simple_animal/hostile/construct"))) {
						if ((M = L).health < M.maxHealth) {
							yield* M.adjustHealth(-1);
						}
					}
				}
				if (rt.istype(L, T("/mob/living/carbon/human")) && L.blood_volume < BLOOD_VOLUME_NORMAL) {
					L.blood_volume += 1;
				}
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	if (!(this.last_corrupt <= rt.worldTime(f))) return f.dot;
	let validturfs: Value = list();
	let cultturfs: Value = list();
	for (_T of each(circleviewturfs(this, 5))) {
		if (rt.istype(_T, T("/turf/open/floor/engine/cult"))) {
			(cultturfs = rt.modify(cultturfs, _T, rt.bitOr));
			continue;
		}
		if (is_type_in_typecache(_T, GLOB.blacklisted_pylon_turfs)) {
			continue;
		}
		(validturfs = rt.modify(validturfs, _T, rt.bitOr));
	}
	this.last_corrupt = rt.worldTime(f) + this.corrupt_delay;
	if (_T = safepick(validturfs)) {
		yield* _T.ChangeTurf(T("/turf/open/floor/engine/cult"));
	} else if (F = safepick(cultturfs)) {
		yield* new_(T("/obj/effect/temp_visual/cult/turf/floor"), F);
	} else {
		this.last_corrupt = rt.worldTime(f) + this.corrupt_delay * 2;
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(12171, "/obj/structure/destructible/cult/tome", "/obj/structure/destructible/cult", {
	light_range: 1.4,
	light_color: "#FAA019",
	name: "archives",
	desc: "A desk covered in arcane manuscripts and tomes in unknown languages. Looking at the text makes your skin crawl.",
	icon_state: "tomealtar",
	break_message: "<span class='warning'>The books and tomes of the archives burn into ash as the desk shatters!</span>",
});

// cult_structures.dm:208
rt.def("/obj/structure/destructible/cult/tome/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let N: Value = null, D: Value = null;
	let $e: any;
	if (!iscultist(user)) {
		to_chat(user, "<span class='warning'>All of these books seem to be gibberish.</span>");
		return f.dot;
	}
	if (!this.anchored) {
		to_chat(user, `<span class='cultitalic'>You need to anchor ${this} to the floor with a tome first.</span>`);
		return f.dot;
	}
	if (this.cooldowntime > rt.worldTime(f)) {
		to_chat(user, `<span class='cultitalic'>The magic in ${this} is weak, it will be ready to use again in ${this.getETA()}.</span>`);
		return f.dot;
	}
	let choice: Value = (yield* alert(user, "You flip through the black pages of the archives...", null, "Supply Talisman", "Shuttle Curse", "Veil Walker Set"));
	let pickedtype: Value = list();
	if (choice === "Supply Talisman") {
		pickedtype += T("/obj/item/weapon/paper/talisman/supply/weak");
	} else if (choice === "Shuttle Curse") {
		pickedtype += T("/obj/item/device/shuttle_curse");
	} else if (choice === "Veil Walker Set") {
		pickedtype += T("/obj/item/device/cult_shift");
		pickedtype += T("/obj/item/device/flashlight/flare/culttorch");
	}
	if (!(this && !(!this || this.gc_destroyed) && this.anchored && rt.len(f, pickedtype) && this.Adjacent(user) && !user.incapacitated() && iscultist(user) && this.cooldowntime <= rt.worldTime(f))) return f.dot;
	this.cooldowntime = rt.worldTime(f) + 2400;
	for (N of each(pickedtype)) {
		D = (yield* new_(N, rt.getStep(f, this, 0)));
		to_chat(user, `<span class='cultitalic'>You summon ${D} from the archives!</span>`);
	}
	return f.dot;
}, true);
