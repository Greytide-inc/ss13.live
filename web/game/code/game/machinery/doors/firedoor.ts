// Based on /tg/station's code/game/machinery/doors/firedoor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10288, "/obj/machinery/door/firedoor", "/obj/machinery/door", {
	nextstate: null,
	boltslocked: 1,
	affecting_areas: null,
	heat_proof: 1,
	glass: 1,
	sub_door: 1,
	explosion_block: 1,
	safe: 0,
	closingLayer: 3.11,
	name: "firelock",
	desc: "Apply crowbar.",
	icon: rt.rsc("icons/obj/doors/doorfireglass.dmi"),
	icon_state: "door_open",
	opacity: 0,
	density: 0,
	obj_integrity: 300,
	max_integrity: 300,
	resistance_flags: 2,
	assemblytype: rt.typePath("/obj/structure/firelock_frame"),
	armor: null,
});

// firedoor.dm:25
rt.def("/obj/machinery/door/firedoor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 20, "energy", 20, "bomb", 10, "bio", 100, "rad", 100, "fire", 95, "acid", 70]);
	return f.dot;
});

// firedoor.dm:30
rt.def("/obj/machinery/door/firedoor/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.CalculateAffectingAreas();
	return f.dot;
}, true);

// firedoor.dm:34
rt.def("/obj/machinery/door/firedoor/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.density) {
		to_chat(user, "<span class='notice'>It is open, but could be <b>pried</b> closed.</span>");
	} else if (!this.welded) {
		to_chat(user, "<span class='notice'>It is closed, but could be <i>pried</i> open. Deconstruction would require it to be <b>welded</b> shut.</span>");
	} else if (this.boltslocked) {
		to_chat(user, "<span class='notice'>It is <i>welded</i> shut. The floor bolt have been locked by <b>screws</b>.</span>");
	} else {
		to_chat(user, "<span class='notice'>The bolt locks have been <i>unscrewed</i>, but the bolts themselves are still <b>wrenched</b> to the floor.</span>");
	}
	return f.dot;
}, false);

// firedoor.dm:47
rt.def("/obj/machinery/door/firedoor/proc/CalculateAffectingAreas", function CalculateAffectingAreas(f: Frame) {
	let I: Value = null, A: Value = null;
	this.remove_from_areas();
	this.affecting_areas = rt.bitOr(get_adjacent_open_areas(this), get_area(this));
	for (I of each(this.affecting_areas)) {
		if (!(A = I).firedoors) {
			A.firedoors = list();
		}
		A.firedoors += this;
	}
	return f.dot;
});

// firedoor.dm:62
rt.def("/obj/machinery/door/firedoor/proc/remove_from_areas", function remove_from_areas(f: Frame) {
	let I: Value = null, A: Value = null;
	if (!this.affecting_areas) return f.dot;
	for (I of each(this.affecting_areas)) {
		if ((A = I).firedoors) {
			A.firedoors -= this;
			if (!rt.len(f, A.firedoors)) {
				A.firedoors = null;
			}
		}
	}
	return f.dot;
});

// firedoor.dm:67
rt.def("/obj/machinery/door/firedoor/proc/Destroy", function* Destroy(f: Frame) {
	this.remove_from_areas();
	this.affecting_areas.Cut();
	return (yield* parent_proc());
}, true);

// firedoor.dm:72
rt.def("/obj/machinery/door/firedoor/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	if (this.panel_open || this.operating) {
		return f.dot;
	}
	if (!this.density) {
		return (yield* parent_proc());
	}
	return 0;
}, true);

// firedoor.dm:80
rt.def("/obj/machinery/door/firedoor/proc/power_change", function* power_change(f: Frame) {
	if (this.powered(this.power_channel)) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		yield* this.latetoggle();
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
}, true);

// firedoor.dm:87
rt.def("/obj/machinery/door/firedoor/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (this.operating || !this.density) {
		return f.dot;
	}
	user.changeNext_move(8);
	user.visible_message(fmt("＀ bangs on ％！.", [user, this]), fmt("You bang on ％！.", [this]));
	playsound(this.loc, rt.rsc("sound/effects/glassknock.ogg"), 10, 0, { frequency: 32000 });
	return f.dot;
});

