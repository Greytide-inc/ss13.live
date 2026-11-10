// Based on /tg/station's code/game/objects/structures/girders.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12240, "/obj/structure/girder", "/obj/structure", {
	state: 0,
	girderpasschance: 20,
	can_displace: 1,
	anchored: 1,
	name: "girder",
	icon_state: "girder",
	density: 1,
	layer: 2.9,
	obj_integrity: 200,
	max_integrity: 200,
});

// girders.dm:14
rt.def("/obj/structure/girder/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.state === GIRDER_REINF) {
		to_chat(user, "<span class='notice'>The support struts are <b>screwed</b> in place.</span>");
	} else if (this.state === GIRDER_REINF_STRUTS) {
		to_chat(user, "<span class='notice'>The support struts are <i>unscrewed</i> and the inner <b>grille</b> is intact.</span>");
	} else if (this.state === GIRDER_NORMAL) {
		if (this.can_displace) {
			to_chat(user, "<span class='notice'>The bolts are <b>wrenched</b> in place.</span>");
		}
	} else if (this.state === GIRDER_DISPLACED) {
		to_chat(user, `<span class='notice'>The bolts are <i>loosened</i>, but the <b>screws</b> are holding ${this} together.</span>`);
	} else if (this.state === GIRDER_DISASSEMBLED) {
		to_chat(user, `<span class='notice'>${this} is disassembled! You probably shouldn't be able to see this examine message.</span>`);
	}
	return f.dot;
}, false);

