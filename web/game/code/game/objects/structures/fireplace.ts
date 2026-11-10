// Based on /tg/station's code/game/objects/structures/fireplace.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12750, "/obj/structure/fireplace", "/obj/structure", {
	lit: 0,
	fuel_added: 0,
	flame_expiry_timer: null,
	anchored: 1,
	name: "fireplace",
	desc: "A large stone brick fireplace.",
	icon: rt.rsc("icons/obj/fireplace.dmi"),
	icon_state: "fireplace",
	density: 0,
	pixel_x: -16,
	resistance_flags: 2,
});

// fireplace.dm:20
rt.def("/obj/structure/fireplace/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// fireplace.dm:24
rt.def("/obj/structure/fireplace/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// fireplace.dm:29
rt.def("/obj/structure/fireplace/proc/try_light", function* try_light(f: Frame, O: Value, user: Value) {
	let msg: Value = null;
	if (this.lit) {
		to_chat(user, "<span class='warning'>It's already lit!</span>");
		return 0;
	}
	if (!this.fuel_added) {
		to_chat(user, `<span class='warning'>${this} needs some fuel to burn!</span>`);
		return 0;
	}
	if (!(msg = (yield* O.ignition_effect(this, user)))) return f.dot;
	this.visible_message(msg);
	yield* this.ignite();
	return 1;
}, true);

// fireplace.dm:41
rt.def("/obj/structure/fireplace/proc/attackby", function* attackby(f: Frame) {
	let wood: Value = null, space_remaining: Value = null, space_for_logs: Value = null, logs_used: Value = null, paper_bin: Value = null;
	if (rt.istype(f.args[0], T("/obj/item/stack/sheet/mineral/wood"))) {
		wood = f.args[0];
		space_remaining = MAXIMUM_BURN_TIMER - this.burn_time_remaining();
		if ((space_for_logs = round(space_remaining / LOG_BURN_TIMER)) < 1) {
			to_chat(f.args[1], `<span class='warning'>You can't fit any more of ${f.args[0]} in ${this}!</span>`);
			return f.dot;
		}
		logs_used = min(space_for_logs, wood.amount);
		yield* wood.use(logs_used);
		this.adjust_fuel_timer(LOG_BURN_TIMER * logs_used);
		f.args[1].visible_message(`<span class='notice'>${f.args[1]} tosses some wood into ${this}.</span>`, `<span class='notice'>You add some fuel to ${this}.</span>`);
	} else if (rt.istype(f.args[0], T("/obj/item/weapon/paper_bin"))) {
		paper_bin = f.args[0];
		f.args[1].visible_message(`<span class='notice'>${f.args[1]} throws ${f.args[0]} into ${this}.</span>`, `<span class='notice'>You add ${f.args[0]} to ${this}.</span>`);
		this.adjust_fuel_timer(PAPER_BURN_TIMER * paper_bin.total_paper);
		yield* qdel(paper_bin);
	} else if (rt.istype(f.args[0], T("/obj/item/weapon/paper"))) {
		f.args[1].visible_message(`<span class='notice'>${f.args[1]} throws ${f.args[0]} into ${this}.</span>`, `<span class='notice'>You throw ${f.args[0]} into ${this}.</span>`);
		this.adjust_fuel_timer(PAPER_BURN_TIMER);
		yield* qdel(f.args[0]);
	} else if (yield* this.try_light(f.args[0], f.args[1])) {
		return f.dot;
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["T", "user"] });

// fireplace.dm:73
rt.def("/obj/structure/fireplace/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.lit) return f.dot;
	const burn_time_remaining = this.burn_time_remaining();
	if (rt.inRange(burn_time_remaining, 0, 500)) {
		this.add_overlay("fireplace_fire0");
	} else if (rt.inRange(burn_time_remaining, 500, 1000)) {
		this.add_overlay("fireplace_fire1");
	} else if (rt.inRange(burn_time_remaining, 1000, 1500)) {
		this.add_overlay("fireplace_fire2");
	} else if (rt.inRange(burn_time_remaining, 1500, 2000)) {
		this.add_overlay("fireplace_fire3");
	} else if (rt.inRange(burn_time_remaining, 2000, MAXIMUM_BURN_TIMER)) {
		this.add_overlay("fireplace_fire4");
	}
	this.add_overlay("fireplace_glow");
	return f.dot;
});

// fireplace.dm:89
rt.def("/obj/structure/fireplace/proc/adjust_light", function adjust_light(f: Frame) {
	if (!this.lit) {
		this.set_light(0);
		return f.dot;
	}
	const burn_time_remaining = this.burn_time_remaining();
	if (rt.inRange(burn_time_remaining, 0, 500)) {
		this.set_light(1);
	} else if (rt.inRange(burn_time_remaining, 500, 1000)) {
		this.set_light(2);
	} else if (rt.inRange(burn_time_remaining, 1000, 1500)) {
		this.set_light(3);
	} else if (rt.inRange(burn_time_remaining, 1500, 2000)) {
		this.set_light(4);
	} else if (rt.inRange(burn_time_remaining, 2000, MAXIMUM_BURN_TIMER)) {
		this.set_light(6);
	}
	return f.dot;
});

// fireplace.dm:106
rt.def("/obj/structure/fireplace/proc/process", function* process(f: Frame) {
	let _T: Value = null;
	if (!this.lit) {
		return f.dot;
	}
	if (rt.worldTime(f) > this.flame_expiry_timer) {
		this.put_out();
		return f.dot;
	}
	playsound(this, rt.rsc("sound/effects/comfyfire.ogg"), 50, 0, 0, 1);
	yield* (_T = rt.getStep(f, this, 0)).hotspot_expose(700, 5);
	yield* this.update_icon();
	this.adjust_light();
	return f.dot;
}, true, { waitfor: false });

// fireplace.dm:120
rt.def("/obj/structure/fireplace/proc/extinguish", function extinguish(f: Frame) {
	let fuel: Value = null;
	if (this.lit) {
		fuel = this.burn_time_remaining();
		this.flame_expiry_timer = 0;
		this.put_out();
		this.adjust_fuel_timer(fuel);
	}
	f.dot = parent_proc();
	return f.dot;
});

// fireplace.dm:128
rt.def("/obj/structure/fireplace/proc/adjust_fuel_timer", function adjust_fuel_timer(f: Frame, amount: Value) {
	if (this.lit) {
		this.flame_expiry_timer += amount;
		if (this.burn_time_remaining() < 3000) {
			this.flame_expiry_timer = rt.worldTime(f) + 3000;
		}
	} else {
		this.fuel_added = max(0, min(this.fuel_added + amount, 3000));
	}
	return f.dot;
});

// fireplace.dm:136
rt.def("/obj/structure/fireplace/proc/burn_time_remaining", function burn_time_remaining(f: Frame) {
	if (this.lit) {
		return max(0, this.flame_expiry_timer - rt.worldTime(f));
	}
	return max(0, this.fuel_added);
});

// fireplace.dm:142
rt.def("/obj/structure/fireplace/proc/ignite", function ignite(f: Frame) {
	this.lit = 1;
	this.desc = "A large stone brick fireplace, warm and cozy.";
	this.flame_expiry_timer = rt.worldTime(f) + this.fuel_added;
	this.fuel_added = 0;
	this.update_icon();
	this.adjust_light();
	return f.dot;
});

// fireplace.dm:150
rt.def("/obj/structure/fireplace/proc/put_out", function put_out(f: Frame) {
	this.lit = 0;
	this.update_icon();
	this.adjust_light();
	this.desc = rt.initial(f, this, "desc");
	return f.dot;
});