// firedoor.dm:96
rt.def("/obj/machinery/door/firedoor/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let $0: any, $1: any, $2: any;
	yield* this.add_fingerprint(user);
	if (this.operating) {
		return f.dot;
	}
	if (this.welded) {
		if (rt.istype(C, T("/obj/item/weapon/wrench"))) {
			if (this.boltslocked) {
				to_chat(user, "<span class='notice'>There are screws locking the bolts in place!</span>");
				return f.dot;
			}
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			user.visible_message(`<span class='notice'>${user} starts undoing ${this}'s bolts...</span>`, `<span class='notice'>You start unfastening ${this}'s floor bolts...</span>`);
			if (!(yield* do_after(user, 50 * C.toolspeed, { target: this }))) {
				return f.dot;
			}
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			user.visible_message(`<span class='notice'>${user} unfastens ${this}'s bolts.</span>`, `<span class='notice'>You undo ${this}'s floor bolts.</span>`);
			yield* this.deconstruct(1);
			return f.dot;
		}
		if (rt.istype(C, T("/obj/item/weapon/screwdriver"))) {
			$0 = user;
			$1 = user;
			if (this.boltslocked) {

				$2 = "unlocks";
			} else {
				$2 = "locks";
			}
			$1 = `<span class='notice'>${$1} ${$2} ${this}'s bolts.</span>`;
			if (this.boltslocked) {
				$2 = "unlock";
			} else {
				$2 = "lock";
			}
			$0.visible_message($1, `<span class='notice'>You ${$2} ${this}'s floor bolts.</span>`);
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			this.boltslocked = (!this.boltslocked ? 1 : 0);
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// firedoor.dm:128
rt.def("/obj/machinery/door/firedoor/proc/try_to_weld", function* try_to_weld(f: Frame, W: Value, user: Value) {
	let $2: any;
	if (!(yield* W.remove_fuel(0, user))) return f.dot;
	playsound(rt.getStep(f, this, 0), W.usesound, 50, 1);
	let $0: any = user;
	let $1: any = user;
	if (this.welded) {

		$2 = "unwelding";
	} else {
		$2 = "welding";
	}
	$0.visible_message(`<span class='notice'>${$1} starts ${$2} ${this}.</span>`, `<span class='notice'>You start welding ${this}.</span>`);
	if (!(yield* do_after(user, 40 * W.toolspeed, 1, { target: this }))) return f.dot;
	playsound(rt.getStep(f, this, 0), W.usesound, 50, 1);
	this.welded = (!this.welded ? 1 : 0);
	$0 = user;
	$1 = user;
	if (this.welded) {

		$2 = "welds";
	} else {
		$2 = "unwelds";
	}
	$1 = `<span class='danger'>${$1} ${$2} ${this}.</span>`;
	to_chat($0, $1, `<span class='notice'>You ${this.welded ? "weld" : "unweld"} ${this}.</span>`);
	yield* this.update_icon();
	return f.dot;
}, true);

// firedoor.dm:138
rt.def("/obj/machinery/door/firedoor/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	if (this.welded || this.operating) {
		return f.dot;
	}
	if (this.density) {
		yield* this.open();
	} else {
		yield* this.close();
	}
	return f.dot;
}, true);

// firedoor.dm:147
rt.def("/obj/machinery/door/firedoor/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.welded || this.operating || rt.bitAnd(this.stat, 2)) {
		return f.dot;
	}
	if (this.density) {
		yield* this.open();
	} else {
		yield* this.close();
	}
	return f.dot;
}, true);

// firedoor.dm:156
rt.def("/obj/machinery/door/firedoor/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.welded) {
		to_chat(user, `<span class='warning'>${this} refuses to budge!</span>`);
		return f.dot;
	}
	yield* this.open();
	return f.dot;
}, true);

// firedoor.dm:163
rt.def("/obj/machinery/door/firedoor/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	if (animation === "opening") {
		flick("door_opening", this);
	} else if (animation === "closing") {
		flick("door_closing", this);
	}
	return f.dot;
});

// firedoor.dm:170
rt.def("/obj/machinery/door/firedoor/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.density) {
		this.icon_state = "door_closed";
		if (this.welded) {
			this.add_overlay("welded");
		}
	} else {
		this.icon_state = "door_open";
		if (!this.welded) return f.dot;
		this.add_overlay("welded_open");
	}
	return f.dot;
});

