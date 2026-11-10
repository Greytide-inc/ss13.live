// Based on /tg/station's code/game/objects/items/devices/instruments.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9249, "/obj/item/device/instrument", "/obj/item/device", {
	song: null,
	instrumentId: "generic",
	instrumentExt: "ogg",
	name: "generic instrument",
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
});

// instruments.dm:12
rt.def("/obj/item/device/instrument/proc/New", function* New(f: Frame) {
	this.song = (yield* new_(T("/datum/song/handheld"), this.instrumentId, this));
	this.song.instrumentExt = this.instrumentExt;
	yield* parent_proc();
	return f.dot;
}, true);

// instruments.dm:17
rt.def("/obj/item/device/instrument/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.song);
	this.song = null;
	return (yield* parent_proc());
}, true);

// instruments.dm:22
rt.def("/obj/item/device/instrument/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} begins to play 'Gloomy Sunday'! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

// instruments.dm:26
rt.def("/obj/item/device/instrument/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!mapload) return f.dot;
	this.song.tempo = this.song.sanitize_tempo(this.song.tempo);
	return f.dot;
}, true);

// instruments.dm:31
rt.def("/obj/item/device/instrument/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return 1;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// instruments.dm:37
rt.def("/obj/item/device/instrument/proc/interact", function* interact(f: Frame, user: Value) {
	if (!user) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living")) || user.stat || user.restrained() || user.lying) {
		return f.dot;
	}
	yield* user.set_machine(this);
	yield* this.song.interact(user);
	return f.dot;
}, true);
