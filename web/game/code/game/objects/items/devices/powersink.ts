// Based on /tg/station's code/game/objects/items/devices/powersink.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9277, "/obj/item/device/powersink", "/obj/item/device", {
	drain_rate: 1600000,
	power_drained: 0,
	max_power: 10000000000,
	mode: 0,
	admins_warned: 0,
	DISCONNECTED: 0,
	CLAMPED_OFF: 1,
	OPERATING: 2,
	attached: null,
	flags: 64,
	throw_speed: 1,
	throw_range: 2,
	desc: "A nulling power sink which drains energy from electrical systems.",
	name: "power sink",
	icon_state: "powersink0",
	item_state: "electronic",
	w_class: 4,
	throwforce: 5,
	materials: null,
	origin_tech: "powerstorage=5;syndicate=5",
}, { const: ["DISCONNECTED","CLAMPED_OFF","OPERATING"] });

// powersink.dm:13
rt.def("/obj/item/device/powersink/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 750]);
	return f.dot;
});

// powersink.dm:28
rt.def("/obj/item/device/powersink/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `powersink${(this.mode == 2 ? 1 : 0)}`;
	return f.dot;
});

// powersink.dm:31
rt.def("/obj/item/device/powersink/proc/set_mode", function set_mode(f: Frame, value: Value) {
	if (value == this.mode) {
		return f.dot;
	}
	if (value === 0) {
		this.attached = null;
		if (this.mode == 2) {
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
		this.anchored = 0;
	} else if (value === 1) {
		if (!this.attached) {
			return f.dot;
		}
		if (this.mode == 2) {
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
		this.anchored = 1;
	} else if (value === 2) {
		if (!this.attached) {
			return f.dot;
		}
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
		this.anchored = 1;
	}
	this.mode = value;
	this.update_icon();
	this.set_light(0);
	return f.dot;
});

// powersink.dm:58
rt.def("/obj/item/device/powersink/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.mode == 0) {
			if (isturf((_T = this.loc)) && !_T.intact) {
				this.attached = rt.locateIn(f, T("/obj/structure/cable"), _T);
				if (!this.attached) {
					to_chat(user, "<span class='warning'>This device must be placed over an exposed, powered cable node!</span>");
				} else {
					this.set_mode(1);
					user.visible_message(fmt("＀ attaches ％！ to the cable.", [user, this]), fmt("<span class='notice'>You attach ％！ to the cable.</span>", [this]), "<span class='italics'>You hear some wires being connected to something.</span>");
				}
			} else {
				to_chat(user, "<span class='warning'>This device must be placed over an exposed, powered cable node!</span>");
			}
		} else {
			this.set_mode(0);
			user.visible_message(fmt("＀ detaches ％！ from the cable.", [user, this]), fmt("<span class='notice'>You detach ％！ from the cable.</span>", [this]), "<span class='italics'>You hear some wires being disconnected from something.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// powersink.dm:89
rt.def("/obj/item/device/powersink/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any, $1: any;
	if (this.mode === 0) {
		yield* parent_proc();
	} else if (this.mode === 1) {
		user.visible_message(fmt("＀ activates ％！!", [user, this]), fmt("<span class='notice'>You activate ％！.</span>", [this]), "<span class='italics'>You hear a click.</span>");
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (this) {
			$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Power sink activated by ${$0} at ${`${$1}`}`);
		log_game(`Power sink activated by ${key_name(user)} at ${`(${this.x},${this.y},${this.z})`}`);
		this.set_mode(2);
	} else if (this.mode === 2) {
		user.visible_message(fmt("＀ deactivates ％！!", [user, this]), fmt("<span class='notice'>You deactivate ％！.</span>", [this]), "<span class='italics'>You hear a click.</span>");
		this.set_mode(1);
	}
	return f.dot;
}, true);

// powersink.dm:110
rt.def("/obj/item/device/powersink/proc/process", function* process(f: Frame) {
	let PN: Value = null, drained: Value = null, _T: Value = null, A: Value = null;
	if (!this.attached) {
		this.set_mode(0);
		return f.dot;
	}
	if (PN = this.attached.powernet) {
		this.set_light(5);
		drained = min(this.drain_rate, PN.avail);
		PN.load += drained;
		this.power_drained += drained;
		if (drained < this.drain_rate) {
			for (_T of each(PN.nodes, T("/obj/machinery/power/terminal"))) {
				if (rt.istype(_T.master, T("/obj/machinery/power/apc"))) {
					if ((A = _T.master).operating && A.cell) {
						A.cell.charge = max(0, A.cell.charge - 50);
						this.power_drained += 50;
						if (A.charging == 2) {
							A.charging = 1;
						}
					}
				}
			}
		}
	}
	if (this.power_drained > this.max_power * 0.98) {
		if (!this.admins_warned) {
			this.admins_warned = 1;
			message_admins(`Power sink at (${this.x},${this.y},${this.z} - <A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>) is 95% full. Explosion imminent.`);
		}
		playsound(this, rt.rsc("sound/effects/screech.ogg"), 100, 1, 1);
	}
	if (!(this.power_drained >= this.max_power)) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* explosion(this.loc, 4, 8, 16, 32);
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });
