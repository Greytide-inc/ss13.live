// Based on /tg/station's code/modules/library/soapstone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10089, "/obj/item/soapstone", "/obj/item", {
	tool_speed: 50,
	remaining_uses: 3,
	throw_speed: 3,
	throw_range: 5,
	w_class: 1,
	name: "soapstone",
	desc: "Leave informative messages for the crew, including the crew of future shifts!\nEven if out of uses, it can still be used to remove messages.\n(Not suitable for engraving on shuttles, off station or on cats. Side effects may include beatings, bannings and orbital bombardment.)",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "soapstone",
});

// soapstone.dm:13
rt.def("/obj/item/soapstone/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.check_name();
	return f.dot;
}, true);

// soapstone.dm:17
rt.def("/obj/item/soapstone/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.remaining_uses == -1) return f.dot;
	to_chat(user, `It has ${this.remaining_uses} uses left.`);
	return f.dot;
}, false);

// soapstone.dm:22
rt.def("/obj/item/soapstone/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let message: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	let _T: Value = rt.getStep(f, target, 0);
	if (!proximity) {
		return f.dot;
	}
	let existing_message: Value = rt.locateIn(f, T("/obj/structure/chisel_message"), _T);
	if (!this.remaining_uses && !existing_message) {
		to_chat(user, `<span class='warning'>${this} is too worn out to use.</span>`);
		return f.dot;
	}
	if (!good_chisel_message_location(_T)) {
		to_chat(user, `<span class='warning'>It's not appropriate to engrave on ${_T}.</span>`);
		return f.dot;
	}
	if (existing_message) {
		user.visible_message(`<span class='notice'>${user} starts erasing ${existing_message}.</span>`, `<span class='notice'>You start erasing ${existing_message}.</span>`, "<span class='italics'>You hear a chipping sound.</span>");
		playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 50, 1, -1);
		if (yield* do_after(user, this.tool_speed, { target: existing_message })) {
			$0 = user;
			$1 = `<span class='notice'>${user} erases ${existing_message}.</span>`;
			$2 = existing_message;
			if (existing_message.creator_key == user.ckey) {
				$3 = ", refunding a use";
			} else {
				$3 = "";
			}
			$0.visible_message($1, `<span class='notice'>You erase ${$2}${$3}.</span>`);
			existing_message.persists = 0;
			yield* qdel(existing_message);
			playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 50, 1, -1);
			if (existing_message.creator_key == user.ckey) {
				this.refund_use();
			}
		}
		return f.dot;
	}
	if (!(message = (yield* stripped_input(user, "What would you like to engrave?", "Leave a message")))) {
		to_chat(user, "<span class='notice'>You decide not to engrave anything.</span>");
		return f.dot;
	}
	if (!target.Adjacent(user) && rt.locateIn(f, T("/obj/structure/chisel_message"), _T)) {
		to_chat(user, "<span class='warning'>Someone wrote here before you chose! Find another spot.</span>");
		return f.dot;
	}
	playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 50, 1, -1);
	user.visible_message(`<span class='notice'>${user} starts engraving a message into ${_T}...</span>`, `<span class='notice'>You start engraving a message into ${_T}...</span>`, "<span class='italics'>You hear a chipping sound.</span>");
	if (!(this.can_use() && (yield* do_after(user, this.tool_speed, { target: _T })) && this.can_use())) return f.dot;
	if (rt.locateIn(f, (rt.isIn(f, T("/obj/structure/chisel_message"), _T) ? 1 : 0), rt.world())) return f.dot;
	user.visible_message(`<span class='notice'>${user} leaves a message for future spacemen!</span>`, `<span class='notice'>You engrave a message into ${_T}!</span>`, "<span class='italics'>You hear a chipping sound.</span>");
	playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 50, 1, -1);
	yield* (M = (yield* new_(T("/obj/structure/chisel_message"), _T))).register(user, message);
	this.remove_use();
	return f.dot;
}, true);

// soapstone.dm:67
rt.def("/obj/item/soapstone/proc/can_use", function can_use(f: Frame) {
	return ((this.remaining_uses == -1 ? 1 : 0) || (this.remaining_uses >= 0 ? 1 : 0));
});

