// Based on /tg/station's code/game/machinery/transformer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10855, "/obj/machinery/transformer", "/obj/machinery", {
	transform_dead: 0,
	transform_standing: 0,
	cooldown_duration: 600,
	cooldown: 0,
	cooldown_timer: null,
	robot_cell_charge: 5000,
	countdown: null,
	masterAI: null,
	anchored: 1,
	name: "１Automatic Robotic Factory 5000",
	desc: "A large metallic machine with an entrance and an exit. A sign on the side reads, 'human go in, robot come out'. The human must be lying down and alive. Has to cooldown between each use.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "separator-AO1",
	layer: 4.5,
	density: 0,
});

// transformer.dm:22
rt.def("/obj/machinery/transformer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/machinery/conveyor/auto"), rt.locate(this.x - 1, this.y, this.z), 8);
	yield* new_(T("/obj/machinery/conveyor/auto"), this.loc, 8);
	yield* new_(T("/obj/machinery/conveyor/auto"), rt.locate(this.x + 1, this.y, this.z), 8);
	this.countdown = (yield* new_(T("/obj/effect/countdown/transformer"), this));
	yield* this.countdown.start();
	return f.dot;
}, true);

// transformer.dm:30
rt.def("/obj/machinery/transformer/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (!(this.cooldown && (rt.istype(user, T("/mob/living/silicon")) || rt.istype(user, T("/mob/dead/observer"))))) return f.dot;
	let seconds_remaining: Value = (this.cooldown_timer - rt.worldTime(f)) / 10;
	to_chat(user, `It will be ready in ${max(0, seconds_remaining)} seconds.`);
	return f.dot;
}, false);

// transformer.dm:37
rt.def("/obj/machinery/transformer/proc/Destroy", function* Destroy(f: Frame) {
	if (this.countdown) {
		yield* qdel(this.countdown);
	}
	this.countdown = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// transformer.dm:42
rt.def("/obj/machinery/transformer/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// transformer.dm:46
rt.def("/obj/machinery/transformer/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 3) || this.cooldown == 1) {
		this.icon_state = "separator-AO0";
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// transformer.dm:53
rt.def("/obj/machinery/transformer/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	if (this.cooldown == 1) {
		return f.dot;
	}
	if (!rt.istype(AM, T("/mob/living/carbon/human"))) return f.dot;
	let move_dir: Value = rt.getDir(f, this.loc, AM.loc);
	let H: Value = AM;
	if (!((this.transform_standing || H.lying) && move_dir == 4)) return f.dot;
	AM.loc = this.loc;
	yield* this.do_transform(AM);
	return f.dot;
}, true);

// transformer.dm:68
rt.def("/obj/machinery/transformer/proc/CanPass", function CanPass(f: Frame) {
	let dir: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!rt.istype(f.args[0], T("/mob/living/carbon/human"))) {
		if ((dir = rt.getDir(f, this, f.args[0])) == 4) {
			return parent_proc();
		}
	}
	return 0;
}, false, { args: ["mover", "target", "height"] });

// transformer.dm:75
rt.def("/obj/machinery/transformer/proc/process", function process(f: Frame) {
	if (!(this.cooldown && this.cooldown_timer <= rt.worldTime(f))) return f.dot;
	this.cooldown = 0;
	this.update_icon();
	return f.dot;
}, false, { waitfor: false });

// transformer.dm:80
rt.def("/obj/machinery/transformer/proc/do_transform", function* do_transform(f: Frame, H: Value) {
	let R: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.cooldown == 1) {
		return f.dot;
	}
	if (!this.transform_dead && H.stat == 2) {
		playsound(this.loc, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0);
		return f.dot;
	}
	this.cooldown = 1;
	this.cooldown_timer = rt.worldTime(f) + this.cooldown_duration;
	yield* this.update_icon();
	playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 50, 1);
	yield* H.emote("scream");
	yield* H.adjustBruteLoss(max(0, 80 - H.getBruteLoss()));
	yield* sleep(5);
	yield* this.use_power(5000);
	(R = (yield* H.Robotize())).cell.maxcharge = this.robot_cell_charge;
	R.cell.charge = this.robot_cell_charge;
	yield* R.SetLockdown();
	if (this.masterAI) {
		R.connected_ai = this.masterAI;
		yield* R.lawsync();
		R.lawupdate = 1;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/transformer/proc/unlock_new_robot"), R)), 50);
	return f.dot;
}, true);

// transformer.dm:116
rt.def("/obj/machinery/transformer/proc/unlock_new_robot", function* unlock_new_robot(f: Frame, R: Value) {
	playsound(this.loc, rt.rsc("sound/machines/ping.ogg"), 50, 0);
	yield* sleep(30);
	if (!R) return f.dot;
	yield* R.SetLockdown(0);
	R.notify_ai(NEW_BORG);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/silicon/robot" }] });
