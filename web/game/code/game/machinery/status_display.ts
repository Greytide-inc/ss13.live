// Based on /tg/station's code/game/machinery/status_display.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10829, "/obj/machinery/status_display", "/obj/machinery", {
	mode: 1,
	picture_state: null,
	message1: "",
	message2: "",
	index1: null,
	index2: null,
	frequency: 1435,
	supply_display: 0,
	shuttle_id: null,
	friendc: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 10,
	icon: rt.rsc("icons/obj/status_display.dmi"),
	icon_state: "frame",
	name: "status display",
	density: 0,
	maptext_height: 26,
	maptext_width: 32,
});

// status_display.dm:48
rt.def("/obj/machinery/status_display/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.ai_status_displays.Add(this);
	GLOB.SSradio.add_object(this, this.frequency);
	return f.dot;
}, true);

// status_display.dm:54
rt.def("/obj/machinery/status_display/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	yield* GLOB.ai_status_displays.Remove(this);
	return (yield* parent_proc());
}, true);

// status_display.dm:61
rt.def("/obj/machinery/status_display/proc/process", function process(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.remove_display();
		return f.dot;
	}
	this.update();
	return f.dot;
}, false, { waitfor: false });

// status_display.dm:67
rt.def("/obj/machinery/status_display/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		yield* parent_proc(severity);
		return f.dot;
	}
	this.set_picture("ai_bsod");
	yield* parent_proc(severity);
	return f.dot;
}, true);

// status_display.dm:76
rt.def("/obj/machinery/status_display/proc/update", function update(f: Frame) {
	let line1: Value = null, line2: Value = null, message1_len: Value = null, message2_len: Value = null;
	if (this.friendc && this.mode != 4) {
		this.set_picture("ai_friend");
		return f.dot;
	}
	if (this.mode === 0) {
		this.remove_display();
	} else if (this.mode === 1) {
		this.display_shuttle_status();
	} else if (this.mode === 2) {
		if (!this.index1) {
			line1 = this.message1;
		} else {
			line1 = copytext(this.message1 + "|" + this.message1, this.index1, this.index1 + 5);
			message1_len = rt.length(this.message1);
			if ((this.index1 += 2) > message1_len) {
				this.index1 -= message1_len;
			}
		}
		if (!this.index2) {
			line2 = this.message2;
		} else {
			line2 = copytext(this.message2 + "|" + this.message2, this.index2, this.index2 + 5);
			message2_len = rt.length(this.message2);
			if ((this.index2 += 2) > message2_len) {
				this.index2 -= message2_len;
			}
		}
		this.update_display(line1, line2);
	} else if (this.mode === 4) {
		line1 = null;
		line2 = null;
		// tg bug: a map with no cargo shuttle (creative mode's) has SSshuttle.supply null; tg read null.mode every tick. Blank screen instead.
		if (!GLOB.SSshuttle.supply) {
		} else if (GLOB.SSshuttle.supply.mode == "idle") {
			if (GLOB.SSshuttle.supply.z == ZLEVEL_STATION) {
				line1 = "CARGO";
				line2 = "Docked";
			}
		} else {
			line1 = "CARGO";
			if (lentext((line2 = GLOB.SSshuttle.supply.getTimerStr())) > 5) {
				line2 = "Error";
			}
		}
		this.update_display(line1, line2);
	} else if (this.mode === 5) {
		this.display_shuttle_status();
	}
	return f.dot;
});

// status_display.dm:125
rt.def("/obj/machinery/status_display/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.mode === 1 || this.mode === 2 || this.mode === 4 || this.mode === 5) {
		to_chat(user, `The display says:<br>\t<xmp>${this.message1}</xmp><br>\t<xmp>${this.message2}</xmp>`);
	}
	if (!(this.mode == 1 && GLOB.SSshuttle.emergency)) return f.dot;
	to_chat(user, `Current Shuttle: ${GLOB.SSshuttle.emergency.name}`);
	return f.dot;
}, false);

// status_display.dm:135
rt.def("/obj/machinery/status_display/proc/set_message", function set_message(f: Frame, m1: Value, m2: Value) {
	if (m1) {
		this.index1 = (rt.length(m1) > 5 ? 1 : 0);
		this.message1 = m1;
	} else {
		this.message1 = "";
		this.index1 = 0;
	}
	if (m2) {
		this.index2 = (rt.length(m2) > 5 ? 1 : 0);
		this.message2 = m2;
	} else {
		this.message2 = "";
		this.index2 = 0;
	}
	return f.dot;
});

// status_display.dm:149
rt.def("/obj/machinery/status_display/proc/set_picture", function set_picture(f: Frame, state: Value) {
	this.picture_state = state;
	this.remove_display();
	this.add_overlay(this.picture_state);
	return f.dot;
});

// status_display.dm:154
rt.def("/obj/machinery/status_display/proc/update_display", function update_display(f: Frame, line1: Value, line2: Value) {
	let new_text: Value = `<div style="font-size:${"5pt"};color:${"#09f"};font:'${"Arial Black"}';text-align:center;" valign="top">${line1}<br>${line2}</div>`;
	if (this.maptext == new_text) return f.dot;
	this.maptext = new_text;
	return f.dot;
});

