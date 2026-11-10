// Based on /tg/station's code/modules/surgery/implant_removal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1315, "/datum/surgery/implant_removal", "/datum/surgery", {
	name: "implant removal",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	species: null,
});

// implant_removal.dm:3
rt.def("/datum/surgery/implant_removal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/extract_implant"), T("/datum/surgery_step/close"));

	this.possible_locs = list("chest");

	this.species = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

rt.type(1340, "/datum/surgery_step/extract_implant", "/datum/surgery_step", {
	I: null,
	name: "extract implant",
	implements: null,
	time: 64,
});

// implant_removal.dm:12
rt.def("/datum/surgery_step/extract_implant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/crowbar"), 65]);
	return f.dot;
});

// implant_removal.dm:17
rt.def("/datum/surgery_step/extract_implant/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let O: Value = null;
	let $e: any;
	rt.forList(f, 0, target.implants, T("/obj/item"));
	if (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		this.I = O;
	}
	rt.endFor(f, 0);
	if (this.I) {
		user.visible_message(`${user} begins to extract ${this.I} from ${target}'s ${target_zone}.`, `<span class='notice'>You begin to extract ${this.I} from ${target}'s ${target_zone}...</span>`);
	} else {
		user.visible_message(`${user} looks for an implant in ${target}'s ${target_zone}.`, `<span class='notice'>You look for an implant in ${target}'s ${target_zone}...</span>`);
	}
	return f.dot;
});

// implant_removal.dm:27
rt.def("/datum/surgery_step/extract_implant/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let _case: Value = null, ic: Value = null;
	let $e: any;
	if (this.I) {
		user.visible_message(`${user} successfully removes ${this.I} from ${target}'s ${target_zone}!`, `<span class='notice'>You successfully remove ${this.I} from ${target}'s ${target_zone}.</span>`);
		yield* this.I.removed(target);
		rt.forList(f, 0, user.held_items, T("/obj/item/weapon/implantcase"));
		if (($e = rt.next(f, 0)) !== undefined) {
			ic = $e;
			_case = ic;
		}
		rt.endFor(f, 0);
		if (!_case) {
			_case = rt.locateIn(f, T("/obj/item/weapon/implantcase"), rt.getStep(f, target, 0));
		}
		if (_case && !_case.imp) {
			_case.imp = this.I;
			this.I.loc = _case;
			yield* _case.update_icon();
			user.visible_message(`${user} places ${this.I} into ${_case}!`, `<span class='notice'>You place ${this.I} into ${_case}.</span>`);
		} else {
			yield* qdel(this.I);
		}
	} else {
		to_chat(user, `<span class='warning'>You can't find anything in ${target}'s ${target_zone}!</span>`);
	}
	return 1;
}, true);
