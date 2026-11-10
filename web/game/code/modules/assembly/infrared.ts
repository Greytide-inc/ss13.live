// Based on /tg/station's code/modules/assembly/infrared.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9376, "/obj/item/device/assembly/infra", "/obj/item/device/assembly", {
	on: 0,
	visible: 0,
	first: null,
	last: null,
	name: "infrared emitter",
	desc: "Emits a visible or invisible beam and is triggered when the beam is interrupted.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon_state: "infrared",
	materials: null,
	origin_tech: "magnets=2;materials=2",
});

// infrared.dm:5
rt.def("/obj/item/device/assembly/infra/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1000, "$glass", 500]);
	return f.dot;
});

// infrared.dm:15
rt.def("/obj/item/device/assembly/infra/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// infrared.dm:20
rt.def("/obj/item/device/assembly/infra/proc/Destroy", function* Destroy(f: Frame) {
	if (this.first) {
		yield* qdel(this.first);
	}
	return (yield* parent_proc());
}, true);

// infrared.dm:24
rt.def("/obj/item/device/assembly/infra/proc/describe", function describe(f: Frame) {
	return `The infrared trigger is ${this.on ? "on" : "off"}.`;
});

// infrared.dm:27
rt.def("/obj/item/device/assembly/infra/proc/activate", function* activate(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	this.on = (!this.on ? 1 : 0);
	yield* this.update_icon();
	return 1;
}, true);

// infrared.dm:34
rt.def("/obj/item/device/assembly/infra/proc/toggle_secure", function* toggle_secure(f: Frame) {
	this.secured = (!this.secured ? 1 : 0);
	if (this.secured) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.on = 0;
		if (this.first) {
			yield* qdel(this.first);
		}
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	yield* this.update_icon();
	return this.secured;
}, true);

// infrared.dm:46
rt.def("/obj/item/device/assembly/infra/proc/update_icon", function* update_icon(f: Frame) {
	this.cut_overlays();
	this.attached_overlays = list();
	if (this.on) {
		this.add_overlay("infrared_on");
		this.attached_overlays += "infrared_on";
	}
	if (this.holder) {
		yield* this.holder.update_icon();
	}
	return f.dot;
}, true);

// infrared.dm:57
rt.def("/obj/item/device/assembly/infra/proc/process", function* process(f: Frame) {
	let _T: Value = null, I: Value = null;
	if (!this.on) {
		if (this.first) {
			yield* qdel(this.first);
		}
		return f.dot;
	}
	if (!this.secured) {
		return f.dot;
	}
	if (this.first && this.last) {
		yield* this.last.process();
		return f.dot;
	}
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	(I = (yield* new_(T("/obj/effect/beam/i_beam"), _T))).master = this;
	I.density = 1;
	yield* I.setDir(this.dir);
	this.first = I;
	yield* step(I, I.dir);
	if (!this.first) return f.dot;
	I.density = 0;
	I.vis_spread(this.visible);
	I.limit = 8;
	yield* I.process();
	return f.dot;
}, true, { waitfor: false });

// infrared.dm:81
rt.def("/obj/item/device/assembly/infra/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* qdel(this.first);
	yield* parent_proc();
	return f.dot;
}, true);

// infrared.dm:86
rt.def("/obj/item/device/assembly/infra/proc/Move", function* Move(f: Frame) {
	let t: Value = this.dir;
	yield* parent_proc();
	yield* this.setDir(t);
	yield* qdel(this.first);
	return f.dot;
}, true);

// infrared.dm:93
rt.def("/obj/item/device/assembly/infra/proc/holder_movement", function* holder_movement(f: Frame) {
	if (!this.holder) {
		return 0;
	}
	yield* qdel(this.first);
	return 1;
}, true);

// infrared.dm:99
rt.def("/obj/item/device/assembly/infra/proc/trigger_beam", function* trigger_beam(f: Frame) {
	if (!this.secured || !this.on || this.next_activate > rt.worldTime(f)) {
		return 0;
	}
	yield* this.pulse(0);
	this.audible_message(`${bicon(this)} *beep* *beep*`, null, 3);
	this.next_activate = rt.worldTime(f) + 30;
	return f.dot;
}, true);