// firedoor.dm:181
rt.def("/obj/machinery/door/firedoor/proc/open", function* open(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.latetoggle();
	return f.dot;
}, true);

// firedoor.dm:185
rt.def("/obj/machinery/door/firedoor/proc/close", function* close(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.latetoggle();
	return f.dot;
}, true);

// firedoor.dm:189
rt.def("/obj/machinery/door/firedoor/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null;
	disassembled ??= CONSTRUCTION_PANEL_OPEN;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		F = (yield* new_(this.assemblytype, rt.getStep(f, this, 0)));
		if (disassembled) {
			F.constructionStep = CONSTRUCTION_PANEL_OPEN;
		} else {
			F.constructionStep = CONSTRUCTION_WIRES_EXPOSED;
			F.obj_integrity = F.max_integrity * 0.5;
		}
		yield* F.update_icon();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// firedoor.dm:201
rt.def("/obj/machinery/door/firedoor/proc/latetoggle", function* latetoggle(f: Frame) {
	if (this.operating || rt.bitAnd(this.stat, 2) || !this.nextstate) {
		return f.dot;
	}
	if (this.nextstate === 1) {
		this.nextstate = null;
		yield* this.open();
	} else if (this.nextstate === 2) {
		this.nextstate = null;
		yield* this.close();
	}
	return f.dot;
}, true);

rt.type(10290, "/obj/machinery/door/firedoor/border_only", "/obj/machinery/door/firedoor", {
	flags: 512,
	CanAtmosPass: -1,
	icon: rt.rsc("icons/obj/doors/edge_Doorfire.dmi"),
});

// firedoor.dm:217
rt.def("/obj/machinery/door/firedoor/border_only/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	if (rt.getDir(f, this.loc, target) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// firedoor.dm:225
rt.def("/obj/machinery/door/firedoor/border_only/proc/CheckExit", function CheckExit(f: Frame, mover: Value, target: Value) {
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(2)) {
		return 1;
	}
	if (rt.getDir(f, this.loc, target) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

// firedoor.dm:233
rt.def("/obj/machinery/door/firedoor/border_only/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (rt.getDir(f, this.loc, _T) == this.dir) {
		return (!this.density ? 1 : 0);
	}
	return 1;
});

rt.type(12554, "/obj/structure/firelock_frame", "/obj/structure", {
	constructionStep: 4,
	reinforced: 0,
	anchored: 0,
	name: "firelock frame",
	desc: "A partially completed firelock.",
	icon: rt.rsc("icons/obj/doors/doorfire.dmi"),
	icon_state: "frame1",
	density: 1,
});

// firedoor.dm:264
rt.def("/obj/structure/firelock_frame/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.constructionStep === CONSTRUCTION_PANEL_OPEN) {
		to_chat(user, "<span class='notice'>It is <i>unbolted</i> from the floor. A small <b>loosely connected</b> metal plate is covering the wires.</span>");
		if (!this.reinforced) {
			to_chat(user, "<span class='notice'>It could be reinforced with plasteel.</span>");
		}
	} else if (this.constructionStep === CONSTRUCTION_WIRES_EXPOSED) {
		to_chat(user, "<span class='notice'>The maintenance plate has been <i>pried away</i>, and <b>wires</b> are trailing.</span>");
	} else if (this.constructionStep === CONSTRUCTION_GUTTED) {
		to_chat(user, "<span class='notice'>The maintenance panel is missing <i>wires</i> and the circuit board is <b>loosely connected</b>.</span>");
	} else if (this.constructionStep === CONSTRUCTION_NOCIRCUIT) {
		to_chat(user, "<span class='notice'>There are no <i>firelock electronics</i> in the frame. The frame could be <b>cut</b> apart.</span>");
	}
	return f.dot;
}, false);

// firedoor.dm:278
rt.def("/obj/structure/firelock_frame/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `frame${this.constructionStep}`;
	return f.dot;
});

