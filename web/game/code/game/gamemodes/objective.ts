// Based on /tg/station's code/game/gamemodes/objective.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(1102, "/datum/objective", "/datum", {
	owner: null,
	explanation_text: "Nothing",
	target: null,
	target_amount: 0,
	completed: 0,
	dangerrating: 0,
	martyr_compatible: 0,
});

// objective.dm:12
rt.def("/datum/objective/proc/New", function New(f: Frame, text: Value) {
	if (!text) return f.dot;
	this.explanation_text = text;
	return f.dot;
});

// objective.dm:18
rt.def("/datum/objective/proc/is_unique_objective", function is_unique_objective(f: Frame, possible_target: Value) {
	let O: Value = null;
	for (O of each(this.owner.objectives, T("/datum/objective"))) {
		if (rt.op(f, "IsType", [], [O, this.type]) && O.get_target() == possible_target) {
			return 0;
		}
	}
	return 1;
});

// objective.dm:28
rt.def("/datum/objective/proc/get_crewmember_minds", function get_crewmember_minds(f: Frame) {
	let V: Value = null, R: Value = null, M: Value = null;
	f.dot = list();
	for (V of each(GLOB.data_core.locked)) {
		R = V;
		if ((M = rt.index(R.fields, "reference")) && M.mind) {
			f.dot += M.mind;
		}
	}
	return f.dot;
});

// objective.dm:36
rt.def("/datum/objective/proc/find_target", function find_target(f: Frame) {
	let possible_target: Value = null;
	let possible_targets: Value = list();
	for (possible_target of each(this.get_crewmember_minds(), T("/datum/mind"))) {
		if (possible_target != this.owner && rt.istype(possible_target.current, T("/mob/living/carbon/human")) && possible_target.current.stat != 2 && this.is_unique_objective(possible_target)) {
			possible_targets += possible_target;
		}
	}
	if (rt.len(f, possible_targets) > 0) {
		this.target = pick(possible_targets);
	}
	this.update_explanation_text();
	return this.target;
});

// objective.dm:46
rt.def("/datum/objective/proc/find_target_by_role", function find_target_by_role(f: Frame, role: Value, role_type: Value, invert: Value) {
	let possible_target: Value = null, is_role: Value = null;
	role_type ??= 0;
	invert ??= 0;
	for (possible_target of each(this.get_crewmember_minds(), T("/datum/mind"))) {
		if (possible_target != this.owner && rt.istype(possible_target.current, T("/mob/living/carbon/human"))) {
			is_role = 0;
			if (role_type) {
				if (possible_target.special_role == role) {
					is_role++;
				}
			} else if (possible_target.assigned_role == role) {
				is_role++;
			}
			if (invert) {
				if (is_role) {
					continue;
				}
				this.target = possible_target;
				break;
			}
			if (is_role) {
				this.target = possible_target;
				break;
			}
		}
	}
	this.update_explanation_text();
	return f.dot;
});

// objective.dm:71
rt.def("/datum/objective/proc/give_special_equipment", function* give_special_equipment(f: Frame, special_equipment: Value) {
	let eq_path: Value = null, O: Value = null;
	if (!(this.owner && this.owner.current)) return f.dot;
	if (!rt.istype(this.owner.current, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = this.owner.current;
	let slots: Value = rt.alist(f, ["backpack", slot_in_backpack]);
	for (eq_path of each(special_equipment)) {
		O = (yield* new_(eq_path));
		yield* H.equip_in_one_of_slots(O, slots);
	}
	return f.dot;
}, true);

rt.type(1103, "/datum/objective/assassinate", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 10,
	martyr_compatible: 1,
});

// objective.dm:85
rt.def("/datum/objective/assassinate/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		this.target_role_type = f.args[1];
	}
	parent_proc();
	return this.target;
}, false, { args: ["role", "role_type", "invert"] });

// objective.dm:91
rt.def("/datum/objective/assassinate/proc/check_completion", function check_completion(f: Frame) {
	if (this.target && this.target.current) {
		if (this.target.current.stat == 2 || rt.istype(this.target.current, T("/mob/living/silicon")) || rt.istype(this.target.current, T("/mob/living/brain")) || this.target.current.z > 6 || !this.target.current.ckey) {
			return 1;
		}
		return 0;
	}
	return 1;
});

// objective.dm:98
rt.def("/datum/objective/assassinate/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	parent_proc();
	if (this.target && this.target.current) {
		$0 = this.target.name;
		if (!this.target_role_type) {
			$1 = this.target.assigned_role;
		} else {
			$1 = this.target.special_role;
		}
		this.explanation_text = `Assassinate ${$0}, the ${$1}.`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1104, "/datum/objective/assassinate/internal", "/datum/objective/assassinate", {
	stolen: 0,
});

// objective.dm:108
rt.def("/datum/objective/assassinate/internal/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	parent_proc();
	if (!(this.target && !this.target.current)) return f.dot;
	this.explanation_text = `Assassinate ${this.target.name}, who was obliterated`;
	return f.dot;
});

rt.type(1105, "/datum/objective/mutiny", "/datum/objective", {
	target_role_type: 0,
	martyr_compatible: 1,
});

// objective.dm:118
rt.def("/datum/objective/mutiny/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		this.target_role_type = f.args[1];
	}
	parent_proc();
	return this.target;
}, false, { args: ["role", "role_type", "invert"] });

// objective.dm:124
rt.def("/datum/objective/mutiny/proc/check_completion", function check_completion(f: Frame) {
	let _T: Value = null;
	if (this.target && this.target.current) {
		if (this.target.current.stat == 2 || !rt.istype(this.target.current, T("/mob/living/carbon/human")) || !this.target.current.ckey) {
			return 1;
		}
		if ((_T = rt.getStep(f, this.target.current, 0)) && _T.z > ZLEVEL_STATION || this.target.current.client && this.target.current.client.is_afk()) {
			return 2;
		}
		return 0;
	}
	return 1;
});

// objective.dm:134
rt.def("/datum/objective/mutiny/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	parent_proc();
	if (this.target && this.target.current) {
		$0 = this.target.name;
		if (!this.target_role_type) {
			$1 = this.target.assigned_role;
		} else {
			$1 = this.target.special_role;
		}
		this.explanation_text = `Assassinate or exile ${$0}, the ${$1}.`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1106, "/datum/objective/maroon", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 5,
	martyr_compatible: 1,
});

// objective.dm:148
rt.def("/datum/objective/maroon/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		this.target_role_type = f.args[1];
	}
	parent_proc();
	return this.target;
}, false, { args: ["role", "role_type", "invert"] });

// objective.dm:154
rt.def("/datum/objective/maroon/proc/check_completion", function check_completion(f: Frame) {
	if (this.target && this.target.current) {
		if (this.target.current.stat == 2 || rt.istype(this.target.current, T("/mob/living/silicon")) || rt.istype(this.target.current, T("/mob/living/brain")) || this.target.current.z > 6 || !this.target.current.ckey) {
			return 1;
		}
		if (this.target.current.onCentcom() || this.target.current.onSyndieBase()) {
			return 0;
		}
	}
	return 1;
});

// objective.dm:162
rt.def("/datum/objective/maroon/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	if (this.target && this.target.current) {
		$0 = this.target.name;
		if (!this.target_role_type) {
			$1 = this.target.assigned_role;
		} else {
			$1 = this.target.special_role;
		}
		this.explanation_text = `Prevent ${$0}, the ${$1}, from escaping alive.`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1107, "/datum/objective/debrain", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 20,
});

// objective.dm:174
rt.def("/datum/objective/debrain/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		this.target_role_type = f.args[1];
	}
	parent_proc();
	return this.target;
}, false, { args: ["role", "role_type", "invert"] });

// objective.dm:180
rt.def("/datum/objective/debrain/proc/check_completion", function check_completion(f: Frame) {
	if (!this.target) {
		return 1;
	}
	if (!this.owner.current || this.owner.current.stat == 2) {
		return 0;
	}
	if (!this.target.current || !rt.istype(this.target.current, T("/mob/living/brain"))) {
		return 0;
	}
	let A: Value = this.target.current;
	while (A.loc) {
		if ((A = A.loc) == this.owner.current) {
			return 1;
		}
	}
	return 0;
});

// objective.dm:194
rt.def("/datum/objective/debrain/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	parent_proc();
	if (this.target && this.target.current) {
		$0 = this.target.name;
		if (!this.target_role_type) {
			$1 = this.target.assigned_role;
		} else {
			$1 = this.target.special_role;
		}
		this.explanation_text = `Steal the brain of ${$0}, the ${$1}.`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1108, "/datum/objective/protect", "/datum/objective", {
	target_role_type: 0,
	dangerrating: 10,
	martyr_compatible: 1,
});

// objective.dm:208
rt.def("/datum/objective/protect/proc/find_target_by_role", function find_target_by_role(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		this.target_role_type = f.args[1];
	}
	parent_proc();
	return this.target;
}, false, { args: ["role", "role_type", "invert"] });

// objective.dm:214
rt.def("/datum/objective/protect/proc/check_completion", function check_completion(f: Frame) {
	if (!this.target) {
		return 1;
	}
	if (this.target.current) {
		if (this.target.current.stat == 2 || rt.istype(this.target.current, T("/mob/living/silicon")) || rt.istype(this.target.current, T("/mob/living/brain"))) {
			return 0;
		}
		return 1;
	}
	return 0;
});