// infrared.dm:106
rt.def("/obj/item/device/assembly/infra/proc/interact", function* interact(f: Frame, user: Value) {
	let $0: any, $1: any;
	if (!this.is_secured(user)) return f.dot;
	yield* user.set_machine(this);
	if (this.on) {
		$0 = fmt("<A href='?src=＃;state=0'>On</A>", [this]);
	} else {
		$0 = fmt("<A href='?src=＃;state=1'>Off</A>", [this]);
	}
	if (this.visible) {
		$1 = fmt("<A href='?src=＃;visible=0'>Visible</A>", [this]);
	} else {
		$1 = fmt("<A href='?src=＃;visible=1'>Invisible</A>", [this]);
	}
	let dat: Value = `<TT><B>Infrared Laser</B>\n<B>Status</B>: ${$0}<BR>\n<B>Visibility</B>: ${$1}<BR>\n</TT>`;
	dat += fmt("<BR><BR><A href='?src=＃;refresh=1'>Refresh</A>", [this]);
	dat += fmt("<BR><BR><A href='?src=＃;close=1'>Close</A>", [this]);
	rt.op(f, "Browse", [], [user, dat, "window=infra"], false);
	onclose(user, "infra");
	return f.dot;
}, true);

// infrared.dm:116
rt.def("/obj/item/device/assembly/infra/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (f.usr.incapacitated() || !(get_dist(this.loc, f.usr) <= 1)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=infra"], false);
		onclose(f.usr, "infra");
		return f.dot;
	}
	if (rt.at(href_list, "state")) {
		this.on = (!this.on ? 1 : 0);
		yield* this.update_icon();
	}
	if (rt.at(href_list, "visible")) {
		this.visible = (!this.visible ? 1 : 0);
		if (this.first) {
			this.first.vis_spread(this.visible);
		}
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=infra"], false);
		return f.dot;
	}
	if (!f.usr) return f.dot;
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);

// infrared.dm:139
rt.def("/obj/item/device/assembly/infra/verb/rotate", function rotate(f: Frame) {
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	this.setDir(turn(this.dir, 90));
	return f.dot;
}, false, { verb: { name: "Rotate Infrared Laser", category: "Object", src: 11 } });

// infrared.dm:146
rt.def("/obj/item/device/assembly/infra/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	} else {
		yield* this.rotate();
	}
	return f.dot;
}, true);

rt.type(11834, "/obj/effect/beam/i_beam", "/obj/effect/beam", {
	next: null,
	previous: null,
	master: null,
	limit: null,
	visible: 0,
	left: null,
	anchored: 1,
	name: "infrared beam",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "ibeam",
});

// infrared.dm:174
rt.def("/obj/effect/beam/i_beam/proc/hit", function* hit(f: Frame) {
	if (this.master) {
		yield* this.master.trigger_beam();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// infrared.dm:179
rt.def("/obj/effect/beam/i_beam/proc/vis_spread", function vis_spread(f: Frame, v: Value) {
	this.visible = v;
	if (!rt.sv(f, "next")) return f.dot;
	rt.sv(f, "next").vis_spread(v);
	return f.dot;
});

// infrared.dm:185
rt.def("/obj/effect/beam/i_beam/proc/process", function* process(f: Frame) {
	let I: Value = null;
	if (this.loc.density || !this.master) {
		yield* qdel(this);
		return f.dot;
	}
	if (this.left > 0) {
		this.left--;
	}
	if (this.left < 1) {
		if (!this.visible) {
			this.invisibility = INVISIBILITY_ABSTRACT;
		} else {
			this.invisibility = 0;
		}
	} else {
		this.invisibility = 0;
	}
	if (!(!rt.sv(f, "next") && this.limit > 0)) return f.dot;
	(I = (yield* new_(T("/obj/effect/beam/i_beam"), this.loc))).master = this.master;
	I.density = 1;
	yield* I.setDir(this.dir);
	I.previous = this;
	rt.setSv(f, "next", I);
	yield* step(I, I.dir);
	if (!rt.sv(f, "next")) return f.dot;
	I.density = 0;
	I.vis_spread(this.visible);
	I.limit = this.limit - 1;
	this.master.last = I;
	yield* I.process();
	return f.dot;
}, true, { waitfor: false });

// infrared.dm:214
rt.def("/obj/effect/beam/i_beam/proc/Bump", function* Bump(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// infrared.dm:218
rt.def("/obj/effect/beam/i_beam/proc/Bumped", function* Bumped(f: Frame) {
	yield* this.hit();
	return f.dot;
}, true);

// infrared.dm:221
rt.def("/obj/effect/beam/i_beam/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (rt.istype(AM, T("/obj/effect/beam"))) {
		return f.dot;
	}
	yield* this.hit();
	return f.dot;
}, true);

// infrared.dm:226
rt.def("/obj/effect/beam/i_beam/proc/Destroy", function* Destroy(f: Frame) {
	if (this.master.first == this) {
		this.master.first = null;
	}
	if (rt.sv(f, "next")) {
		yield* qdel(rt.sv(f, "next"));
		rt.setSv(f, "next", null);
	}
	if (this.previous) {
		rt.setFv(f, "next", this.previous, null);
		this.master.last = this.previous;
	}
	return (yield* parent_proc());
}, true);
