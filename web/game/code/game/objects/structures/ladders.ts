// Based on /tg/station's code/game/objects/structures/ladders.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12791, "/obj/structure/ladder", "/obj/structure", {
	id: null,
	height: 0,
	down: null,
	up: null,
	name: "ladder",
	desc: "A sturdy metal ladder.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "ladder11",
});

// ladders.dm:17
rt.def("/obj/structure/ladder/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	GLOB.ladders += this;
	parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, false);

// ladders.dm:22
rt.def("/obj/structure/ladder/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.ladders -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// ladders.dm:26
rt.def("/obj/structure/ladder/proc/LateInitialize", function LateInitialize(f: Frame) {
	let L: Value = null;
	for (L of each(GLOB.ladders, T("/obj/structure/ladder"))) {
		if (L.id == this.id) {
			if (L.height == this.height - 1) {
				this.down = L;
				continue;
			}
			if (L.height == this.height + 1) {
				this.up = L;
				continue;
			}
		}
		if (this.up && this.down) {
			break;
		}
	}
	this.update_icon();
	return f.dot;
});

// ladders.dm:41
rt.def("/obj/structure/ladder/proc/update_icon", function update_icon(f: Frame) {
	if (this.up && this.down) {
		this.icon_state = "ladder11";
	} else if (this.up) {
		this.icon_state = "ladder10";
	} else if (this.down) {
		this.icon_state = "ladder01";
	} else {
		this.icon_state = "ladder00";
	}
	return f.dot;
});

// ladders.dm:54
rt.def("/obj/structure/ladder/proc/go_up", function* go_up(f: Frame, user: Value, is_ghost: Value) {
	if (!is_ghost) {
		this.show_fluff_message(1, user);
		yield* this.up.add_fingerprint(user);
	}
	user.loc = rt.getStep(f, this.up, 0);
	return f.dot;
}, true);

// ladders.dm:60
rt.def("/obj/structure/ladder/proc/go_down", function* go_down(f: Frame, user: Value, is_ghost: Value) {
	if (!is_ghost) {
		this.show_fluff_message(0, user);
		yield* this.down.add_fingerprint(user);
	}
	user.loc = rt.getStep(f, this.down, 0);
	return f.dot;
}, true);

// ladders.dm:66
rt.def("/obj/structure/ladder/proc/use", function* use(f: Frame, user: Value, is_ghost: Value) {
	is_ghost ??= 0;
	if (this.up && this.down) {
		const subject = (yield* alert("Go up or down the ladder?", "Ladder", "Up", "Down", "Cancel"));
		if (subject === "Up") {
			yield* this.go_up(user, is_ghost);
		} else if (subject === "Down") {
			yield* this.go_down(user, is_ghost);
		} else if (subject === "Cancel") {
			return f.dot;
		}
	} else if (this.up) {
		yield* this.go_up(user, is_ghost);
	} else if (this.down) {
		yield* this.go_down(user, is_ghost);
	} else {
		to_chat(user, `<span class='warning'>${this} doesn't seem to lead anywhere!</span>`);
	}
	if (is_ghost) return f.dot;
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// ladders.dm:85
rt.def("/obj/structure/ladder/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.can_use(user)) return f.dot;
	yield* this.use(user);
	return f.dot;
}, true);

// ladders.dm:89
rt.def("/obj/structure/ladder/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// ladders.dm:92
rt.def("/obj/structure/ladder/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	return (yield* this.attack_hand(user));
}, true);

// ladders.dm:95
rt.def("/obj/structure/ladder/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	yield* this.use(user, 1);
	return f.dot;
}, true);

// ladders.dm:99
rt.def("/obj/structure/ladder/proc/show_fluff_message", function show_fluff_message(f: Frame, up: Value, user: Value) {
	if (up) {
		user.visible_message(fmt("＀ climbs up ％！.", [user, this]), fmt("<span class='notice'>You climb up ％！.</span>", [this]));
	} else {
		user.visible_message(fmt("＀ climbs down ％！.", [user, this]), fmt("<span class='notice'>You climb down ％！.</span>", [this]));
	}
	return f.dot;
});

rt.type(12792, "/obj/structure/ladder/unbreakable", "/obj/structure/ladder", {
	name: "sturdy ladder",
	desc: "An extremely sturdy metal ladder.",
});

// ladders.dm:108
rt.def("/obj/structure/ladder/unbreakable/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);