// objective.dm:223
rt.def("/datum/objective/protect/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let $0: any, $1: any;
	parent_proc();
	if (this.target && this.target.current) {
		$0 = this.target.name;
		if (!this.target_role_type) {
			$1 = this.target.assigned_role;
		} else {
			$1 = this.target.special_role;
		}
		this.explanation_text = `Protect ${$0}, the ${$1}.`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1109, "/datum/objective/hijack", "/datum/objective", {
	explanation_text: "Hijack the shuttle to ensure no loyalist Nanotrasen crew escape alive and out of custody.",
	dangerrating: 25,
	martyr_compatible: 0,
});

// objective.dm:237
rt.def("/datum/objective/hijack/proc/check_completion", function check_completion(f: Frame) {
	if (!this.owner.current || this.owner.current.stat) {
		return 0;
	}
	if (GLOB.SSshuttle.emergency.mode != "endgame: game over") {
		return 0;
	}
	if (rt.istype(this.owner.current, T("/mob/living/silicon"))) {
		return 0;
	}
	let A: Value = get_area(this.owner.current);
	if (GLOB.SSshuttle.emergency.areaInstance != A) {
		return 0;
	}
	return GLOB.SSshuttle.emergency.is_hijacked();
});

rt.type(1110, "/datum/objective/hijackclone", "/datum/objective", {
	explanation_text: "Hijack the emergency shuttle by ensuring only you (or your copies) escape.",
	dangerrating: 25,
	martyr_compatible: 0,
});

// objective.dm:257
rt.def("/datum/objective/hijackclone/proc/check_completion", function check_completion(f: Frame) {
	let player: Value = null, location: Value = null;
	if (!this.owner.current) {
		return 0;
	}
	if (GLOB.SSshuttle.emergency.mode != "endgame: game over") {
		return 0;
	}
	let A: Value = GLOB.SSshuttle.emergency.areaInstance;
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (player.mind && player.mind != this.owner) {
			if (player.stat != 2) {
				if (rt.istype(player, T("/mob/living/silicon"))) {
					continue;
				}
				if (rt.istype(player, T("/mob/living/simple_animal"))) {
					continue;
				}
				if (rt.istype(player, T("/mob/living/brain"))) {
					continue;
				}
				if (get_area(player) == A) {
					location = rt.getStep(f, player.mind.current, 0);
					if (player.real_name != this.owner.current.real_name && !rt.istype(location, T("/turf/open/floor/plasteel/shuttle/red")) && !rt.istype(location, T("/turf/open/floor/mineral/plastitanium/brig"))) {
						return 0;
					}
				}
			}
		}
	}
	player = null;
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (player.mind && player.mind != this.owner) {
			if (player.stat != 2) {
				if (rt.istype(player, T("/mob/living/silicon"))) {
					continue;
				}
				if (rt.istype(player, T("/mob/living/simple_animal"))) {
					continue;
				}
				if (rt.istype(player, T("/mob/living/brain"))) {
					continue;
				}
				if (get_area(player) == A) {
					location = rt.getStep(f, player.mind.current, 0);
					if (player.real_name == this.owner.current.real_name && !rt.istype(location, T("/turf/open/floor/plasteel/shuttle/red")) && !rt.istype(location, T("/turf/open/floor/mineral/plastitanium/brig"))) {
						return 1;
					}
				}
			}
		}
	}
	return 0;
});

rt.type(1111, "/datum/objective/block", "/datum/objective", {
	explanation_text: "Do not allow any organic lifeforms to escape on the shuttle alive.",
	dangerrating: 25,
	martyr_compatible: 1,
});

// objective.dm:299
rt.def("/datum/objective/block/proc/check_completion", function check_completion(f: Frame) {
	let player: Value = null;
	if (!rt.istype(this.owner.current, T("/mob/living/silicon"))) {
		return 0;
	}
	if (GLOB.SSshuttle.emergency.mode != "endgame: game over") {
		return 1;
	}
	let A: Value = GLOB.SSshuttle.emergency.areaInstance;
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (rt.istype(player, T("/mob/living/silicon"))) {
			continue;
		}
		if (player.mind) {
			if (player.stat != 2) {
				if (get_area(player) == A) {
					return 0;
				}
			}
		}
	}
	return 1;
});

rt.type(1112, "/datum/objective/purge", "/datum/objective", {
	explanation_text: "Ensure no mutant humanoid species are present aboard the escape shuttle.",
	dangerrating: 25,
	martyr_compatible: 1,
});

// objective.dm:323
rt.def("/datum/objective/purge/proc/check_completion", function check_completion(f: Frame) {
	let player: Value = null, H: Value = null;
	if (GLOB.SSshuttle.emergency.mode != "endgame: game over") {
		return 1;
	}
	let A: Value = GLOB.SSshuttle.emergency.areaInstance;
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (get_area(player) == A && player.mind && player.stat != 2 && rt.istype(player, T("/mob/living/carbon/human"))) {
			if ((H = player).dna.species.id != "human") {
				return 0;
			}
		}
	}
	return 1;
});

rt.type(1113, "/datum/objective/robot_army", "/datum/objective", {
	explanation_text: "Have at least eight active cyborgs synced to you.",
	dangerrating: 25,
	martyr_compatible: 0,
});

