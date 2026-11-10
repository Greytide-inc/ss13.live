// Based on /tg/station's code/game/objects/structures/crates_lockers/crates/secure.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12269, "/obj/structure/closet/crate/secure", "/obj/structure/closet/crate", {
	tamperproof: 0,
	secure: 1,
	locked: 1,
	desc: "A secure crate.",
	name: "secure crate",
	icon_state: "securecrate",
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
});

// secure.dm:9
rt.def("/obj/structure/closet/crate/secure/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 50, "laser", 50, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]);
	return f.dot;
});

// secure.dm:13
rt.def("/obj/structure/closet/crate/secure/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 25) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// secure.dm:18
rt.def("/obj/structure/closet/crate/secure/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.broken) {
		this.add_overlay("securecrateemag");
	} else if (this.locked) {
		this.add_overlay("securecrater");
	} else {
		this.add_overlay("securecrateg");
	}
	return f.dot;
});

// secure.dm:27
rt.def("/obj/structure/closet/crate/secure/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (prob(this.tamperproof)) {
		yield* this.boom();
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// secure.dm:34
rt.def("/obj/structure/closet/crate/secure/proc/boom", function* boom(f: Frame, user: Value) {
	let message: Value = null, AM: Value = null;
	if (user) {
		to_chat(user, "<span class='danger'>The crate's anti-tamper system activates!</span>");
		GLOB.bombers += (message = `${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} has detonated ${this.name}.`);
		message_admins(message);
		log_game(`${key_name(user)} has detonated ${this.name}.`);
	}
	for (AM of each(this, T("/atom/movable"))) {
		yield* qdel(AM);
	}
	yield* explosion(rt.getStep(f, this, 0), 0, 1, 5, 5);
	yield* qdel(this);
	return f.dot;
}, true);