// soapstone.dm:70
rt.def("/obj/item/soapstone/proc/remove_use", function remove_use(f: Frame) {
	if (this.remaining_uses <= 0) {
		return f.dot;
	}
	this.remaining_uses--;
	this.check_name();
	return f.dot;
});

// soapstone.dm:76
rt.def("/obj/item/soapstone/proc/refund_use", function refund_use(f: Frame) {
	if (this.remaining_uses == -1) {
		return f.dot;
	}
	this.remaining_uses++;
	this.check_name();
	return f.dot;
});

// soapstone.dm:84
rt.def("/obj/item/soapstone/proc/check_name", function check_name(f: Frame) {
	if (this.remaining_uses) {
		this.name = rt.initial(f, this, "name");
	} else {
		this.name = `dull ${rt.initial(f, this, "name")}`;
	}
	return f.dot;
});

// soapstone.dm:102
rt.def("/proc/good_chisel_message_location", function good_chisel_message_location(f: Frame, _T: Value) {
	if (!_T) {
		f.dot = 0;
	} else if (!(rt.istype(_T, T("/turf/open/floor")) || rt.istype(_T, T("/turf/closed/wall")))) {
		f.dot = 0;
	} else {
		f.dot = 1;
	}
	return f.dot;
});

rt.type(12953, "/obj/structure/chisel_message", "/obj/structure", {
	hidden_message: null,
	creator_key: null,
	creator_name: null,
	realdate: null,
	map: null,
	persists: 1,
	like_keys: null,
	dislike_keys: null,
	original_turf: null,
	anchored: 1,
	name: "engraved message",
	desc: "A message from a past traveler.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "soapstone_message",
	layer: 2.2,
	density: 0,
	obj_integrity: 30,
	max_integrity: 30,
});

// soapstone.dm:127
rt.def("/obj/structure/chisel_message/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.like_keys = list();

	this.dislike_keys = list();
	return f.dot;
});

// soapstone.dm:133
rt.def("/obj/structure/chisel_message/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let _T: Value = null;
	f.dot = (yield* parent_proc());
	GLOB.SSpersistence.chisel_messages += this;
	this.original_turf = (_T = rt.getStep(f, this, 0));
	if (good_chisel_message_location(_T)) return f.dot;
	this.persists = 0;
	yield* qdel(this);
	return f.dot;
}, true);

// soapstone.dm:143
rt.def("/obj/structure/chisel_message/proc/register", function register(f: Frame, user: Value, newmessage: Value) {
	this.hidden_message = newmessage;
	this.creator_name = user.real_name;
	this.creator_key = user.ckey;
	this.realdate = rt.world().timeofday;
	this.map = GLOB.SSmapping.config.map_name;
	this.update_icon();
	return f.dot;
});

// soapstone.dm:151
rt.def("/obj/structure/chisel_message/proc/update_icon", function update_icon(f: Frame) {
	let newcolor: Value = null;
	parent_proc();
	let hash: Value = md5(this.hidden_message);
	this.add_atom_colour(`#${(newcolor = copytext(hash, 1, 7))}`, FIXED_COLOUR_PRIORITY);
	this.light_color = `#${newcolor}`;
	this.set_light(1);
	return f.dot;
});

// soapstone.dm:159
rt.def("/obj/structure/chisel_message/proc/pack", function pack(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "hidden_message", this.hidden_message);
	rt.setAt(data, "creator_name", this.creator_name);
	rt.setAt(data, "creator_key", this.creator_key);
	rt.setAt(data, "realdate", this.realdate);
	rt.setAt(data, "map", GLOB.SSmapping.config.map_name);
	rt.setAt(data, "x", this.original_turf.x);
	rt.setAt(data, "y", this.original_turf.y);
	rt.setAt(data, "z", this.original_turf.z);
	rt.setAt(data, "like_keys", this.like_keys);
	rt.setAt(data, "dislike_keys", this.dislike_keys);
	return data;
});

