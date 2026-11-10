// Based on /tg/station's code/modules/surgery/dental_implant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(1313, "/datum/surgery/dental_implant", "/datum/surgery", {
	name: "dental implant",
	steps: null,
	possible_locs: null,
});

// dental_implant.dm:3
rt.def("/datum/surgery/dental_implant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/drill"), T("/datum/surgery_step/insert_pill"));

	this.possible_locs = list("mouth");
	return f.dot;
});

rt.type(1332, "/datum/surgery_step/insert_pill", "/datum/surgery_step", {
	name: "insert pill",
	implements: null,
	time: 16,
});

// dental_implant.dm:8
rt.def("/datum/surgery_step/insert_pill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill"), 100]);
	return f.dot;
});

// dental_implant.dm:12
rt.def("/datum/surgery_step/insert_pill/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(fmt("＀ begins to wedge ％！ in ＀'s ＀.", [user, tool, target, parse_zone(target_zone)]), `<span class='notice'>You begin to wedge ${tool} in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// dental_implant.dm:15
rt.def("/datum/surgery_step/insert_pill/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let _P: Value = null;
	if (!rt.istype(tool, T("/obj/item/weapon/reagent_containers/pill"))) {
		return 0;
	}
	yield* user.drop_item();
	tool.loc = target;
	(_P = (yield* new_(T("/datum/action/item_action/hands_free/activate_pill"), tool))).button.name = `Activate ${tool.name}`;
	_P.target = tool;
	yield* _P.Grant(target);
	user.visible_message(fmt("＀ wedges ％！ into ＀'s ＀!", [user, tool, target, parse_zone(target_zone)]), `<span class='notice'>You wedge ${tool} into ${target}'s ${parse_zone(target_zone)}.</span>`);
	return 1;
}, true);

rt.type(213, "/datum/action/item_action/hands_free/activate_pill", "/datum/action/item_action/hands_free", {
	name: "Activate Pill",
});

// dental_implant.dm:33
rt.def("/datum/action/item_action/hands_free/activate_pill/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	to_chat(this.owner, `<span class='caution'>You grit your teeth and burst the implanted ${this.target.name}!</span>`);
	add_logs(this.owner, null, "swallowed an implanted pill", this.target);
	if (this.target.reagents.total_volume) {
		yield* this.target.reagents.reaction(this.owner, INGEST);
		yield* this.target.reagents.trans_to(this.owner, this.target.reagents.total_volume);
	}
	yield* qdel(this.target);
	return 1;
}, true);