// objective.dm:343
rt.def("/datum/objective/robot_army/proc/check_completion", function check_completion(f: Frame) {
	let R: Value = null;
	if (!rt.istype(this.owner.current, T("/mob/living/silicon/ai"))) {
		return 0;
	}
	let A: Value = this.owner.current;
	let counter: Value = 0;
	for (R of each(A.connected_robots, T("/mob/living/silicon/robot"))) {
		if (R.stat != 2) {
			counter++;
		}
	}
	if (counter < 8) {
		return 0;
	}
	return 1;
});

rt.type(1114, "/datum/objective/escape", "/datum/objective", {
	explanation_text: "Escape on the shuttle or an escape pod alive and without being in custody.",
	dangerrating: 5,
});

// objective.dm:362
rt.def("/datum/objective/escape/proc/check_completion", function check_completion(f: Frame) {
	let location: Value = null;
	if (rt.istype(this.owner.current, T("/mob/living/silicon"))) {
		return 0;
	}
	if (rt.istype(this.owner.current, T("/mob/living/brain"))) {
		return 0;
	}
	if (!this.owner.current || this.owner.current.stat == 2) {
		return 0;
	}
	if (GLOB.SSticker.force_ending) {
		return 1;
	}
	if (GLOB.SSticker.mode.station_was_nuked) {
		return 1;
	}
	if (GLOB.SSshuttle.emergency.mode != "endgame: game over") {
		return 0;
	}
	if (!(location = rt.getStep(f, this.owner.current, 0))) {
		return 0;
	}
	if (rt.istype(location, T("/turf/open/floor/plasteel/shuttle/red")) || rt.istype(location, T("/turf/open/floor/mineral/plastitanium/brig"))) {
		return 0;
	}
	if (location.onCentcom() || location.onSyndieBase()) {
		return 1;
	}
	return 0;
});

rt.type(1115, "/datum/objective/escape/escape_with_identity", "/datum/objective/escape", {
	target_real_name: null,
	target_missing_id: null,
	dangerrating: 10,
});

// objective.dm:392
rt.def("/datum/objective/escape/escape_with_identity/proc/find_target", function find_target(f: Frame) {
	this.target = parent_proc();
	this.update_explanation_text();
	return f.dot;
});

// objective.dm:396
rt.def("/datum/objective/escape/escape_with_identity/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let H: Value = null;
	if (this.target && this.target.current) {
		this.target_real_name = this.target.current.real_name;
		this.explanation_text = `Escape on the shuttle or an escape pod with the identity of ${this.target_real_name}, the ${this.target.assigned_role}`;
		if (rt.istype(this.target.current, T("/mob/living/carbon/human"))) {
			H = this.target.current;
		}
		if (H && H.get_id_name() != this.target_real_name) {
			this.target_missing_id = 1;
		} else {
			this.explanation_text += " while wearing their identification card";
		}
		this.explanation_text += ".";
	} else {
		this.explanation_text = "Free Objective.";
	}
	return f.dot;
});

// objective.dm:412
rt.def("/datum/objective/escape/escape_with_identity/proc/check_completion", function check_completion(f: Frame) {
	if (!this.target_real_name) {
		return 1;
	}
	if (!rt.istype(this.owner.current, T("/mob/living/carbon/human"))) {
		return 0;
	}
	let H: Value = this.owner.current;
	if (parent_proc()) {
		if (H.dna.real_name == this.target_real_name) {
			if (H.get_id_name() == this.target_real_name || this.target_missing_id) {
				return 1;
			}
		}
	}
	return 0;
});

rt.type(1116, "/datum/objective/survive", "/datum/objective", {
	explanation_text: "Stay alive until the end.",
	dangerrating: 3,
});

// objective.dm:429
rt.def("/datum/objective/survive/proc/check_completion", function check_completion(f: Frame) {
	if (!this.owner.current || this.owner.current.stat == 2 || rt.istype(this.owner.current, T("/mob/living/brain"))) {
		return 0;
	}
	if (!is_special_character(this.owner.current)) {
		return 0;
	}
	return 1;
});

rt.type(1117, "/datum/objective/martyr", "/datum/objective", {
	explanation_text: "Die a glorious death.",
	dangerrating: 1,
});

// objective.dm:441
rt.def("/datum/objective/martyr/proc/check_completion", function check_completion(f: Frame) {
	if (!this.owner.current) {
		return 1;
	}
	if (this.owner.current && this.owner.current.stat == 2) {
		return 1;
	}
	return 0;
});

rt.type(1118, "/datum/objective/nuclear", "/datum/objective", {
	explanation_text: "Destroy the station with a nuclear device.",
	martyr_compatible: 1,
});

// objective.dm:453
rt.def("/datum/objective/nuclear/proc/check_completion", function check_completion(f: Frame) {
	if (GLOB.SSticker && GLOB.SSticker.mode && GLOB.SSticker.mode.station_was_nuked) {
		return 1;
	}
	return 0;
});

// objective.dm:457
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_items", function InitGlobalpossible_items(f: Frame) {
	GLOB.possible_items = list();
	this.gvars_datum_init_order += "possible_items";
	return f.dot;
});