// firedoor.dm:282
rt.def("/obj/structure/firelock_frame/proc/attackby", function* attackby(f: Frame, C: Value, user: Value) {
	let _P: Value = null, B: Value = null, W: Value = null, _T: Value = null;
	if (this.constructionStep === CONSTRUCTION_PANEL_OPEN) {
		if (rt.istype(C, T("/obj/item/weapon/crowbar"))) {
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			user.visible_message(`<span class='notice'>${user} starts prying something out from ${this}...</span>`, "<span class='notice'>You begin prying out the wire cover...</span>");
			if (!(yield* do_after(user, 50 * C.toolspeed, { target: this }))) {
				return f.dot;
			}
			if (this.constructionStep != CONSTRUCTION_PANEL_OPEN) {
				return f.dot;
			}
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			user.visible_message(`<span class='notice'>${user} pries out a metal plate from ${this}, exposing the wires.</span>`, `<span class='notice'>You remove the cover plate from ${this}, exposing the wires.</span>`);
			this.constructionStep = CONSTRUCTION_WIRES_EXPOSED;
			yield* this.update_icon();
			return f.dot;
		}
		if (rt.istype(C, T("/obj/item/weapon/wrench"))) {
			if (rt.locateIn(f, T("/obj/machinery/door/firedoor"), rt.getStep(f, this, 0))) {
				to_chat(user, "<span class='warning'>There's already a firelock there.</span>");
				return f.dot;
			}
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			user.visible_message(`<span class='notice'>${user} starts bolting down ${this}...</span>`, `<span class='notice'>You begin bolting ${this}...</span>`);
			if (!(yield* do_after(user, 30 * C.toolspeed, { target: this }))) {
				return f.dot;
			}
			if (rt.locateIn(f, T("/obj/machinery/door/firedoor"), rt.getStep(f, this, 0))) {
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} finishes the firelock.</span>`, "<span class='notice'>You finish the firelock.</span>");
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			if (this.reinforced) {
				yield* new_(T("/obj/machinery/door/firedoor/heavy"), rt.getStep(f, this, 0));
			} else {
				yield* new_(T("/obj/machinery/door/firedoor"), rt.getStep(f, this, 0));
			}
			yield* qdel(this);
			return f.dot;
		}
		if (rt.istype(C, T("/obj/item/stack/sheet/plasteel"))) {
			_P = C;
			if (this.reinforced) {
				to_chat(user, `<span class='warning'>${this} is already reinforced.</span>`);
				return f.dot;
			}
			if (_P.get_amount() < 2) {
				to_chat(user, `<span class='warning'>You need more plasteel to reinforce ${this}.</span>`);
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} begins reinforcing ${this}...</span>`, `<span class='notice'>You begin reinforcing ${this}...</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			if (yield* do_after(user, 60, { target: this })) {
				if (this.constructionStep != CONSTRUCTION_PANEL_OPEN || this.reinforced || _P.get_amount() < 2 || !_P) {
					return f.dot;
				}
				user.visible_message(`<span class='notice'>${user} reinforces ${this}.</span>`, `<span class='notice'>You reinforce ${this}.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* _P.use(2);
				this.reinforced = 1;
			}
			return f.dot;
		}
	} else if (this.constructionStep === CONSTRUCTION_WIRES_EXPOSED) {
		if (rt.istype(C, T("/obj/item/weapon/wirecutters"))) {
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			user.visible_message(`<span class='notice'>${user} starts cutting the wires from ${this}...</span>`, `<span class='notice'>You begin removing ${this}'s wires...</span>`);
			if (!(yield* do_after(user, 60 * C.toolspeed, { target: this }))) {
				return f.dot;
			}
			if (this.constructionStep != CONSTRUCTION_WIRES_EXPOSED) {
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} removes the wires from ${this}.</span>`, `<span class='notice'>You remove the wiring from ${this}, exposing the circuit board.</span>`);
			(B = (yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this, 0)))).amount = 5;
			this.constructionStep = CONSTRUCTION_GUTTED;
			yield* this.update_icon();
			return f.dot;
		}
		if (rt.istype(C, T("/obj/item/weapon/crowbar"))) {
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			user.visible_message(`<span class='notice'>${user} starts prying a metal plate into ${this}...</span>`, `<span class='notice'>You begin prying the cover plate back onto ${this}...</span>`);
			if (!(yield* do_after(user, 80 * C.toolspeed, { target: this }))) {
				return f.dot;
			}
			if (this.constructionStep != CONSTRUCTION_WIRES_EXPOSED) {
				return f.dot;
			}
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			user.visible_message(`<span class='notice'>${user} pries the metal plate into ${this}.</span>`, `<span class='notice'>You pry ${this}'s cover plate into place, hiding the wires.</span>`);
			this.constructionStep = CONSTRUCTION_PANEL_OPEN;
			yield* this.update_icon();
			return f.dot;
		}
	} else if (this.constructionStep === CONSTRUCTION_GUTTED) {
		if (rt.istype(C, T("/obj/item/weapon/crowbar"))) {
			user.visible_message(`<span class='notice'>${user} begins removing the circuit board from ${this}...</span>`, `<span class='notice'>You begin prying out the circuit board from ${this}...</span>`);
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			if (!(yield* do_after(user, 50 * C.toolspeed, { target: this }))) {
				return f.dot;
			}
			if (this.constructionStep != CONSTRUCTION_GUTTED) {
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} removes ${this}'s circuit board.</span>`, `<span class='notice'>You remove the circuit board from ${this}.</span>`);
			yield* new_(T("/obj/item/weapon/electronics/firelock"), rt.getStep(f, this, 0));
			playsound(rt.getStep(f, this, 0), C.usesound, 50, 1);
			this.constructionStep = CONSTRUCTION_NOCIRCUIT;
			yield* this.update_icon();
			return f.dot;
		}
		if (rt.istype(C, T("/obj/item/stack/cable_coil"))) {
			if ((B = C).get_amount() < 5) {
				to_chat(user, `<span class='warning'>You need more wires to add wiring to ${this}.</span>`);
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} begins wiring ${this}...</span>`, `<span class='notice'>You begin adding wires to ${this}...</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			if (yield* do_after(user, 60, { target: this })) {
				if (this.constructionStep != CONSTRUCTION_GUTTED || B.get_amount() < 5 || !B) {
					return f.dot;
				}
				user.visible_message(`<span class='notice'>${user} adds wires to ${this}.</span>`, `<span class='notice'>You wire ${this}.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* B.use(5);
				this.constructionStep = CONSTRUCTION_WIRES_EXPOSED;
				yield* this.update_icon();
			}
			return f.dot;
		}
	} else if (this.constructionStep === CONSTRUCTION_NOCIRCUIT) {
		if (rt.istype(C, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (W = C).remove_fuel(1, user)) {
				playsound(rt.getStep(f, this, 0), W.usesound, 50, 1);
				user.visible_message(`<span class='notice'>${user} begins cutting apart ${this}'s frame...</span>`, `<span class='notice'>You begin slicing ${this} apart...</span>`);
				if (!(yield* do_after(user, 80 * C.toolspeed, { target: this }))) {
					return f.dot;
				}
				if (this.constructionStep != CONSTRUCTION_NOCIRCUIT) {
					return f.dot;
				}
				user.visible_message(`<span class='notice'>${user} cuts apart ${this}!</span>`, `<span class='notice'>You cut ${this} into metal.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/welder2.ogg"), 50, 1);
				yield* new_(T("/obj/item/stack/sheet/metal"), (_T = rt.getStep(f, this, 0)), 3);
				if (this.reinforced) {
					yield* new_(T("/obj/item/stack/sheet/plasteel"), _T, 2);
				}
				yield* qdel(this);
			}
			return f.dot;
		}
		if (rt.istype(C, T("/obj/item/weapon/electronics/firelock"))) {
			user.visible_message(`<span class='notice'>${user} starts adding ${C} to ${this}...</span>`, `<span class='notice'>You begin adding a circuit board to ${this}...</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			if (!(yield* do_after(user, 40, { target: this }))) {
				return f.dot;
			}
			if (this.constructionStep != CONSTRUCTION_NOCIRCUIT) {
				return f.dot;
			}
			yield* user.drop_item();
			yield* qdel(C);
			user.visible_message(`<span class='notice'>${user} adds a circuit to ${this}.</span>`, `<span class='notice'>You insert and secure ${C}.</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			this.constructionStep = CONSTRUCTION_GUTTED;
			yield* this.update_icon();
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);