// soapstone.dm:173
rt.def("/obj/structure/chisel_message/proc/unpack", function* unpack(f: Frame, data: Value) {
	let newloc: Value = null;
	if (!rt.istype(data, T("/list"))) {
		return f.dot;
	}
	this.hidden_message = rt.at(data, "hidden_message");
	this.creator_name = rt.at(data, "creator_name");
	this.creator_key = rt.at(data, "creator_key");
	this.realdate = rt.at(data, "realdate");
	this.like_keys = rt.at(data, "like_keys");
	if (!this.like_keys) {
		this.like_keys = list();
	}
	this.dislike_keys = rt.at(data, "dislike_keys");
	if (!this.dislike_keys) {
		this.dislike_keys = list();
	}
	let x: Value = rt.at(data, "x");
	let y: Value = rt.at(data, "y");
	let z: Value = rt.at(data, "z");
	if (isturf((newloc = rt.locate(x, y, z)))) {
		yield* this.forceMove(newloc);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// soapstone.dm:196
rt.def("/obj/structure/chisel_message/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='warning'>${this.hidden_message}</span>`);
	return f.dot;
}, false);

// soapstone.dm:201
rt.def("/obj/structure/chisel_message/proc/Destroy", function* Destroy(f: Frame) {
	if (this.persists) {
		GLOB.SSpersistence.SaveChiselMessage(this);
	}
	GLOB.SSpersistence.chisel_messages -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// soapstone.dm:207
rt.def("/obj/structure/chisel_message/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.always_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "engraved_message", this.name, 600, 300, master_ui, state))).open();
	return f.dot;
}, true);

// soapstone.dm:213
rt.def("/obj/structure/chisel_message/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "hidden_message", this.hidden_message);
	rt.setAt(data, "realdate", SQLtime(this.realdate));
	rt.setAt(data, "num_likes", rt.len(f, this.like_keys));
	rt.setAt(data, "num_dislikes", rt.len(f, this.dislike_keys));
	rt.setAt(data, "is_creator", (user.ckey == this.creator_key ? 1 : 0));
	rt.setAt(data, "has_liked", (rt.isIn(f, user.ckey, this.like_keys) ? 1 : 0));
	rt.setAt(data, "has_disliked", (rt.isIn(f, user.ckey, this.dislike_keys) ? 1 : 0));
	if (check_rights_for(user.client, 2)) {
		rt.setAt(data, "admin_mode", 1);
		rt.setAt(data, "creator_key", this.creator_key);
		rt.setAt(data, "creator_name", this.creator_name);
	}
	return data;
});

// soapstone.dm:231
rt.def("/obj/structure/chisel_message/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let confirm: Value = null;
	// An href can reach this with the window closed or out of reach: only an interactive window may act.
	if (!ui || ui.status != 2) {
		return 1;
	}
	let user: Value = f.usr;
	let is_admin: Value = check_rights_for(user.client, 2);
	let is_creator: Value = (user.ckey == this.creator_key ? 1 : 0);
	let has_liked: Value = (rt.isIn(f, user.ckey, this.like_keys) ? 1 : 0);
	let has_disliked: Value = (rt.isIn(f, user.ckey, this.dislike_keys) ? 1 : 0);
	if (action === "like") {
		if (is_creator) {
			return f.dot;
		}
		if (has_disliked) {
			this.dislike_keys -= user.ckey;
		}
		(rt.modSrcVar(f, "like_keys", user.ckey, rt.bitOr));
		f.dot = 1;
	} else if (action === "dislike") {
		if (is_creator) {
			return f.dot;
		}
		if (has_liked) {
			this.like_keys -= user.ckey;
		}
		(rt.modSrcVar(f, "dislike_keys", user.ckey, rt.bitOr));
		f.dot = 1;
	} else if (action === "neutral") {
		if (is_creator) {
			return f.dot;
		}
		this.dislike_keys -= user.ckey;
		this.like_keys -= user.ckey;
		f.dot = 1;
	} else if (action === "delete") {
		if (!is_admin) {
			return f.dot;
		}
		if ((confirm = (yield* alert(user, "Confirm deletion of engraved message?", "Confirm Deletion", "Yes", "No"))) != "Yes") return f.dot;
		this.persists = 0;
		yield* qdel(this);
	}
	return f.dot;
}, true);