rt.type(1119, "/datum/objective/steal", "/datum/objective", {
	targetinfo: null,
	steal_target: null,
	dangerrating: 5,
	martyr_compatible: 0,
});

// objective.dm:468
rt.def("/datum/objective/steal/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (rt.len(f, GLOB.possible_items)) return f.dot;
	yield* init_subtypes(T("/datum/objective_item/steal"), GLOB.possible_items);
	return f.dot;
}, true);

// objective.dm:473
rt.def("/datum/objective/steal/proc/find_target", function* find_target(f: Frame) {
	let possible_item: Value = null;
	let approved_targets: Value = list();
	for (possible_item of each(GLOB.possible_items, T("/datum/objective_item"))) {
		if (this.is_unique_objective(possible_item.targetitem) && !rt.isIn(f, this.owner.current.mind.assigned_role, possible_item.excludefromjob)) {
			approved_targets += possible_item;
		}
	}
	return (yield* this.set_target(safepick(approved_targets)));
}, true);

// objective.dm:481
rt.def("/datum/objective/steal/proc/set_target", function* set_target(f: Frame, item: Value) {
	if (item) {
		this.targetinfo = item;
		this.steal_target = this.targetinfo.targetitem;
		this.explanation_text = `Steal ${this.targetinfo.name}.`;
		this.dangerrating = this.targetinfo.difficulty;
		yield* this.give_special_equipment(this.targetinfo.special_equipment);
		return this.steal_target;
	} else {
		this.explanation_text = "Free objective";
		return f.dot;
	}
}, true);

// objective.dm:493
rt.def("/datum/objective/steal/proc/select_target", function* select_target(f: Frame) {
	let new_target: Value = null, custom_target: Value = null, custom_name: Value = null;
	let possible_items_all: Value = GLOB.possible_items + "custom";
	if (!(new_target = (yield* g.op(f, "Prompt", [1], [null, this.steal_target, "Objective target", "Select target:", possible_items_all])))) {
		return f.dot;
	}
	if (new_target == "custom") {
		if (!(custom_target = (yield* g.op(f, "Prompt", [1], [null, null, "Type", "Select type:", typesof(T("/obj/item"))])))) {
			return f.dot;
		}
		custom_name = rt.initial(f, custom_target, "name");
		if (!(custom_name = (yield* stripped_input("Enter target name:", "Objective target", custom_name)))) {
			return f.dot;
		}
		this.steal_target = custom_target;
		this.explanation_text = `Steal ${custom_name}.`;
	} else {
		yield* this.set_target(new_target);
	}
	return this.steal_target;
}, true);

// objective.dm:511
rt.def("/datum/objective/steal/proc/check_completion", function check_completion(f: Frame) {
	let I: Value = null;
	if (!this.steal_target) {
		return 1;
	}
	if (!rt.istype(this.owner.current, T("/mob/living"))) {
		return 0;
	}
	let all_items: Value = this.owner.current.GetAllContents();
	for (I of each(all_items, T("/obj"))) {
		if (rt.op(f, "IsType", [], [I, this.steal_target])) {
			if (!this.targetinfo) {
				return 1;
			} else if (this.targetinfo.check_special_completion(I)) {
				return 1;
			}
		}
		if (rt.isIn(f, (this.targetinfo && I.type), this.targetinfo.altitems)) {
			if (this.targetinfo.check_special_completion(I)) {
				return 1;
			}
		}
	}
	return 0;
});

// objective.dm:530
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_items_special", function InitGlobalpossible_items_special(f: Frame) {
	GLOB.possible_items_special = list();
	this.gvars_datum_init_order += "possible_items_special";
	return f.dot;
});

rt.type(1120, "/datum/objective/steal/special", "/datum/objective/steal", {});

// objective.dm:534
rt.def("/datum/objective/steal/special/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (rt.len(f, GLOB.possible_items_special)) return f.dot;
	yield* init_subtypes(T("/datum/objective_item/special"), GLOB.possible_items_special);
	yield* init_subtypes(T("/datum/objective_item/stack"), GLOB.possible_items_special);
	return f.dot;
}, true);

// objective.dm:540
rt.def("/datum/objective/steal/special/proc/find_target", function* find_target(f: Frame) {
	return (yield* this.set_target(pick(GLOB.possible_items_special)));
}, true);

rt.type(1121, "/datum/objective/steal/exchange", "/datum/objective/steal", {
	dangerrating: 10,
	martyr_compatible: 0,
});

// objective.dm:547
rt.def("/datum/objective/steal/exchange/proc/set_faction", function set_faction(f: Frame, faction: Value, otheragent: Value) {
	this.target = otheragent;
	if (faction == "red") {
		this.targetinfo = new_(T("/datum/objective_item/unique/docs_blue"));
	} else if (faction == "blue") {
		this.targetinfo = new_(T("/datum/objective_item/unique/docs_red"));
	}
	this.explanation_text = `Acquire ${this.targetinfo.name} held by ${this.target.current.real_name}, the ${this.target.assigned_role} and syndicate agent`;
	this.steal_target = this.targetinfo.targetitem;
	return f.dot;
});