// status_display.dm:159
rt.def("/obj/machinery/status_display/proc/remove_display", function remove_display(f: Frame) {
	this.cut_overlays();
	if (!this.maptext) return f.dot;
	this.maptext = "";
	return f.dot;
});

// status_display.dm:166
rt.def("/obj/machinery/status_display/proc/display_shuttle_status", function display_shuttle_status(f: Frame) {
	let shuttle: Value = null, line1: Value = null, line2: Value = null;
	if (this.mode == 1) {
		shuttle = GLOB.SSshuttle.emergency;
	} else {
		shuttle = GLOB.SSshuttle.getShuttle(this.shuttle_id);
	}
	if (!shuttle) {
		this.update_display("shutl?", "");
	} else if (shuttle.timer) {
		line1 = `-${shuttle.getModeStr()}-`;
		if (rt.length((line2 = shuttle.getTimerStr())) > 5) {
			line2 = "Error!";
		}
		this.update_display(line1, line2);
	} else {
		this.remove_display();
	}
	return f.dot;
});

// status_display.dm:188
rt.def("/obj/machinery/status_display/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	if (this.supply_display) {
		this.mode = 4;
		return f.dot;
	}
	const command = rt.index(signal.data, "command");
	if (command === "blank") {
		this.mode = 0;
	} else if (command === "shuttle") {
		this.mode = 1;
	} else if (command === "message") {
		this.mode = 2;
		this.set_message(rt.index(signal.data, "msg1"), rt.index(signal.data, "msg2"));
	} else if (command === "alert") {
		this.mode = 3;
		this.set_picture(rt.index(signal.data, "picture_state"));
	}
	return f.dot;
});

rt.type(10830, "/obj/machinery/ai_status_display", "/obj/machinery", {
	mode: 0,
	picture_state: null,
	emotion: "Neutral",
	anchored: 1,
	icon: rt.rsc("icons/obj/status_display.dmi"),
	desc: "A small screen which the AI can use to present itself.",
	icon_state: "frame",
	name: "１AI display",
	density: 0,
});

// status_display.dm:217
rt.def("/obj/machinery/ai_status_display/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.ai_status_displays.Add(this);
	return f.dot;
}, true);

// status_display.dm:221
rt.def("/obj/machinery/ai_status_display/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.ai_status_displays.Remove(this);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// status_display.dm:225
rt.def("/obj/machinery/ai_status_display/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon/ai"))) return f.dot;
	yield* user.ai_statuschange();
	return f.dot;
}, true);

// status_display.dm:229
rt.def("/obj/machinery/ai_status_display/proc/process", function process(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.cut_overlays();
		return f.dot;
	}
	this.update();
	return f.dot;
}, false, { waitfor: false });

// status_display.dm:236
rt.def("/obj/machinery/ai_status_display/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		yield* parent_proc(severity);
		return f.dot;
	}
	this.set_picture("ai_bsod");
	yield* parent_proc(severity);
	return f.dot;
}, true);

// status_display.dm:244
rt.def("/obj/machinery/ai_status_display/proc/update", function update(f: Frame) {
	if (this.mode == 0) {
		this.cut_overlays();
		return f.dot;
	}
	if (this.mode == 1) {
		if (this.emotion === "Very Happy") {
			this.set_picture("ai_veryhappy");
		} else if (this.emotion === "Happy") {
			this.set_picture("ai_happy");
		} else if (this.emotion === "Neutral") {
			this.set_picture("ai_neutral");
		} else if (this.emotion === "Unsure") {
			this.set_picture("ai_unsure");
		} else if (this.emotion === "Confused") {
			this.set_picture("ai_confused");
		} else if (this.emotion === "Sad") {
			this.set_picture("ai_sad");
		} else if (this.emotion === "BSOD") {
			this.set_picture("ai_bsod");
		} else if (this.emotion === "Blank") {
			this.set_picture("ai_off");
		} else if (this.emotion === "Problems?") {
			this.set_picture("ai_trollface");
		} else if (this.emotion === "Awesome") {
			this.set_picture("ai_awesome");
		} else if (this.emotion === "Dorfy") {
			this.set_picture("ai_urist");
		} else if (this.emotion === "Facepalm") {
			this.set_picture("ai_facepalm");
		} else if (this.emotion === "Friend Computer") {
			this.set_picture("ai_friend");
		} else if (this.emotion === "Blue Glow") {
			this.set_picture("ai_sal");
		} else if (this.emotion === "Red Glow") {
			this.set_picture("ai_hal");
		}
		return f.dot;
	}
	if (this.mode != 2) return f.dot;
	this.set_picture("ai_bsod");
	return f.dot;
});

// status_display.dm:289
rt.def("/obj/machinery/ai_status_display/proc/set_picture", function set_picture(f: Frame, state: Value) {
	this.picture_state = state;
	this.cut_overlays();
	this.add_overlay(this.picture_state);
	return f.dot;
});
