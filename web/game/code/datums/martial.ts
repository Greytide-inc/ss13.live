// Based on /tg/station's code/datums/martial.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(567, "/datum/martial_art", "/datum", {
	name: "Martial Art",
	streak: "",
	max_streak_length: 6,
	current_target: null,
	temporary: 0,
	base: null,
	deflection_chance: 0,
	block_chance: 0,
	restraining: 0,
	help_verb: null,
	no_guns: 0,
	allow_temp_override: 1,
});

// martial.dm:25
rt.def("/datum/martial_art/proc/add_to_streak", function add_to_streak(f: Frame, element: Value, D: Value) {
	if (D != this.current_target) {
		this.current_target = D;
		this.streak = "";
		this.restraining = 0;
	}
	this.streak = this.streak + element;
	if (rt.length(this.streak) > this.max_streak_length) {
		this.streak = copytext(this.streak, 2);
	}
	return f.dot;
});

// martial.dm:36
rt.def("/datum/martial_art/proc/basic_hit", function* basic_hit(f: Frame, A: Value, D: Value) {
	let damage: Value = rand(A.dna.species.punchdamagelow, A.dna.species.punchdamagehigh);
	let atk_verb: Value = A.dna.species.attack_verb;
	if (D.lying) {
		atk_verb = "kick";
	}
	if (atk_verb === "kick") {
		yield* A.do_attack_animation(D, "kick");
	} else if (atk_verb === "slash") {
		yield* A.do_attack_animation(D, "claw");
	} else if (atk_verb === "smash") {
		yield* A.do_attack_animation(D, "smash");
	} else {
		yield* A.do_attack_animation(D, "punch");
	}
	if (!damage) {
		playsound(D.loc, A.dna.species.miss_sound, 25, 1, -1);
		D.visible_message(`<span class='warning'>${A} has attempted to ${atk_verb} ${D}!</span>`, `<span class='userdanger'>${A} has attempted to ${atk_verb} ${D}!</span>`, null, 3);
		add_logs(A, D, `attempted to ${atk_verb}`);
		return 0;
	}
	let affecting: Value = D.get_bodypart(ran_zone(A.zone_selected));
	let armor_block: Value = D.run_armor_check(affecting, "melee");
	playsound(D.loc, A.dna.species.attack_sound, 25, 1, -1);
	D.visible_message(`<span class='danger'>${A} has ${atk_verb}ed ${D}!</span>`, `<span class='userdanger'>${A} has ${atk_verb}ed ${D}!</span>`, null, 3);
	yield* D.apply_damage(damage, "brute", affecting, armor_block);
	add_logs(A, D, "punched");
	if (D.stat != 2 && damage >= A.dna.species.punchstunthreshold) {
		D.visible_message(`<span class='danger'>${A} has knocked ${D} down!!</span>`, `<span class='userdanger'>${A} has knocked ${D} down!</span>`);
		yield* D.apply_effect(40, "knockdown", armor_block);
		yield* D.forcesay(GLOB.hit_appends);
	} else if (D.lying) {
		yield* D.forcesay(GLOB.hit_appends);
	}
	return 1;
}, true);

// martial.dm:82
rt.def("/datum/martial_art/proc/teach", function teach(f: Frame, H: Value, make_temporary: Value) {
	make_temporary ??= 0;
	if (make_temporary) {
		this.temporary = 1;
	}
	if (this.temporary && H.mind.martial_art) {
		if (!H.mind.martial_art.allow_temp_override) {
			return f.dot;
		}
		this.base = H.mind.martial_art;
	}
	if (this.help_verb) {
		H.verbs += this.help_verb;
	}
	H.mind.martial_art = this;
	return f.dot;
});

// martial.dm:91
rt.def("/datum/martial_art/proc/remove", function remove(f: Frame, H: Value) {
	if (H.mind.martial_art != this) {
		return f.dot;
	}
	H.mind.martial_art = this.base;
	if (!this.help_verb) return f.dot;
	H.verbs -= this.help_verb;
	return f.dot;
});
