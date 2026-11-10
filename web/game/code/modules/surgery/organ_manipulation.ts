// Based on /tg/station's code/modules/surgery/organ_manipulation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(1318, "/datum/surgery/organ_manipulation", "/datum/surgery", {
	name: "organ manipulation",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	requires_real_bodypart: 1,
	species: null,
});

// organ_manipulation.dm:3
rt.def("/datum/surgery/organ_manipulation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/manipulate_organs"));
	this.possible_locs = list("chest", "head");

	this.species = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

rt.type(1319, "/datum/surgery/organ_manipulation/soft", "/datum/surgery/organ_manipulation", {
	possible_locs: null,
	steps: null,
});

// organ_manipulation.dm:12
rt.def("/datum/surgery/organ_manipulation/soft/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_locs = list("groin", "eyes", "mouth", "l_arm", "r_arm");

	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/manipulate_organs"));
	return f.dot;
});

rt.type(1320, "/datum/surgery/organ_manipulation/alien", "/datum/surgery/organ_manipulation", {
	name: "alien organ manipulation",
	possible_locs: null,
	steps: null,
	species: null,
});

// organ_manipulation.dm:19
rt.def("/datum/surgery/organ_manipulation/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_locs = list("chest", "head", "groin", "eyes", "mouth", "l_arm", "r_arm");

	this.steps = list(T("/datum/surgery_step/saw"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/manipulate_organs"));

	this.species = list(T("/mob/living/carbon/alien/humanoid"));
	return f.dot;
});

rt.type(1345, "/datum/surgery_step/manipulate_organs", "/datum/surgery_step", {
	current_type: null,
	I: null,
	implements_extract: null,
	implements_mend: null,
	time: 64,
	name: "manipulate organs",
	implements: null,
});

// organ_manipulation.dm:27
rt.def("/datum/surgery_step/manipulate_organs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/organ"), 100, T("/obj/item/weapon/reagent_containers/food/snacks/organ"), 0, T("/obj/item/weapon/organ_storage"), 100]);

	this.implements_extract = rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/crowbar"), 55]);

	this.implements_mend = rt.alist(f, [T("/obj/item/weapon/cautery"), 100, T("/obj/item/weapon/weldingtool"), 70, T("/obj/item/weapon/lighter"), 45, T("/obj/item/weapon/match"), 20]);
	return f.dot;
});

// organ_manipulation.dm:34
rt.def("/datum/surgery_step/manipulate_organs/proc/New", function New(f: Frame) {
	parent_proc();
	this.implements = this.implements + this.implements_extract + this.implements_mend;
	return f.dot;
});

// organ_manipulation.dm:38
rt.def("/datum/surgery_step/manipulate_organs/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	let WT: Value = null, L: Value = null, M: Value = null;
	if (rt.istype(tool, T("/obj/item/weapon/weldingtool"))) {
		if (!(WT = tool).isOn()) {
			return 0;
		}
	} else if (rt.istype(tool, T("/obj/item/weapon/lighter"))) {
		if (!(L = tool).lit) {
			return 0;
		}
	} else if (rt.istype(tool, T("/obj/item/weapon/match"))) {
		if (!(M = tool).lit) {
			return 0;
		}
	}
	return 1;
});

