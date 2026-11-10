// Based on /tg/station's code/modules/events/wizard/greentext.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(342, "/datum/round_event/wizard/greentext", "/datum/round_event/wizard", {});

// greentext.dm:10
rt.def("/datum/round_event/wizard/greentext/proc/start", function* start(f: Frame) {
	let M: Value = null, H: Value = null;
	let holder_canadates: Value = (yield* GLOB.player_list.Copy());
	for (M of each(holder_canadates, T("/mob"))) {
		if (!rt.istype(M, T("/mob/living/carbon/human"))) {
			holder_canadates -= M;
		}
	}
	if (!holder_canadates) {
		return 0;
	}
	yield* new_(T("/obj/item/weapon/greentext"), (H = pick(holder_canadates)).loc);
	to_chat(H, "<font color='green'>The mythical greentext appear at your feet! Pick it up if you dare...</font>");
	return f.dot;
}, true);

rt.type(7483, "/obj/item/weapon/greentext", "/obj/item/weapon", {
	last_holder: null,
	new_holder: null,
	color_altered_mobs: null,
	quiet: 0,
	name: "greentext",
	desc: "No one knows what this massive tome does, but it feels <i><font color='green'>desirable</font></i> all the same...",
	w_class: 4,
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "greentext",
	resistance_flags: 34,
});

// greentext.dm:30
rt.def("/obj/item/weapon/greentext/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.color_altered_mobs = list();
	return f.dot;
});

// greentext.dm:35
rt.def("/obj/item/weapon/greentext/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	(rt.modGl("poi_list", this, rt.bitOr));
	return f.dot;
}, true);

// greentext.dm:39
rt.def("/obj/item/weapon/greentext/proc/equipped", function* equipped(f: Frame, user: Value) {
	to_chat(user, "<font color='green'>So long as you leave this place with greentext in hand you know will be happy...</font>");
	if (user.mind && rt.len(f, user.mind.objectives) > 0) {
		to_chat(user, "<span class='warning'>... so long as you still perform your other objectives that is!</span>");
	}
	this.new_holder = user;
	if (!this.last_holder) {
		this.last_holder = user;
	}
	if (!rt.isIn(f, user, this.color_altered_mobs)) {
		this.color_altered_mobs += user;
	}
	user.add_atom_colour("#00FF00", ADMIN_COLOUR_PRIORITY);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// greentext.dm:52
rt.def("/obj/item/weapon/greentext/proc/dropped", function* dropped(f: Frame, user: Value) {
	if (rt.isIn(f, user, this.color_altered_mobs)) {
		to_chat(user, "<span class='warning'>A sudden wave of failure washes over you...</span>");
		user.add_atom_colour("#FF0000", ADMIN_COLOUR_PRIORITY);
	}
	this.last_holder = null;
	this.new_holder = null;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* parent_proc();
	return f.dot;
}, true);

// greentext.dm:61
rt.def("/obj/item/weapon/greentext/proc/process", function* process(f: Frame) {
	let O: Value = null;
	if (this.new_holder && this.new_holder.z == ZLEVEL_CENTCOM) {
		to_chat(this.new_holder, "<font color='green'>At last it feels like victory is assured!</font>");
		if (!rt.isIn(f, this.new_holder, GLOB.SSticker.mode.traitors)) {
			GLOB.SSticker.mode.traitors += this.new_holder.mind;
		}
		this.new_holder.mind.special_role = "winner";
		(O = (yield* new_(T("/datum/objective"), "Succeed"))).completed = 1;
		O.owner = this.new_holder.mind;
		this.new_holder.mind.objectives += O;
		this.new_holder.log_message("<font color='green'>Won with greentext!!!</font>", "Attack log");
		this.color_altered_mobs -= this.new_holder;
		(rt.modSrcVar(f, "resistance_flags", 8, rt.bitOr));
		yield* qdel(this);
	}
	if (!(this.last_holder && this.last_holder != this.new_holder)) return f.dot;
	to_chat(this.last_holder, "<span class='warning'>A sudden wave of failure washes over you...</span>");
	this.last_holder.add_atom_colour("#FF0000", ADMIN_COLOUR_PRIORITY);
	this.last_holder = this.new_holder;
	return f.dot;
}, true, { waitfor: false });

// greentext.dm:81
rt.def("/obj/item/weapon/greentext/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	let M: Value = null, message: Value = null;
	if (!rt.bitAnd(this.resistance_flags, 8) && !force) {
		return QDEL_HINT_LETMELIVE;
	}
	f.dot = (yield* parent_proc());
	yield* GLOB.poi_list.Remove(this);
	for (M of each(GLOB.mob_list, T("/mob"))) {
		message = "<span class='warning'>A dark temptation has passed from this world";
		if (rt.isIn(f, M, this.color_altered_mobs)) {
			message += " and you're finally able to forgive yourself";
			if (M.color == "#FF0000" || M.color == "#00FF00") {
				M.remove_atom_colour(ADMIN_COLOUR_PRIORITY);
			}
		}
		message += "...</span>";
		if (!this.quiet) {
			to_chat(M, message);
		}
	}
	return f.dot;
}, true);
