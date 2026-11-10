// Based on /tg/station's code/game/objects/items/devices/taperecorder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9289, "/obj/item/device/taperecorder", "/obj/item/device", {
	recording: 0,
	playing: 0,
	playsleepseconds: 0,
	mytape: null,
	open_panel: 0,
	canprint: 1,
	starting_tape_type: rt.typePath("/obj/item/device/tape/random"),
	flags: 16,
	name: "universal recorder",
	desc: "A device that can record to cassette tapes, and play them. It automatically translates the content in playback.",
	icon_state: "taperecorder_empty",
	item_state: "analyzer",
	w_class: 2,
	slot_flags: 512,
	materials: null,
	force: 2,
	throwforce: 0,
});

// taperecorder.dm:9
rt.def("/obj/item/device/taperecorder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 60, "$glass", 30]);
	return f.dot;
});

// taperecorder.dm:22
rt.def("/obj/item/device/taperecorder/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (this.starting_tape_type) {
		this.mytape = (yield* new_(this.starting_tape_type, this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// taperecorder.dm:29
rt.def("/obj/item/device/taperecorder/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The wire panel is ${this.open_panel ? "opened" : "closed"}.`);
	return f.dot;
}, false);

// taperecorder.dm:34
rt.def("/obj/item/device/taperecorder/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!(!this.mytape && rt.istype(I, T("/obj/item/device/tape")))) return f.dot;
	if (!(yield* user.transferItemToLoc(I, this))) {
		return f.dot;
	}
	this.mytape = I;
	to_chat(user, `<span class='notice'>You insert ${I} into ${this}.</span>`);
	yield* this.update_icon();
	return f.dot;
}, true);

// taperecorder.dm:44
rt.def("/obj/item/device/taperecorder/proc/eject", function* eject(f: Frame, user: Value) {
	if (!this.mytape) return f.dot;
	to_chat(user, `<span class='notice'>You remove ${this.mytape} from ${this}.</span>`);
	yield* this.stop();
	yield* user.put_in_hands(this.mytape);
	this.mytape = null;
	yield* this.update_icon();
	return f.dot;
}, true);

// taperecorder.dm:51
rt.def("/obj/item/device/taperecorder/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	this.mytape.ruin();
	yield* parent_proc();
	return f.dot;
}, true);