// objective.dm:557
rt.def("/datum/objective/steal/exchange/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	parent_proc();
	if (this.target && this.target.current) {
		this.explanation_text = `Acquire ${this.targetinfo.name} held by ${this.target.name}, the ${this.target.assigned_role} and syndicate agent`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1122, "/datum/objective/steal/exchange/backstab", "/datum/objective/steal/exchange", {
	dangerrating: 3,
});

// objective.dm:568
rt.def("/datum/objective/steal/exchange/backstab/proc/set_faction", function set_faction(f: Frame, faction: Value) {
	if (faction == "red") {
		this.targetinfo = new_(T("/datum/objective_item/unique/docs_red"));
	} else if (faction == "blue") {
		this.targetinfo = new_(T("/datum/objective_item/unique/docs_blue"));
	}
	this.explanation_text = `Do not give up or lose ${this.targetinfo.name}.`;
	this.steal_target = this.targetinfo.targetitem;
	return f.dot;
});

rt.type(1123, "/datum/objective/download", "/datum/objective", {
	dangerrating: 10,
});

// objective.dm:580
rt.def("/datum/objective/download/proc/gen_amount_goal", function gen_amount_goal(f: Frame) {
	this.target_amount = rand(10, 20);
	this.explanation_text = fmt("Download ＀ research level５.", [this.target_amount]);
	return this.target_amount;
});

// objective.dm:585
rt.def("/datum/objective/download/proc/check_completion", function check_completion(f: Frame) {
	let H: Value = null, SN: Value = null, current_amount: Value = null, current_data: Value = null;
	if (!rt.istype(this.owner.current, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (!(H = this.owner.current) || H.stat == 2) {
		return 0;
	}
	if (!rt.istype(H.wear_suit, T("/obj/item/clothing/suit/space/space_ninja"))) {
		return 0;
	}
	if (!(SN = H.wear_suit).s_initialized) {
		return 0;
	}
	if (!rt.len(f, SN.stored_research)) {
		return 0;
	} else {
		for (current_data of each(SN.stored_research, T("/datum/tech"))) {
			if (current_data.level) {
				current_amount += current_data.level - 1;
			}
		}
	}
	if (current_amount < this.target_amount) {
		return 0;
	}
	return 1;
});

rt.type(1124, "/datum/objective/capture", "/datum/objective", {
	dangerrating: 10,
});

// objective.dm:616
rt.def("/datum/objective/capture/proc/gen_amount_goal", function gen_amount_goal(f: Frame) {
	this.target_amount = rand(5, 10);
	this.explanation_text = fmt("Capture ＀ lifeform５ with an energy net. Live, rare specimens are worth more.", [this.target_amount]);
	return this.target_amount;
});

// objective.dm:622
rt.def("/datum/objective/capture/proc/check_completion", function check_completion(f: Frame) {
	let M: Value = null;
	let captured_amount: Value = 0;
	let A: Value = rt.locateIn(f, T("/area/centcom/holding"), rt.world());
	for (M of each(A, T("/mob/living/carbon/human"))) {
		if (M.stat == 2) {
			captured_amount += 0.5;
			continue;
		}
		captured_amount += 1;
	}
	M = null;
	for (M of each(A, T("/mob/living/carbon/monkey"))) {
		captured_amount += 0.1;
	}
	M = null;
	for (M of each(A, T("/mob/living/carbon/alien/larva"))) {
		if (M.stat == 2) {
			captured_amount += 0.5;
			continue;
		}
		captured_amount += 1;
	}
	M = null;
	for (M of each(A, T("/mob/living/carbon/alien/humanoid"))) {
		if (rt.istype(M, T("/mob/living/carbon/alien/humanoid/royal/queen"))) {
			if (M.stat == 2) {
				captured_amount += 1.5;
			} else {
				captured_amount += 3;
			}
			continue;
		}
		if (M.stat == 2) {
			captured_amount += 1;
			continue;
		}
		captured_amount += 2;
	}
	if (captured_amount < this.target_amount) {
		return 0;
	}
	return 1;
});

rt.type(1125, "/datum/objective/absorb", "/datum/objective", {
	dangerrating: 10,
});

// objective.dm:656
rt.def("/datum/objective/absorb/proc/gen_amount_goal", function gen_amount_goal(f: Frame, lowbound: Value, highbound: Value) {
	let n_p: Value = null, _P: Value = null;
	lowbound ??= 4;
	highbound ??= 6;
	this.target_amount = rand(lowbound, highbound);
	if (GLOB.SSticker) {
		n_p = 1;
		if (GLOB.SSticker.current_state == GAME_STATE_SETTING_UP) {
			for (_P of each(GLOB.player_list, T("/mob/dead/new_player"))) {
				if (_P.client && _P.ready == PLAYER_READY_TO_PLAY && _P.mind != this.owner) {
					n_p++;
				}
			}
		} else if (GLOB.SSticker.IsRoundInProgress()) {
			_P = null;
			for (_P of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
				if (_P.client && !rt.isIn(f, _P.mind, GLOB.SSticker.mode.changelings) && _P.mind != this.owner) {
					n_p++;
				}
			}
		}
		this.target_amount = min(this.target_amount, n_p);
	}
	this.explanation_text = fmt("Extract ＀ compatible genome５.", [this.target_amount]);
	return this.target_amount;
});

// objective.dm:673
rt.def("/datum/objective/absorb/proc/check_completion", function check_completion(f: Frame) {
	if (this.owner && this.owner.changeling && this.owner.changeling.stored_profiles && this.owner.changeling.absorbedcount >= this.target_amount) {
		return 1;
	} else {
		return 0;
	}
});

rt.type(1126, "/datum/objective/destroy", "/datum/objective", {
	dangerrating: 10,
	martyr_compatible: 1,
});

// objective.dm:685
rt.def("/datum/objective/destroy/proc/find_target", function find_target(f: Frame) {
	let target_ai: Value = null;
	let possible_targets: Value = active_ais(1);
	this.target = (target_ai = pick(possible_targets)).mind;
	this.update_explanation_text();
	return this.target;
});

// objective.dm:692
rt.def("/datum/objective/destroy/proc/check_completion", function check_completion(f: Frame) {
	if (this.target && this.target.current) {
		if (this.target.current.stat == 2 || this.target.current.z > 6 || !this.target.current.ckey) {
			return 1;
		}
		return 0;
	}
	return 1;
});

// objective.dm:699
rt.def("/datum/objective/destroy/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	parent_proc();
	if (this.target && this.target.current) {
		this.explanation_text = `Destroy ${this.target.name}, the experimental AI.`;
	} else {
		this.explanation_text = "Free Objective";
	}
	return f.dot;
});

rt.type(1128, "/datum/objective/steal_five_of_type", "/datum/objective", {
	wanted_items: null,
	explanation_text: "Steal at least five items!",
});

// objective.dm:710
rt.def("/datum/objective/steal_five_of_type/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.wanted_items = list(T("/obj/item"));
	return f.dot;
});

// objective.dm:713
rt.def("/datum/objective/steal_five_of_type/proc/New", function New(f: Frame) {
	parent_proc();
	this.wanted_items = typecacheof(this.wanted_items);
	return f.dot;
});

rt.type(1129, "/datum/objective/steal_five_of_type/summon_guns", "/datum/objective/steal_five_of_type", {
	explanation_text: "Steal at least five guns!",
	wanted_items: null,
});

// objective.dm:718
rt.def("/datum/objective/steal_five_of_type/summon_guns/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.wanted_items = list(T("/obj/item/weapon/gun"));
	return f.dot;
});