// girders.dm:29
rt.def("/obj/structure/girder/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null, G: Value = null, D: Value = null, S: Value = null, FW: Value = null, _T: Value = null, F: Value = null, R: Value = null, M_1: Value = null, F_2: Value = null, FW_3: Value = null, _T_2: Value = null, _P: Value = null;
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.state == GIRDER_DISPLACED) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} disassembles the girder.</span>`, "<span class='notice'>You start to disassemble the girder...</span>", "You hear clanking and banging noises.");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (this.state != GIRDER_DISPLACED) {
					return f.dot;
				}
				this.state = GIRDER_DISASSEMBLED;
				to_chat(user, "<span class='notice'>You disassemble the girder.</span>");
				yield* (M = (yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2))).add_fingerprint(user);
				yield* qdel(this);
			}
		} else if (this.state == GIRDER_REINF) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You start unsecuring support struts...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (this.state != GIRDER_REINF) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You unsecure the support struts.</span>");
				this.state = GIRDER_REINF_STRUTS;
			}
		} else if (this.state == GIRDER_REINF_STRUTS) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You start securing support struts...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (this.state != GIRDER_REINF_STRUTS) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You secure the support struts.</span>");
				this.state = GIRDER_REINF;
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.state == GIRDER_DISPLACED) {
			if (!rt.istype(this.loc, T("/turf/open/floor"))) {
				to_chat(user, "<span class='warning'>A floor must be present to secure the girder!</span>");
				return f.dot;
			}
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You start securing the girder...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You secure the girder.</span>");
				this.transfer_fingerprints_to((G = (yield* new_(T("/obj/structure/girder"), this.loc))));
				yield* qdel(this);
			}
		} else if (this.state == GIRDER_NORMAL && this.can_displace) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You start unsecuring the girder...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You unsecure the girder.</span>");
				this.transfer_fingerprints_to((D = (yield* new_(T("/obj/structure/girder/displaced"), this.loc))));
				yield* qdel(this);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
		to_chat(user, "<span class='notice'>You start slicing apart the girder...</span>");
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			to_chat(user, "<span class='notice'>You slice apart the girder.</span>");
			yield* (M = (yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2))).add_fingerprint(user);
			yield* qdel(this);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/pickaxe/drill/jackhammer"))) {
		D = W;
		to_chat(user, "<span class='notice'>You smash through the girder!</span>");
		yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this, 0));
		D.playDigSound();
		yield* qdel(this);
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters")) && this.state == GIRDER_REINF_STRUTS) {
		playsound(this.loc, W.usesound, 100, 1);
		to_chat(user, "<span class='notice'>You start removing the inner grille...</span>");
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			to_chat(user, "<span class='notice'>You remove the inner grille.</span>");
			yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, this, 0));
			this.transfer_fingerprints_to((G = (yield* new_(T("/obj/structure/girder"), this.loc))));
			yield* qdel(this);
		}
	} else if (rt.istype(W, T("/obj/item/stack"))) {
		if (rt.istype(this.loc, T("/turf/closed/wall"))) {
			to_chat(user, "<span class='warning'>There is already a wall present!</span>");
			return f.dot;
		}
		if (!rt.istype(this.loc, T("/turf/open/floor"))) {
			to_chat(user, "<span class='warning'>A floor must be present to build a false wall!</span>");
			return f.dot;
		}
		if (rt.locateIn(f, T("/obj/structure/falsewall"), this.loc.contents)) {
			to_chat(user, "<span class='warning'>There is already a false wall present!</span>");
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/stack/rods"))) {
			S = W;
			if (this.state == GIRDER_DISPLACED) {
				if (S.get_amount() < 2) {
					to_chat(user, "<span class='warning'>You need at least two rods to create a false wall!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start building a reinforced false wall...</span>");
				if (yield* do_after(user, 20, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 2) {
						return f.dot;
					}
					yield* S.use(2);
					to_chat(user, "<span class='notice'>You create a false wall. Push on it to open or close the passage.</span>");
					this.transfer_fingerprints_to((FW = (yield* new_(T("/obj/structure/falsewall/iron"), this.loc))));
					yield* qdel(this);
				}
			} else {
				if (S.get_amount() < 5) {
					to_chat(user, "<span class='warning'>You need at least five rods to add plating!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start adding plating...</span>");
				if (yield* do_after(user, 40, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 5) {
						return f.dot;
					}
					yield* S.use(5);
					to_chat(user, "<span class='notice'>You add the plating.</span>");
					yield* (_T = rt.getStep(f, this, 0)).ChangeTurf(T("/turf/closed/wall/mineral/iron"));
					this.transfer_fingerprints_to(_T);
					yield* qdel(this);
				}
				return f.dot;
			}
		}
		if (!rt.istype(W, T("/obj/item/stack/sheet"))) {
			return f.dot;
		}
		if (rt.istype((S = W), T("/obj/item/stack/sheet/metal"))) {
			if (this.state == GIRDER_DISPLACED) {
				if (S.get_amount() < 2) {
					to_chat(user, "<span class='warning'>You need two sheets of metal to create a false wall!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start building a false wall...</span>");
				if (yield* do_after(user, 20, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 2) {
						return f.dot;
					}
					yield* S.use(2);
					to_chat(user, "<span class='notice'>You create a false wall. Push on it to open or close the passage.</span>");
					this.transfer_fingerprints_to((F = (yield* new_(T("/obj/structure/falsewall"), this.loc))));
					yield* qdel(this);
				}
			} else {
				if (S.get_amount() < 2) {
					to_chat(user, "<span class='warning'>You need two sheets of metal to finish a wall!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start adding plating...</span>");
				if (yield* do_after(user, 40, { target: this })) {
					if (this.loc === null || S.get_amount() < 2) {
						return f.dot;
					}
					yield* S.use(2);
					to_chat(user, "<span class='notice'>You add the plating.</span>");
					yield* (_T = rt.getStep(f, this, 0)).ChangeTurf(T("/turf/closed/wall"));
					this.transfer_fingerprints_to(_T);
					yield* qdel(this);
				}
				return f.dot;
			}
		}
		if (rt.istype(S, T("/obj/item/stack/sheet/plasteel"))) {
			if (this.state == GIRDER_DISPLACED) {
				if (S.get_amount() < 2) {
					to_chat(user, "<span class='warning'>You need at least two sheets to create a false wall!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start building a reinforced false wall...</span>");
				if (yield* do_after(user, 20, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 2) {
						return f.dot;
					}
					yield* S.use(2);
					to_chat(user, "<span class='notice'>You create a reinforced false wall. Push on it to open or close the passage.</span>");
					this.transfer_fingerprints_to((FW = (yield* new_(T("/obj/structure/falsewall/reinforced"), this.loc))));
					yield* qdel(this);
				}
			} else if (this.state == GIRDER_REINF) {
				if (S.get_amount() < 1) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start finalizing the reinforced wall...</span>");
				if (yield* do_after(user, 50, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 1) {
						return f.dot;
					}
					yield* S.use(1);
					to_chat(user, "<span class='notice'>You fully reinforce the wall.</span>");
					yield* (_T = rt.getStep(f, this, 0)).ChangeTurf(T("/turf/closed/wall/r_wall"));
					this.transfer_fingerprints_to(_T);
					yield* qdel(this);
				}
				return f.dot;
			} else {
				if (S.get_amount() < 1) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start reinforcing the girder...</span>");
				if (yield* do_after(user, 60, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 1) {
						return f.dot;
					}
					yield* S.use(1);
					to_chat(user, "<span class='notice'>You reinforce the girder.</span>");
					this.transfer_fingerprints_to((R = (yield* new_(T("/obj/structure/girder/reinforced"), this.loc))));
					yield* qdel(this);
				}
				return f.dot;
			}
		}
		if (S.sheettype) {
			M_1 = S.sheettype;
			if (this.state == GIRDER_DISPLACED) {
				if (S.get_amount() < 2) {
					to_chat(user, "<span class='warning'>You need at least two sheets to create a false wall!</span>");
					return f.dot;
				}
				if (yield* do_after(user, 20, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 2) {
						return f.dot;
					}
					yield* S.use(2);
					to_chat(user, "<span class='notice'>You create a false wall. Push on it to open or close the passage.</span>");
					F_2 = text2path(`/obj/structure/falsewall/${M_1}`);
					this.transfer_fingerprints_to((FW_3 = (yield* new_(F_2, this.loc))));
					yield* qdel(this);
				}
			} else {
				if (S.get_amount() < 2) {
					to_chat(user, "<span class='warning'>You need at least two sheets to add plating!</span>");
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start adding plating...</span>");
				if (yield* do_after(user, 40, { target: this })) {
					if (!this.loc || !S || S.get_amount() < 2) {
						return f.dot;
					}
					yield* S.use(2);
					to_chat(user, "<span class='notice'>You add the plating.</span>");
					yield* (_T_2 = rt.getStep(f, this, 0)).ChangeTurf(text2path(`/turf/closed/wall/mineral/${M_1}`));
					this.transfer_fingerprints_to(_T_2);
					yield* qdel(this);
				}
				return f.dot;
			}
		}
		this.add_hiddenprint(user);
	} else if (rt.istype(W, T("/obj/item/pipe"))) {
		if (rt.isIn(f, (_P = W).pipe_type, list(0, 1, 5))) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			_P.loc = this.loc;
			to_chat(user, fmt("<span class='notice'>You fit the pipe into ％！.</span>", [this]));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// girders.dm:270
rt.def("/obj/structure/girder/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(4)) {
		return prob(this.girderpasschance);
	}
	if (rt.istype(mover, T("/obj/item/projectile"))) {
		return prob(this.girderpasschance);
	}
	return 0;
});

// girders.dm:281
rt.def("/obj/structure/girder/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	f.dot = (!this.density ? 1 : 0);
	if (!rt.istype(caller, T("/atom/movable"))) return f.dot;
	let mover: Value = caller;
	f.dot = (f.dot || mover.checkpass(4));
	return f.dot;
});

// girders.dm:287
rt.def("/obj/structure/girder/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let remains: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		remains = pick(T("/obj/item/stack/rods"), T("/obj/item/stack/sheet/metal"));
		yield* new_(remains, this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// girders.dm:294
rt.def("/obj/structure/girder/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (this.anchored) {
		yield* new_(T("/obj/structure/destructible/clockwork/wall_gear"), this.loc);
	} else {
		yield* new_(T("/obj/structure/destructible/clockwork/wall_gear/displaced"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// girders.dm:300
rt.def("/obj/structure/girder/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* new_(T("/obj/structure/girder/cult"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12243, "/obj/structure/girder/cult", "/obj/structure/girder", {
	can_displace: 0,
	name: "runed girder",
	desc: "Framework made of a strange and shockingly cold metal. It doesn't seem to have any bolts.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "cultgirder",
});

// girders.dm:332
rt.def("/obj/structure/girder/cult/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let R: Value = null, WT: Value = null, R_1: Value = null, D: Value = null, _T: Value = null;
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/tome")) && iscultist(user)) {
		user.visible_message(`<span class='warning'>${user} strikes ${this} with ${W}!</span>`, `<span class='notice'>You demolish ${this}.</span>`);
		(R = (yield* new_(T("/obj/item/stack/sheet/runed_metal"), rt.getStep(f, this, 0)))).amount = 1;
		yield* qdel(this);
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You start slicing apart the girder...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!WT.isOn()) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You slice apart the girder.</span>");
				(R_1 = (yield* new_(T("/obj/item/stack/sheet/runed_metal"), rt.getStep(f, this, 0)))).amount = 1;
				this.transfer_fingerprints_to(R_1);
				yield* qdel(this);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
		to_chat(user, "<span class='notice'>You start slicing apart the girder...</span>");
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			to_chat(user, "<span class='notice'>You slice apart the girder.</span>");
			(R = (yield* new_(T("/obj/item/stack/sheet/runed_metal"), rt.getStep(f, this, 0)))).amount = 1;
			this.transfer_fingerprints_to(R);
			yield* qdel(this);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/pickaxe/drill/jackhammer"))) {
		D = W;
		to_chat(user, "<span class='notice'>Your jackhammer smashes through the girder!</span>");
		(R_1 = (yield* new_(T("/obj/item/stack/sheet/runed_metal"), rt.getStep(f, this, 0)))).amount = 2;
		this.transfer_fingerprints_to(R_1);
		D.playDigSound();
		yield* qdel(this);
	} else if (rt.istype(W, T("/obj/item/stack/sheet/runed_metal"))) {
		if ((R = W).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need at least one sheet of runed metal to construct a runed wall!</span>");
			return 0;
		}
		user.visible_message(`<span class='notice'>${user} begins laying runed metal on ${this}...</span>`, "<span class='notice'>You begin constructing a runed wall...</span>");
		if (yield* do_after(user, 50, { target: this })) {
			if (R.get_amount() < 1 || !R) {
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} plates ${this} with runed metal.</span>`, "<span class='notice'>You construct a runed wall.</span>");
			yield* R.use(1);
			yield* (_T = rt.getStep(f, this, 0)).ChangeTurf(T("/turf/closed/wall/mineral/cult"));
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// girders.dm:394
rt.def("/obj/structure/girder/cult/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/runed_metal"), rt.getStep(f, this, 0), 1);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// girders.dm:399
rt.def("/obj/structure/girder/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_FLOORWALL) {
		return rt.alist(f, ["mode", RCD_FLOORWALL, "delay", 20, "cost", 8]);
	} else if (the_rcd.mode === RCD_DECONSTRUCT) {
		return rt.alist(f, ["mode", RCD_DECONSTRUCT, "delay", 20, "cost", 13]);
	}
	return 0;
});

// girders.dm:407
rt.def("/obj/structure/girder/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let _T: Value = rt.getStep(f, this, 0);
	if (passed_mode === 1) {
		to_chat(user, "<span class='notice'>You finish a wall.</span>");
		yield* _T.ChangeTurf(T("/turf/closed/wall"));
		yield* qdel(this);
		return 1;
	} else if (passed_mode === RCD_DECONSTRUCT) {
		to_chat(user, "<span class='notice'>You deconstruct the girder.</span>");
		yield* qdel(this);
		return 1;
	}
	return 0;
}, true);
