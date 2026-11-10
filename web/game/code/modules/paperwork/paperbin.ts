// Based on /tg/station's code/modules/paperwork/paperbin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7621, "/obj/item/weapon/paper_bin", "/obj/item/weapon", {
	papertype: rt.typePath("/obj/item/weapon/paper"),
	total_paper: 30,
	papers: null,
	bin_pen: null,
	throw_speed: 3,
	throw_range: 7,
	pressure_resistance: 8,
	name: "paper bin",
	desc: "Contains all the paper you'll never need.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "paper_bin1",
	item_state: "sheet-metal",
	throwforce: 0,
	w_class: 3,
});

// paperbin.dm:14
rt.def("/obj/item/weapon/paper_bin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.papers = list();
	return f.dot;
});

// paperbin.dm:18
rt.def("/obj/item/weapon/paper_bin/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let _P: Value = null;
	f.dot = (yield* parent_proc());
	if (!mapload) {
		return f.dot;
	}
	if (!((_P = rt.locateIn(f, T("/obj/item/weapon/pen"), this.loc)) && !this.bin_pen)) return f.dot;
	_P.loc = this;
	this.bin_pen = _P;
	yield* this.update_icon();
	if (!(_P.type == T("/obj/item/weapon/pen") && !GLOB.warned)) return f.dot;
	warning("one or more paperbins ate a pen duing initialize()");
	GLOB.warned = 1;
	return f.dot;
}, true);

// paperbin.dm:32
rt.def("/obj/item/weapon/paper_bin/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (!this.total_paper) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// paperbin.dm:38
rt.def("/obj/item/weapon/paper_bin/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null;
	if (this.papers) {
		for (i of each(this.papers)) {
			yield* qdel(i);
		}
		this.papers = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// paperbin.dm:46
rt.def("/obj/item/weapon/paper_bin/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (this.total_paper) {
		this.total_paper = 0;
		yield* this.update_icon();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// paperbin.dm:50
rt.def("/obj/item/weapon/paper_bin/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	if (!rt.istype((M = f.usr), T("/mob/living")) || M.incapacitated() || !this.Adjacent(M)) {
		return f.dot;
	}
	if (over_object == M) {
		yield* M.put_in_hands(this);
	} else if (rt.istype(over_object, T("/obj/screen/inventory/hand"))) {
		H = over_object;
		yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	}
	yield* this.add_fingerprint(M);
	return f.dot;
}, true);

// paperbin.dm:65
rt.def("/obj/item/weapon/paper_bin/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// paperbin.dm:69
rt.def("/obj/item/weapon/paper_bin/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _P: Value = null;
	if (user.lying) {
		return f.dot;
	}
	user.changeNext_move(8);
	if (this.bin_pen) {
		(_P = this.bin_pen).loc = user.loc;
		yield* user.put_in_hands(_P);
		to_chat(user, fmt("<span class='notice'>You take ＀ out of ％！.</span>", [_P, this]));
		this.bin_pen = null;
		yield* this.update_icon();
	} else if (this.total_paper >= 1) {
		this.total_paper--;
		yield* this.update_icon();
		_P = null;
		if (rt.len(f, this.papers) > 0) {
			_P = rt.index(this.papers, rt.len(f, this.papers));
			yield* this.papers.Remove(_P);
		} else {
			_P = (yield* new_(this.papertype, this));
			if (GLOB.SSevents.holidays && rt.index(GLOB.SSevents.holidays, "April Fool's Day")) {
				if (prob(30)) {
					_P.info = `<font face="${"Comic Sans MS"}" color="red"><b>HONK HONK HONK HONK HONK HONK HONK<br>HOOOOOOOOOOOOOOOOOOOOOONK<br>APRIL FOOLS</b></font>`;
					_P.rigged = 1;
					_P.updateinfolinks();
				}
			}
		}
		_P.loc = user.loc;
		yield* user.put_in_hands(_P);
		to_chat(user, fmt("<span class='notice'>You take ＀ out of ％！.</span>", [_P, this]));
	} else {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// paperbin.dm:105
rt.def("/obj/item/weapon/paper_bin/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _P: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/paper"))) {
		_P = I;
		if (!(yield* user.transferItemToLoc(_P, this))) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You put ${_P} in ${this}.</span>`);
		this.papers.Add(_P);
		this.total_paper++;
		yield* this.update_icon();
	} else if (rt.istype(I, T("/obj/item/weapon/pen")) && !this.bin_pen) {
		_P = I;
		if (!(yield* user.transferItemToLoc(_P, this))) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You put ${_P} in ${this}.</span>`);
		this.bin_pen = _P;
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// paperbin.dm:124
rt.def("/obj/item/weapon/paper_bin/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.total_paper) {
		to_chat(user, "It contains " + (this.total_paper > 1 ? `${this.total_paper} papers` : " one paper") + ".");
	} else {
		to_chat(user, "It doesn't contain anything.");
	}
	return f.dot;
}, false);

// paperbin.dm:132
rt.def("/obj/item/weapon/paper_bin/proc/update_icon", function update_icon(f: Frame) {
	if (this.total_paper < 1) {
		this.icon_state = "paper_bin0";
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	}
	this.cut_overlays();
	if (!this.bin_pen) return f.dot;
	this.add_overlay(mutable_appearance(this.bin_pen.icon, this.bin_pen.icon_state));
	return f.dot;
});

rt.type(7623, "/obj/item/weapon/paper_bin/bundlenatural", "/obj/item/weapon/paper_bin", {
	papertype: rt.typePath("/obj/item/weapon/paper/natural"),
	name: "natural paper bundle",
	desc: "A bundle of paper created using traditional methods.",
	icon_state: "paper_bundle",
	resistance_flags: 4,
});

// paperbin.dm:153
rt.def("/obj/item/weapon/paper_bin/bundlenatural/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(this.total_paper < 1)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// paperbin.dm:157
rt.def("/obj/item/weapon/paper_bin/bundlenatural/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* qdel(this);
	return f.dot;
}, true);

// paperbin.dm:159
rt.def("/obj/item/weapon/paper_bin/bundlenatural/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	let _T: Value = null, _P: Value = null;
	if (W.is_sharp()) {
		to_chat(user, fmt("<span class='notice'>You snip ％！, spilling paper everywhere.</span>", [this]));
		_T = rt.getStep(f, this.loc, 0);
		while (this.total_paper > 0) {
			this.total_paper--;
			_P = null;
			if (rt.len(f, this.papers) > 0) {
				this.papers -= (_P = rt.index(this.papers, rt.len(f, this.papers)));
			} else {
				yield* (_P = (yield* new_(this.papertype))).forceMove(_T);
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		yield* qdel(this);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