rt.type(1130, "/datum/objective/steal_five_of_type/summon_magic", "/datum/objective/steal_five_of_type", {
	explanation_text: "Steal at least five magical artefacts!",
	wanted_items: null,
});

// objective.dm:722
rt.def("/datum/objective/steal_five_of_type/summon_magic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.wanted_items = list(T("/obj/item/weapon/spellbook"), T("/obj/item/weapon/gun/magic"), T("/obj/item/clothing/suit/space/hardsuit/wizard"), T("/obj/item/weapon/scrying"), T("/obj/item/weapon/antag_spawner/contract"), T("/obj/item/device/necromantic_stone"));
	return f.dot;
});

// objective.dm:725
rt.def("/datum/objective/steal_five_of_type/proc/check_completion", function check_completion(f: Frame) {
	let I: Value = null;
	if (!rt.istype(this.owner.current, T("/mob/living"))) {
		return 0;
	}
	let stolen_count: Value = 0;
	let all_items: Value = this.owner.current.GetAllContents();
	for (I of each(all_items, T("/obj"))) {
		if (is_type_in_typecache(I, this.wanted_items)) {
			stolen_count++;
		}
	}
	if (stolen_count >= 5) {
		return 1;
	} else {
		return 0;
	}
	return 0;
});

rt.type(1132, "/datum/objective/changeling_team_objective/impersonate_department", "/datum/objective/changeling_team_objective", {
	command_staff_only: 0,
	department_minds: null,
	department_real_names: null,
	department_string: "",
	explanation_text: "Ensure X derpartment are killed, impersonated, and replaced by Changelings",
});

// objective.dm:756
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_minds = list();

	this.department_real_names = list();
	return f.dot;
});