// organ_manipulation.dm:58
rt.def("/datum/surgery_step/manipulate_organs/proc/preop", function* preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let organs: Value = null, O: Value = null;
	this.I = null;
	if (rt.istype(tool, T("/obj/item/weapon/organ_storage"))) {
		if (!rt.len(f, tool.contents)) {
			to_chat(user, `<span class='notice'>There is nothing inside ${tool}!</span>`);
			return -1;
		}
		this.I = rt.index(tool.contents, 1);
		if (!rt.istype(this.I, T("/obj/item/organ"))) {
			to_chat(user, `<span class='notice'>You cannot put ${this.I} into ${target}'s ${parse_zone(target_zone)}!</span>`);
			return -1;
		}
		tool = this.I;
	}
	if (rt.istype(tool, T("/obj/item/organ"))) {
		this.current_type = "insert";
		this.I = tool;
		if (target_zone != this.I.zone || target.getorganslot(this.I.slot)) {
			to_chat(user, `<span class='notice'>There is no room for ${this.I} in ${target}'s ${parse_zone(target_zone)}!</span>`);
			return -1;
		}
		user.visible_message(`${user} begins to insert ${tool} into ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to insert ${tool} into ${target}'s ${parse_zone(target_zone)}...</span>`);
	} else if (rt.isIn(f, this.implement_type, this.implements_extract)) {
		this.current_type = "extract";
		if (!rt.len(f, (organs = target.getorganszone(target_zone)))) {
			to_chat(user, `<span class='notice'>There are no removeable organs in ${target}'s ${parse_zone(target_zone)}!</span>`);
			return -1;
		} else {
			for (O of each(organs, T("/obj/item/organ"))) {
				yield* O.on_find(user);
				organs -= O;
				rt.setAt(organs, O.name, O);
			}
			this.I = (yield* g.op(f, "Prompt", [1], [null, null, "Surgery", "Remove which organ?", organs]));
			if (this.I && user && target && user.Adjacent(target) && user.get_active_held_item() == tool) {
				this.I = rt.index(organs, this.I);
				if (!this.I) {
					return -1;
				}
				user.visible_message(`${user} begins to extract ${this.I} from ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to extract ${this.I} from ${target}'s ${parse_zone(target_zone)}...</span>`);
			} else {
				return -1;
			}
		}
	} else if (rt.isIn(f, this.implement_type, this.implements_mend)) {
		this.current_type = "mend";
		user.visible_message(`${user} begins to mend the incision in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to mend the incision in ${target}'s ${parse_zone(target_zone)}...</span>`);
	} else {
		if (!rt.istype(tool, T("/obj/item/weapon/reagent_containers/food/snacks/organ"))) return f.dot;
		to_chat(user, `<span class='warning'>${tool} was bitten by someone! It's too damaged to use!</span>`);
		return -1;
	}
	return f.dot;
}, true);

// organ_manipulation.dm:108
rt.def("/datum/surgery_step/manipulate_organs/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (this.current_type == "mend") {
		user.visible_message(`${user} mends the incision in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You mend the incision in ${target}'s ${parse_zone(target_zone)}.</span>`);
		if (rt.locateIn(f, T("/datum/surgery_step/saw"), surgery.steps)) {
			yield* target.heal_bodypart_damage(45, 0);
		}
		return 1;
	} else if (this.current_type == "insert") {
		if (rt.istype(tool, T("/obj/item/weapon/organ_storage"))) {
			this.I = rt.index(tool.contents, 1);
			tool.icon_state = "evidenceobj";
			tool.desc = "A container for holding body parts.";
			tool.cut_overlays();
			tool = this.I;
		} else {
			this.I = tool;
		}
		yield* user.drop_item();
		yield* this.I.Insert(target);
		user.visible_message(`${user} inserts ${tool} into ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You insert ${tool} into ${target}'s ${parse_zone(target_zone)}.</span>`);
	} else if (this.current_type == "extract") {
		if (this.I && this.I.owner == target) {
			user.visible_message(`${user} successfully extracts ${this.I} from ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You successfully extract ${this.I} from ${target}'s ${parse_zone(target_zone)}.</span>`);
			yield* add_logs(user, target, `surgically removed ${this.I.name} from`, { addition: `INTENT: ${uppertext(user.a_intent)}` });
			yield* this.I.Remove(target);
			this.I.loc = rt.getStep(f, target, 0);
		} else {
			user.visible_message(`${user} can't seem to extract anything from ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You can't extract anything from ${target}'s ${parse_zone(target_zone)}!</span>`);
		}
	}
	return 0;
}, true);
