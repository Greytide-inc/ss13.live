// Based on /tg/station's code/modules/awaymissions/mission_code/stationCollision.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11522, "/obj/effect/landmark/sc_bible_spawner", "/obj/effect/landmark", {
	name: "Safecode hint spawner",
});

// stationCollision.dm:26
rt.def("/obj/effect/landmark/sc_bible_spawner/proc/New", function* New(f: Frame) {
	let B: Value = null;
	(B = (yield* new_(T("/obj/item/weapon/storage/book/bible/booze"), this.loc))).name = "The Holy book of the Geometer";
	B.deity_name = "Narsie";
	B.icon_state = "melted";
	B.item_state = "melted";
	yield* new_(T("/obj/item/weapon/paper/sc_safehint_paper_bible"), B);
	yield* new_(T("/obj/item/weapon/pen"), B);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(5216, "/obj/item/weapon/gun/ballistic/automatic/c20r/sc_c20r", "/obj/item/weapon/gun/ballistic/automatic/c20r", {});

// stationCollision.dm:50
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/sc_c20r/proc/Initialize", function* Initialize(f: Frame) {
	let ammo: Value = null;
	f.dot = (yield* parent_proc());
	for (ammo of each(this.magazine.stored_ammo)) {
		if (prob(95)) {
			this.magazine.stored_ammo -= ammo;
		}
	}
	return f.dot;
}, true);

rt.type(5249, "/obj/item/weapon/gun/ballistic/shotgun/sc_pump", "/obj/item/weapon/gun/ballistic/shotgun", {});

// stationCollision.dm:59
rt.def("/obj/item/weapon/gun/ballistic/shotgun/sc_pump/proc/Initialize", function* Initialize(f: Frame) {
	let ammo: Value = null;
	f.dot = (yield* parent_proc());
	for (ammo of each(this.magazine.stored_ammo)) {
		if (prob(95)) {
			this.magazine.stored_ammo -= ammo;
		}
	}
	return f.dot;
}, true);

// stationCollision.dm:75
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode1", function InitGlobalsc_safecode1(f: Frame) {
	GLOB.sc_safecode1 = `${rand(0, 9)}`;
	this.gvars_datum_init_order += "sc_safecode1";
	return f.dot;
});

// stationCollision.dm:76
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode2", function InitGlobalsc_safecode2(f: Frame) {
	GLOB.sc_safecode2 = `${rand(0, 9)}`;
	this.gvars_datum_init_order += "sc_safecode2";
	return f.dot;
});

// stationCollision.dm:77
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode3", function InitGlobalsc_safecode3(f: Frame) {
	GLOB.sc_safecode3 = `${rand(0, 9)}`;
	this.gvars_datum_init_order += "sc_safecode3";
	return f.dot;
});

// stationCollision.dm:78
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode4", function InitGlobalsc_safecode4(f: Frame) {
	GLOB.sc_safecode4 = `${rand(0, 9)}`;
	this.gvars_datum_init_order += "sc_safecode4";
	return f.dot;
});

// stationCollision.dm:79
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode5", function InitGlobalsc_safecode5(f: Frame) {
	GLOB.sc_safecode5 = `${rand(0, 9)}`;
	this.gvars_datum_init_order += "sc_safecode5";
	return f.dot;
});

rt.type(6600, "/obj/item/weapon/paper/sc_safehint_paper_prison", "/obj/item/weapon/paper", {
	name: "smudged paper",
});

// stationCollision.dm:86
rt.def("/obj/item/weapon/paper/sc_safehint_paper_prison/proc/New", function New(f: Frame) {
	this.info = `<i>The ink is smudged, you can only make out a couple numbers:</i> '${GLOB.sc_safecode1}**${GLOB.sc_safecode4}*'`;
	return f.dot;
});

rt.type(6601, "/obj/item/weapon/paper/sc_safehint_paper_hydro", "/obj/item/weapon/paper", {
	name: "shredded paper",
});

// stationCollision.dm:91
rt.def("/obj/item/weapon/paper/sc_safehint_paper_hydro/proc/New", function New(f: Frame) {
	this.info = `<i>Although the paper is shredded, you can clearly see the number:</i> '${GLOB.sc_safecode2}'`;
	return f.dot;
});

rt.type(6603, "/obj/item/weapon/paper/sc_safehint_paper_bible", "/obj/item/weapon/paper", {
	name: "hidden paper",
});

// stationCollision.dm:101
rt.def("/obj/item/weapon/paper/sc_safehint_paper_bible/proc/New", function New(f: Frame) {
	this.info = `<i>It would appear that the pen hidden with the paper had leaked ink over the paper.\n\t\t\tHowever you can make out the last three digits:</i>'${GLOB.sc_safecode3}${GLOB.sc_safecode4}${GLOB.sc_safecode5}'\n\t\t\t`;
	return f.dot;
});

rt.type(5587, "/obj/item/weapon/storage/secure/safe/sc_ssafe", "/obj/item/weapon/storage/secure/safe", {
	name: "Captain's secure safe",
});

// stationCollision.dm:125
rt.def("/obj/item/weapon/storage/secure/safe/sc_ssafe/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.l_code = `${GLOB.sc_safecode1}${GLOB.sc_safecode2}${GLOB.sc_safecode3}${GLOB.sc_safecode4}${GLOB.sc_safecode5}`;
	this.l_set = 1;
	yield* new_(T("/obj/item/weapon/gun/energy/mindflayer"), this);
	yield* new_(T("/obj/item/device/soulstone"), this);
	yield* new_(T("/obj/item/clothing/suit/space/hardsuit/cult"), this);
	yield* new_(T("/obj/item/weapon/ore/diamond"), this);
	return f.dot;
}, true);

rt.type(13038, "/obj/singularity/narsie/sc_Narsie", "/obj/singularity/narsie", {
	uneatable: null,
	desc: "Your body becomes weak and your feel your mind slipping away as you try to comprehend what you know can't be possible.",
	move_self: 0,
	grav_pull: 0,
});

// stationCollision.dm:141
rt.def("/obj/singularity/narsie/sc_Narsie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.uneatable = list(T("/turf/open/space"), T("/obj/effect/overlay"), T("/mob/living/simple_animal/hostile/construct"));
	return f.dot;
});

// stationCollision.dm:147
rt.def("/obj/singularity/narsie/sc_Narsie/proc/process", function* process(f: Frame) {
	yield* this.eat();
	if (!prob(25)) return f.dot;
	yield* this.mezzer();
	return f.dot;
}, true, { waitfor: false });

// stationCollision.dm:152
rt.def("/obj/singularity/narsie/sc_Narsie/proc/consume", function* consume(f: Frame, A: Value) {
	let L: Value = null, O: Value = null, _T: Value = null, O_1: Value = null;
	if (is_type_in_list(A, this.uneatable)) {
		return 0;
	}
	if (rt.istype(A, T("/mob/living"))) {
		yield* (L = A).gib();
	} else if (rt.istype(A, T("/obj"))) {
		yield* (O = A).ex_act(1);
		if (O) {
			yield* qdel(O);
		}
	} else if (isturf(A)) {
		if ((_T = A).intact) {
			for (O_1 of each(_T.contents, T("/obj"))) {
				if (O_1.level != 1) {
					continue;
				}
				if (O_1.invisibility == INVISIBILITY_MAXIMUM) {
					yield* this.consume(O_1);
				}
			}
		}
		yield* _T.ChangeTurf(T("/turf/open/space"));
	}
	return f.dot;
}, true);
