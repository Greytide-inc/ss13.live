// Based on /tg/station's code/modules/assembly/health.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9375, "/obj/item/device/assembly/health", "/obj/item/device/assembly", {
	scanning: 0,
	health_scan: null,
	alarm_health: 0,
	attachable: 1,
	secured: 0,
	name: "health sensor",
	desc: "Used for scanning and monitoring health.",
	icon_state: "health",
	materials: null,
	origin_tech: "magnets=1;biotech=1",
});

// health.dm:5
rt.def("/obj/item/device/assembly/health/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 800, "$glass", 200]);
	return f.dot;
});

// health.dm:15
rt.def("/obj/item/device/assembly/health/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Use a multitool to swap between \"detect death\" mode and \"detect critical state\" mode.</span>");
	return f.dot;
}, false);

// health.dm:19
rt.def("/obj/item/device/assembly/health/proc/activate", function activate(f: Frame) {
	if (!parent_proc()) {
		return 0;
	}
	this.toggle_scan();
	return 0;
});

// health.dm:25
rt.def("/obj/item/device/assembly/health/proc/toggle_secure", function toggle_secure(f: Frame) {
	this.secured = (!this.secured ? 1 : 0);
	if (this.secured && this.scanning) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.scanning = 0;
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	this.update_icon();
	return this.secured;
});

// health.dm:35
rt.def("/obj/item/device/assembly/health/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (this.alarm_health == 0) {
			this.alarm_health = -90;
			user.show_message(`You toggle ${this} to "detect death" mode.`);
		} else {
			this.alarm_health = 0;
			user.show_message(`You toggle ${this} to "detect critical state" mode.`);
		}
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// health.dm:47
rt.def("/obj/item/device/assembly/health/proc/process", function* process(f: Frame) {
	let M: Value = null;
	if (!this.scanning || !this.secured) {
		return f.dot;
	}
	let A: Value = this;
	if (this.connected && this.connected.holder) {
		A = this.connected.holder;
	}
	A;
	while (A && !ismob(A)) {
		A = A.loc;
	}
	if (M = A) {
		this.health_scan = M.health;
		if (this.health_scan <= this.alarm_health) {
			yield* this.pulse();
			this.audible_message(`${bicon(this)} *beep* *beep*`, "*beep* *beep*");
			yield* this.toggle_scan();
		}
		return f.dot;
	}
	return f.dot;
}, true, { waitfor: false });

// health.dm:68
rt.def("/obj/item/device/assembly/health/proc/toggle_scan", function toggle_scan(f: Frame) {
	if (!this.secured) {
		return 0;
	}
	this.scanning = (!this.scanning ? 1 : 0);
	if (this.scanning) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return f.dot;
});

// health.dm:78
rt.def("/obj/item/device/assembly/health/proc/interact", function interact(f: Frame, user: Value) {
	if (!this.secured) {
		user.show_message(`<span class='warning'>The ${this.name} is unsecured!</span>`);
		return 0;
	}
	let $0: any = this;
	let dat: Value = fmt("<TT><B>Health Sensor</B> <A href='?src=＃;scanning=1'>＀</A>", [$0, this.scanning ? "On" : "Off"]);
	if (this.scanning && this.health_scan) {
		dat += `<BR>Health: ${this.health_scan}`;
	}
	rt.op(f, "Browse", [], [user, dat, "window=hscan"], false);
	onclose(user, "hscan");
	return f.dot;
});

// health.dm:90
rt.def("/obj/item/device/assembly/health/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let user: Value = null;
	yield* parent_proc();
	if (!ismob(f.usr)) {
		return f.dot;
	}
	if (!(user = f.usr).canUseTopic(this)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=hscan"], false);
		onclose(f.usr, "hscan");
		return f.dot;
	}
	if (rt.at(href_list, "scanning")) {
		yield* this.toggle_scan();
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=hscan"], false);
		return f.dot;
	}
	yield* this.attack_self(user);
	return f.dot;
}, true);