// objective.dm:762
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/get_department_staff", function* get_department_staff(f: Frame) {
	let department_head: Value = null, M: Value = null;
	let $e: any;
	this.department_minds = list();
	this.department_real_names = list();
	let departments: Value = list("Head of Security", "Research Director", "Chief Engineer", "Chief Medical Officer");
	const subject = (department_head = pick(departments));
	if (subject === "Head of Security") {
		this.department_string = "security";
	} else if (subject === "Research Director") {
		this.department_string = "science";
	} else if (subject === "Chief Engineer") {
		this.department_string = "engineering";
	} else if (subject === "Chief Medical Officer") {
		this.department_string = "medical";
	}
	let ling_count: Value = GLOB.SSticker.mode.changelings;
	for (M of each(GLOB.SSticker.minds, T("/datum/mind"))) {
		if (rt.isIn(f, M, GLOB.SSticker.mode.changelings)) {
			continue;
		}
		if (rt.isIn(f, department_head, get_department_heads(M.assigned_role))) {
			if (ling_count) {
				ling_count--;
				this.department_minds += M;
				this.department_real_names += M.current.real_name;
			} else {
				break;
			}
		}
	}
	if (rt.len(f, this.department_minds)) return f.dot;
	log_game(`${this.type} has failed to find department staff, and has removed itself. the round will continue normally`);
	this.owner.objectives -= this;
	yield* qdel(this);
	return f.dot;
}, true);

// objective.dm:798
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/get_heads", function* get_heads(f: Frame) {
	let head: Value = null;
	this.department_minds = list();
	this.department_real_names = list();
	let needed_heads: Value = rand(this.min_lings, rt.len(f, GLOB.command_positions));
	needed_heads = min(rt.len(f, GLOB.SSticker.mode.changelings), needed_heads);
	let heads: Value = GLOB.SSticker.mode.get_living_heads();
	for (head of each(heads, T("/datum/mind"))) {
		if (rt.isIn(f, head, GLOB.SSticker.mode.changelings)) {
			continue;
		}
		if (needed_heads) {
			this.department_minds += head;
			this.department_real_names += head.current.real_name;
			needed_heads--;
		} else {
			break;
		}
	}
	if (rt.len(f, this.department_minds)) return f.dot;
	log_game(`${this.type} has failed to find department heads, and has removed itself. the round will continue normally`);
	this.owner.objectives -= this;
	yield* qdel(this);
	return f.dot;
}, true);

// objective.dm:827
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/New", function* New(f: Frame, text: Value) {
	yield* parent_proc();
	if (this.command_staff_only) {
		yield* this.get_heads();
	} else {
		yield* this.get_department_staff();
	}
	this.update_explanation_text();
	return f.dot;
}, true);

// objective.dm:837
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let M: Value = null, string: Value = null;
	parent_proc();
	if (!rt.len(f, this.department_real_names) || !rt.len(f, this.department_minds)) {
		this.explanation_text = "Free Objective";
		return f.dot;
	}
	if (this.command_staff_only) {
		this.explanation_text = "Ensure changelings impersonate and escape as the following heads of staff: ";
	} else {
		this.explanation_text = fmt("Ensure changelings impersonate and escape as the following members of ％！ department: ", [this.department_string]);
	}
	let first: Value = 1;
	for (M of each(this.department_minds, T("/datum/mind"))) {
		string = `${M.name} the ${M.assigned_role}`;
		if (!first) {
			string = `, ${M.name} the ${M.assigned_role}`;
		} else {
			first--;
		}
		this.explanation_text += string;
	}
	if (this.command_staff_only) {
		this.explanation_text += ", while the real heads are dead. This is a team objective.";
	} else {
		this.explanation_text += ", while the real members are dead. This is a team objective.";
	}
	return f.dot;
});

// objective.dm:863
rt.def("/datum/objective/changeling_team_objective/impersonate_department/proc/check_completion", function check_completion(f: Frame) {
	let M: Value = null, mloc: Value = null, changeling: Value = null, H: Value = null, cloc: Value = null, name: Value = null;
	let $e: any;
	if (!rt.len(f, this.department_real_names) || !rt.len(f, this.department_minds)) {
		return 1;
	}
	let check_names: Value = this.department_real_names.Copy();
	for (M of each(this.department_minds, T("/datum/mind"))) {
		if (rt.isIn(f, M, GLOB.SSticker.mode.changelings)) {
			continue;
		}
		if (M.current) {
			if ((mloc = rt.getStep(f, M.current, 0)).onCentcom() && M.current.stat != 2) {
				return 0;
			}
		}
	}
	let success: Value = 0;
	rt.forList(f, 0, GLOB.SSticker.mode.changelings, T("/datum/mind"));
	loop41: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		changeling = $e;
		if (success >= rt.len(f, this.department_minds)) {
			return 1;
		}
		if (rt.istype(changeling.current, T("/mob/living/carbon/human"))) {
			H = changeling.current;
			if ((cloc = rt.getStep(f, changeling.current, 0)) && cloc.onCentcom() && changeling.current.stat != 2) {
				name = null;
				for (name of each(check_names)) {
					if (H.dna.real_name == name) {
						check_names -= name;
						success++;
						continue loop41;
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (success >= rt.len(f, this.department_minds)) {
		return 1;
	}
	return 0;
});
