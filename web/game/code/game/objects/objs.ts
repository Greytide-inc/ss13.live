// Based on /tg/station's code/game/objects/objs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// objs.dm:31
rt.def("/obj/proc/vv_edit_var", function* vv_edit_var(f: Frame, vname: Value, vval: Value) {
	let O: Value = null;
	if (vname === "dangerous_possession") {
		return 0;
	} else if (vname === "control_object") {
		if (rt.istype((O = vval), T("/obj")) && O.dangerous_possession) {
			return 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// objs.dm:41
rt.def("/obj/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	if (!this.armor) {
		this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	}
	if (!(this.on_blueprints && isturf(this.loc))) return f.dot;
	let _T: Value = this.loc;
	if (this.force_blueprints) {
		_T.add_blueprints(this);
	} else {
		_T.add_blueprints_preround(this);
	}
	return f.dot;
});

// objs.dm:52
rt.def("/obj/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (!rt.istype(this, T("/obj/machinery"))) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	yield* GLOB.SStgui.close_uis(this);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["force"] });

// objs.dm:58
rt.def("/obj/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	yield* parent_proc();
	if (!(this.secondary_flags ? rt.index(this.secondary_flags, "frozen") : 0)) return f.dot;
	this.visible_message(`<span class='danger'>${this} shatters into a million pieces!</span>`);
	yield* qdel(this);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// objs.dm:65
rt.def("/obj/proc/assume_air", function* assume_air(f: Frame, giver: Value) {
	if (this.loc) {
		return (yield* this.loc.assume_air(giver));
	}
	return null;
}, true);

// objs.dm:71
rt.def("/obj/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	if (this.loc) {
		return (yield* this.loc.remove_air(amount));
	}
	return null;
}, true);

// objs.dm:77
rt.def("/obj/proc/return_air", function return_air(f: Frame) {
	if (this.loc) {
		return this.loc.return_air();
	}
	return null;
});

// objs.dm:87
rt.def("/obj/proc/handle_internal_lifeform", function* handle_internal_lifeform(f: Frame, lifeform_inside_me: Value, breath_request: Value) {
	let environment: Value = null, breath_percentage: Value = null;
	if (breath_request > 0) {
		environment = this.return_air();
		breath_percentage = BREATH_VOLUME / environment.return_volume();
		return (yield* this.remove_air(environment.total_moles() * breath_percentage));
	} else {
		return null;
	}
}, true);

// objs.dm:97
rt.def("/obj/proc/updateUsrDialog", function* updateUsrDialog(f: Frame) {
	let M: Value = null, H: Value = null;
	if (!this.in_use) return f.dot;
	let is_in_use: Value = 0;
	let nearby: Value = viewers(1, this);
	for (M of each(nearby, T("/mob"))) {
		if (M.client && M.machine == this) {
			is_in_use = 1;
			yield* this.attack_hand(M);
		}
	}
	if (rt.istype(f.usr, T("/mob/living/silicon/ai")) || rt.istype(f.usr, T("/mob/living/silicon/robot")) || IsAdminGhost(f.usr)) {
		if (!rt.isIn(f, f.usr, nearby)) {
			if (f.usr.client && f.usr.machine == this) {
				is_in_use = 1;
				yield* this.attack_ai(f.usr);
			}
		}
	}
	if (rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		H = f.usr;
		if (!rt.isIn(f, f.usr, nearby)) {
			if (f.usr.client && f.usr.machine == this) {
				if (H.dna.check_mutation("Telekinesis")) {
					is_in_use = 1;
					yield* this.attack_hand(f.usr);
				}
			}
		}
	}
	this.in_use = is_in_use;
	return f.dot;
}, true);

// objs.dm:122
rt.def("/obj/proc/updateDialog", function* updateDialog(f: Frame) {
	let M: Value = null, ai_in_use: Value = null;
	if (!this.in_use) return f.dot;
	let nearby: Value = viewers(1, this);
	let is_in_use: Value = 0;
	for (M of each(nearby, T("/mob"))) {
		if (M.client && M.machine == this) {
			is_in_use = 1;
			yield* this.interact(M);
		}
	}
	if (!(!(ai_in_use = (yield* AutoUpdateAI(this))) && !is_in_use)) return f.dot;
	this.in_use = 0;
	return f.dot;
}, true);

// objs.dm:135
rt.def("/obj/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if ((yield* this.ui_interact(user)) != -1) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// objs.dm:147
rt.def("/mob/proc/unset_machine", function* unset_machine(f: Frame) {
	if (!this.machine) return f.dot;
	yield* this.machine.on_unset_machine(this);
	this.machine = null;
	return f.dot;
}, true);

// objs.dm:155
rt.def("/mob/proc/set_machine", function* set_machine(f: Frame, O: Value) {
	if (this.machine) {
		yield* this.unset_machine();
	}
	this.machine = O;
	if (!rt.istype(O, T("/obj"))) return f.dot;
	O.in_use = 1;
	return f.dot;
}, true);

// objs.dm:163
rt.def("/obj/item/proc/updateSelfDialog", function* updateSelfDialog(f: Frame) {
	let M: Value = null;
	if (!(rt.istype((M = this.loc), T("/mob")) && M.client && M.machine == this)) return f.dot;
	yield* this.attack_self(M);
	return f.dot;
}, true);

// objs.dm:170
rt.def("/obj/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(!this.anchored || current_size >= STAGE_FIVE)) return f.dot;
	yield* step_towards(this, S);
	return f.dot;
}, true);

// objs.dm:174
rt.def("/obj/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// objs.dm:177
rt.def("/obj/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let _T: Value = null;
	return (yield* (_T = rt.getStep(f, this, 0)).storage_contents_dump_act(src_object, user));
}, true);

// objs.dm:181
rt.def("/obj/proc/CanAStarPass", function CanAStarPass(f: Frame) {
	f.dot = (!this.density ? 1 : 0);
	return f.dot;
});

// objs.dm:193
rt.def("/obj/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = parent_proc();
	rt.setAt(f.dot, "Delete all of type", fmt("?_src_=vars;delall=＃", [this]));
	return f.dot;
});

// objs.dm:197
rt.def("/obj/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.unique_rename) {
		to_chat(user, "<span class='notice'>Use a pen on it to rename it or change its description.</span>");
	}
	if (!(this.unique_reskin && !this.current_skin)) return f.dot;
	to_chat(user, "<span class='notice'>Alt-click it to reskin it.</span>");
	return f.dot;
}, false);

// objs.dm:204
rt.def("/obj/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(this.unique_reskin && !this.current_skin && get_dist(user, this) <= 1)) return f.dot;
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	yield* this.reskin_obj(user);
	return f.dot;
}, true);

// objs.dm:212
rt.def("/obj/proc/reskin_obj", function* reskin_obj(f: Frame, M: Value) {
	if (!rt.length(this.unique_reskin)) {
		return f.dot;
	}
	let choice: Value = (yield* g.op(f, "Prompt", [1], [null, "Reskin Object", `Warning, you can only reskin ${this} once!`, M, this.unique_reskin]));
	if (!(!(!this || this.gc_destroyed) && choice && !this.current_skin && !M.incapacitated() && get_dist(M, this) <= 1)) return f.dot;
	if (!rt.index(this.unique_reskin, choice)) {
		return f.dot;
	}
	this.current_skin = choice;
	this.icon_state = rt.index(this.unique_reskin, choice);
	to_chat(M, `${this} is now skinned as '${choice}.'`);
	return f.dot;
}, true);