// taperecorder.dm:55
rt.def("/obj/item/device/taperecorder/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user) {
		if (this.mytape) {
			if (!user.is_holding(this)) {
				yield* parent_proc();
				return f.dot;
			}
			yield* this.eject(user);
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// taperecorder.dm:66
rt.def("/obj/item/device/taperecorder/proc/can_use", function can_use(f: Frame, user: Value) {
	if (user && ismob(user)) {
		if (!user.incapacitated()) {
			return 1;
		}
	}
	return 0;
});

// taperecorder.dm:76
rt.def("/obj/item/device/taperecorder/verb/ejectverb", function* ejectverb(f: Frame) {
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (!this.mytape) {
		return f.dot;
	}
	yield* this.eject(f.usr);
	return f.dot;
}, true, { verb: { name: "Eject Tape", category: "Object" } });

// taperecorder.dm:85
rt.def("/obj/item/device/taperecorder/proc/update_icon", function update_icon(f: Frame) {
	if (!this.mytape) {
		this.icon_state = "taperecorder_empty";
	} else if (this.recording) {
		this.icon_state = "taperecorder_recording";
	} else if (this.playing) {
		this.icon_state = "taperecorder_playing";
	} else {
		this.icon_state = "taperecorder_idle";
	}
	return f.dot;
});

// taperecorder.dm:96
rt.def("/obj/item/device/taperecorder/proc/Hear", function Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (!(this.mytape && this.recording)) return f.dot;
	this.mytape.timestamp += this.mytape.used_capacity;
	this.mytape.storedinfo += `[${time2text(this.mytape.used_capacity * 10, "mm:ss")}] ${message}`;
	return f.dot;
});

// taperecorder.dm:104
rt.def("/obj/item/device/taperecorder/verb/record", function* record(f: Frame) {
	let used: Value = null, max: Value = null;
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (!this.mytape || this.mytape.ruined) {
		return f.dot;
	}
	if (this.recording) {
		return f.dot;
	}
	if (this.playing) {
		return f.dot;
	}
	if (this.mytape.used_capacity < this.mytape.max_capacity) {
		to_chat(f.usr, "<span class='notice'>Recording started.</span>");
		this.recording = 1;
		yield* this.update_icon();
		this.mytape.timestamp += this.mytape.used_capacity;
		this.mytape.storedinfo += `[${time2text(this.mytape.used_capacity * 10, "mm:ss")}] Recording started.`;
		used = this.mytape.used_capacity;
		max = this.mytape.max_capacity;
		used;
		while (used < max) {
			if (this.recording == 0) {
				break;
			}
			this.mytape.used_capacity++;
			used++;
			yield* sleep(10);
		}
		this.recording = 0;
		yield* this.update_icon();
	} else {
		to_chat(f.usr, "<span class='notice'>The tape is full.</span>");
	}
	return f.dot;
}, true, { verb: { name: "Start Recording", category: "Object" } });

// taperecorder.dm:137
rt.def("/obj/item/device/taperecorder/verb/stop", function stop(f: Frame) {
	let _T: Value = null;
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (this.recording) {
		this.recording = 0;
		this.mytape.timestamp += this.mytape.used_capacity;
		this.mytape.storedinfo += `[${time2text(this.mytape.used_capacity * 10, "mm:ss")}] Recording stopped.`;
		to_chat(f.usr, "<span class='notice'>Recording stopped.</span>");
		return f.dot;
	} else if (this.playing) {
		this.playing = 0;
		(_T = rt.getStep(f, this, 0)).visible_message("<font color=Maroon><B>Tape Recorder</B>: Playback stopped.</font>");
	}
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Stop", category: "Object" } });

// taperecorder.dm:157
rt.def("/obj/item/device/taperecorder/verb/play", function* play(f: Frame) {
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (!this.mytape || this.mytape.ruined) {
		return f.dot;
	}
	if (this.recording) {
		return f.dot;
	}
	if (this.playing) {
		return f.dot;
	}
	this.playing = 1;
	yield* this.update_icon();
	to_chat(f.usr, "<span class='notice'>Playing started.</span>");
	let used: Value = this.mytape.used_capacity;
	let max: Value = this.mytape.max_capacity;
	let i: Value = 1;
	while (used < max) {
		if (!this.mytape) {
			break;
		}
		if (this.playing == 0) {
			break;
		}
		if (rt.len(f, this.mytape.storedinfo) < i) {
			break;
		}
		yield* this.say(rt.index(this.mytape.storedinfo, i));
		if (rt.len(f, this.mytape.storedinfo) < i + 1) {
			this.playsleepseconds = 1;
			yield* sleep(10);
			yield* this.say("End of recording.");
		} else {
			this.playsleepseconds = rt.index(this.mytape.timestamp, i + 1) - rt.index(this.mytape.timestamp, i);
		}
		if (this.playsleepseconds > 14) {
			yield* sleep(10);
			yield* this.say(`Skipping ${this.playsleepseconds} seconds of silence`);
			this.playsleepseconds = 1;
		}
		i++;
		yield* sleep(10 * this.playsleepseconds);
	}
	this.playing = 0;
	yield* this.update_icon();
	return f.dot;
}, true, { verb: { name: "Play Tape", category: "Object" } });

// taperecorder.dm:196
rt.def("/obj/item/device/taperecorder/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.mytape || this.mytape.ruined) {
		return f.dot;
	}
	if (this.recording) {
		yield* this.stop();
	} else {
		yield* this.record();
	}
	return f.dot;
}, true);

// taperecorder.dm:208
rt.def("/obj/item/device/taperecorder/verb/print_transcript", function* print_transcript(f: Frame) {
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (!this.mytape) {
		return f.dot;
	}
	if (!this.canprint) {
		to_chat(f.usr, "<span class='notice'>The recorder can't print that fast!</span>");
		return f.dot;
	}
	if (this.recording || this.playing) {
		return f.dot;
	}
	to_chat(f.usr, "<span class='notice'>Transcript printed.</span>");
	let _P: Value = (yield* new_(T("/obj/item/weapon/paper"), rt.getStep(f, this, 0)));
	let t1: Value = "<B>Transcript:</B><BR><BR>";
	let i: Value = 1;
	while (rt.len(f, this.mytape.storedinfo) >= i) {
		t1 += `${rt.index(this.mytape.storedinfo, i)}<BR>`;
		i++;
	}
	_P.info = t1;
	_P.name = "paper- 'Transcript'";
	yield* f.usr.put_in_hands(_P);
	this.canprint = 0;
	yield* sleep(300);
	this.canprint = 1;
	return f.dot;
}, true, { verb: { name: "Print Transcript", category: "Object" } });

rt.type(9291, "/obj/item/device/tape", "/obj/item/device", {
	max_capacity: 600,
	used_capacity: 0,
	storedinfo: null,
	timestamp: null,
	ruined: 0,
	name: "tape",
	desc: "A magnetic tape that can hold up to ten minutes of content.",
	icon_state: "tape_white",
	item_state: "analyzer",
	w_class: 1,
	materials: null,
	force: 1,
	throwforce: 0,
});

// taperecorder.dm:247
rt.def("/obj/item/device/tape/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.storedinfo = list();

	this.timestamp = list();
	this.materials = rt.alist(f, ["$metal", 20, "$glass", 5]);
	return f.dot;
});

// taperecorder.dm:252
rt.def("/obj/item/device/tape/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	this.ruin();
	yield* parent_proc();
	return f.dot;
}, true);

// taperecorder.dm:256
rt.def("/obj/item/device/tape/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.ruined) return f.dot;
	to_chat(user, "<span class='notice'>You pull out all the tape!</span>");
	this.ruin();
	return f.dot;
});

// taperecorder.dm:264
rt.def("/obj/item/device/tape/proc/ruin", function ruin(f: Frame) {
	if (!this.ruined) {
		this.add_overlay("ribbonoverlay");
	}
	this.ruined = 1;
	return f.dot;
});

// taperecorder.dm:270
rt.def("/obj/item/device/tape/proc/fix", function fix(f: Frame) {
	this.cut_overlay("ribbonoverlay");
	this.ruined = 0;
	return f.dot;
});

// taperecorder.dm:277
rt.def("/obj/item/device/tape/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!this.ruined) return f.dot;
	let delay: Value = -1;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		delay = 120 * I.toolspeed;
	} else if (rt.istype(I, T("/obj/item/weapon/pen"))) {
		delay = 180;
	}
	if (delay == -1) return f.dot;
	to_chat(user, "<span class='notice'>You start winding the tape back in...</span>");
	if (!(yield* do_after(user, delay, { target: this }))) return f.dot;
	to_chat(user, "<span class='notice'>You wound the tape back in.</span>");
	this.fix();
	return f.dot;
}, true);

rt.type(9292, "/obj/item/device/tape/random", "/obj/item/device/tape", {});

// taperecorder.dm:289
rt.def("/obj/item/device/tape/random/proc/New", function* New(f: Frame) {
	this.icon_state = `tape_${pick("white", "blue", "red", "yellow", "purple")}`;
	yield* parent_proc();
	return f.dot;
}, true);
