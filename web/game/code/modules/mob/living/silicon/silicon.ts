// Based on /tg/station's code/modules/mob/living/silicon/silicon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g, add, fmt } = rt;


rt.type(4832, "/mob/living/silicon", "/mob/living", {
	syndicate: 0,
	laws: null,
	last_lawchange_announce: 0,
	alarms_to_show: null,
	alarms_to_clear: null,
	designation: "",
	radiomod: "",
	aicamera: null,
	radio: null,
	alarm_types_show: null,
	alarm_types_clear: null,
	lawcheck: null,
	ioncheck: null,
	devillawcheck: null,
	med_hud: 4,
	sec_hud: 2,
	d_hud: 5,
	law_change_counter: 0,
	verb_say: "states",
	verb_ask: "queries",
	verb_exclaim: "declares",
	verb_yell: "alarms",
	initial_language_holder: rt.typePath("/datum/language_holder/synthetic"),
	hud_possible: null,
	gender: "neuter",
	voice_name: "synthesized voice",
	has_unlimited_silicon_privilege: 1,
	see_in_dark: 8,
	bubble_icon: "machine",
	weather_immunities: null,
	possible_a_intents: null,
});

// silicon.dm:18
rt.def("/mob/living/silicon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alarms_to_show = list();

	this.alarms_to_clear = list();
	this.hud_possible = list("15", "8", "9", "13");
	this.alarm_types_show = rt.alist(f, ["Motion", 0, "Fire", 0, "Atmosphere", 0, "Power", 0, "Camera", 0]);
	this.alarm_types_clear = rt.alist(f, ["Motion", 0, "Fire", 0, "Atmosphere", 0, "Power", 0, "Camera", 0]);

	this.lawcheck = rt.op(f, "CreateMultidimensionalList", [1], [1]);

	this.ioncheck = rt.op(f, "CreateMultidimensionalList", [1], [1]);

	this.devillawcheck = rt.op(f, "CreateMultidimensionalList", [1], [5]);

	this.weather_immunities = list("ash");
	this.possible_a_intents = list("help", "harm");
	return f.dot;
});

// silicon.dm:41
rt.def("/mob/living/silicon/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	yield* parent_proc();
	GLOB.silicon_mobs += this;
	(diag_hud = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_to_hud(this);
	this.diag_hud_set_status();
	this.diag_hud_set_health();
	return f.dot;
}, true);

// silicon.dm:57
rt.def("/mob/living/silicon/proc/Destroy", function* Destroy(f: Frame) {
	this.radio = null;
	this.aicamera = null;
	GLOB.silicon_mobs -= this;
	return (yield* parent_proc());
}, true);

// silicon.dm:70
rt.def("/mob/living/silicon/proc/queueAlarm", function queueAlarm(f: Frame, message: Value, type: Value, incoming: Value) {
	let msg: Value = null, key: Value = null;
	incoming ??= 1;
	let in_cooldown: Value = ((rt.len(f, this.alarms_to_show) > 0 ? 1 : 0) || (rt.len(f, this.alarms_to_clear) > 0 ? 1 : 0));
	if (incoming) {
		this.alarms_to_show += message;
		rt.modAt(this.alarm_types_show, type, 1, add);
	} else {
		this.alarms_to_clear += message;
		rt.modAt(this.alarm_types_clear, type, 1, add);
	}
	if (in_cooldown) return f.dot;
	rt.spawnTail(f, 30, "/mob/living/silicon/proc/queueAlarm: spawn at modules/mob/living/silicon/silicon.dm:79", message, type, incoming, in_cooldown, msg, key);
	return f.dot;
});

// a spawn(30) body of /mob/living/silicon/proc/queueAlarm, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/proc/queueAlarm: spawn at modules/mob/living/silicon/silicon.dm:79", function* (f: Frame, message: Value, type: Value, incoming: Value, in_cooldown: Value, msg: Value, key: Value) {
	if (rt.len(f, this.alarms_to_show) < 5) {
		msg = null;
		for (msg of each(this.alarms_to_show)) {
			to_chat(this, msg);
		}
	} else if (rt.len(f, this.alarms_to_show)) {
		msg = "--- ";
		if (rt.at(this.alarm_types_show, "Burglar")) {
			msg += `BURGLAR: ${rt.at(this.alarm_types_show, "Burglar")} alarms detected. - `;
		}
		if (rt.at(this.alarm_types_show, "Motion")) {
			msg += `MOTION: ${rt.at(this.alarm_types_show, "Motion")} alarms detected. - `;
		}
		if (rt.at(this.alarm_types_show, "Fire")) {
			msg += `FIRE: ${rt.at(this.alarm_types_show, "Fire")} alarms detected. - `;
		}
		if (rt.at(this.alarm_types_show, "Atmosphere")) {
			msg += `ATMOSPHERE: ${rt.at(this.alarm_types_show, "Atmosphere")} alarms detected. - `;
		}
		if (rt.at(this.alarm_types_show, "Power")) {
			msg += `POWER: ${rt.at(this.alarm_types_show, "Power")} alarms detected. - `;
		}
		if (rt.at(this.alarm_types_show, "Camera")) {
			msg += `CAMERA: ${rt.at(this.alarm_types_show, "Camera")} alarms detected. - `;
		}
		msg += fmt("<A href=?src=＃;showalerts=1'>[Show Alerts]</a>", [this]);
		to_chat(this, msg);
	}
	if (rt.len(f, this.alarms_to_clear) < 3) {
		msg = null;
		for (msg of each(this.alarms_to_clear)) {
			to_chat(this, msg);
		}
	} else if (rt.len(f, this.alarms_to_clear)) {
		msg = "--- ";
		if (rt.at(this.alarm_types_clear, "Motion")) {
			msg += `MOTION: ${rt.at(this.alarm_types_clear, "Motion")} alarms cleared. - `;
		}
		if (rt.at(this.alarm_types_clear, "Fire")) {
			msg += `FIRE: ${rt.at(this.alarm_types_clear, "Fire")} alarms cleared. - `;
		}
		if (rt.at(this.alarm_types_clear, "Atmosphere")) {
			msg += `ATMOSPHERE: ${rt.at(this.alarm_types_clear, "Atmosphere")} alarms cleared. - `;
		}
		if (rt.at(this.alarm_types_clear, "Power")) {
			msg += `POWER: ${rt.at(this.alarm_types_clear, "Power")} alarms cleared. - `;
		}
		if (rt.at(this.alarm_types_show, "Camera")) {
			msg += `CAMERA: ${rt.at(this.alarm_types_clear, "Camera")} alarms cleared. - `;
		}
		msg += fmt("<A href=?src=＃;showalerts=1'>[Show Alerts]</a>", [this]);
		to_chat(this, msg);
	}
	this.alarms_to_show = list();
	this.alarms_to_clear = list();
	key = null;
	for (key of each(this.alarm_types_show)) {
		rt.setAt(this.alarm_types_show, key, 0);
	}
	key = null;
	for (key of each(this.alarm_types_clear)) {
		rt.setAt(this.alarm_types_clear, key, 0);
	}
	return null;
});

// silicon.dm:147
rt.def("/mob/living/silicon/proc/can_inject", function can_inject(f: Frame, user: Value, error_msg: Value) {
	if (error_msg) {
		to_chat(user, "<span class='alert'>Their outer shell is too tough.</span>");
	}
	return 0;
});

// silicon.dm:161
rt.def("/mob/living/silicon/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let L: Value = null;
	// The law-state checkboxes are the silicon's own: an href could name any silicon from anywhere.
	if (f.usr != this) {
		return f.dot;
	}
	if (rt.at(href_list, "lawc")) {
		L = text2num(rt.at(href_list, "lawc"));
		const item = rt.index(this.lawcheck, L + 1);
		if (item === "Yes") {
			rt.setAt(this.lawcheck, L + 1, "No");
		} else if (item === "No") {
			rt.setAt(this.lawcheck, L + 1, "Yes");
		}
		this.checklaws();
	}
	if (rt.at(href_list, "lawi")) {
		L = text2num(rt.at(href_list, "lawi"));
		const item = rt.index(this.ioncheck, L);
		if (item === "Yes") {
			rt.setAt(this.ioncheck, L, "No");
		} else if (item === "No") {
			rt.setAt(this.ioncheck, L, "Yes");
		}
		this.checklaws();
	}
	if (rt.at(href_list, "lawdevil")) {
		L = text2num(rt.at(href_list, "lawdevil"));
		const item = rt.index(this.devillawcheck, L);
		if (item === "Yes") {
			rt.setAt(this.devillawcheck, L, "No");
		} else if (item === "No") {
			rt.setAt(this.devillawcheck, L, "Yes");
		}
		this.checklaws();
	}
	if (rt.at(href_list, "laws")) {
		yield* this.statelaws();
	}
	return f.dot;
}, true);

// silicon.dm:198
rt.def("/mob/living/silicon/proc/statelaws", function* statelaws(f: Frame, force: Value) {
	let index: Value = null, law: Value = null, num: Value = null;
	force ??= 0;
	yield* this.say(`${this.radiomod} Current Active Laws:`);
	let number: Value = 1;
	yield* sleep(10);
	if (this.laws.devillaws && rt.len(f, this.laws.devillaws)) {
		index = 1;
		while (index <= rt.len(f, this.laws.devillaws)) {
			if (force || rt.index(this.devillawcheck, index) == "Yes") {
				yield* this.say(`${this.radiomod} 666. ${rt.index(this.laws.devillaws, index)}`);
				yield* sleep(10);
			}
			index++;
		}
	}
	if (this.laws.zeroth) {
		if (force || rt.index(this.lawcheck, 1) == "Yes") {
			yield* this.say(`${this.radiomod} 0. ${this.laws.zeroth}`);
			yield* sleep(10);
		}
	}
	index = 1;
	while (index <= rt.len(f, this.laws.ion)) {
		law = rt.index(this.laws.ion, index);
		num = ionnum();
		if (rt.length(law) > 0) {
			if (force || rt.index(this.ioncheck, index) == "Yes") {
				yield* this.say(`${this.radiomod} ${num}. ${law}`);
				yield* sleep(10);
			}
		}
		index++;
	}
	index = 1;
	while (index <= rt.len(f, this.laws.inherent)) {
		if (rt.length((law = rt.index(this.laws.inherent, index))) > 0) {
			if (force || rt.index(this.lawcheck, index + 1) == "Yes") {
				yield* this.say(`${this.radiomod} ${number}. ${law}`);
				number++;
				yield* sleep(10);
			}
		}
		index++;
	}
	index = 1;
	while (index <= rt.len(f, this.laws.supplied)) {
		if (rt.length((law = rt.index(this.laws.supplied, index))) > 0) {
			if (rt.len(f, this.lawcheck) >= number + 1) {
				if (force || rt.index(this.lawcheck, number + 1) == "Yes") {
					yield* this.say(`${this.radiomod} ${number}. ${law}`);
					number++;
					yield* sleep(10);
				}
			}
		}
		index++;
	}
	return f.dot;
}, true);

// silicon.dm:246
rt.def("/mob/living/silicon/proc/checklaws", function checklaws(f: Frame) {
	let index: Value = null, law: Value = null, law_3: Value = null;
	let list: Value = "<b>Which laws do you want to include when stating them for the crew?</b><br><br>";
	if (this.laws.devillaws && rt.len(f, this.laws.devillaws)) {
		index = 1;
		while (index <= rt.len(f, this.laws.devillaws)) {
			if (!rt.index(this.devillawcheck, index)) {
				rt.setAt(this.devillawcheck, index, "No");
			}
			list += fmt("<A href='byond://?src=＃;lawdevil=＀'>＀ 666:</A> ＀<BR>", [this, index, rt.index(this.devillawcheck, index), rt.index(this.laws.devillaws, index)]);
			index++;
		}
	}
	if (this.laws.zeroth) {
		if (!rt.index(this.lawcheck, 1)) {
			rt.setAt(this.lawcheck, 1, "No");
		}
		list += fmt("<A href='byond://?src=＃;lawc=0'>＀ 0:</A> ＀<BR>", [this, rt.index(this.lawcheck, 1), this.laws.zeroth]);
	}
	index = 1;
	while (index <= rt.len(f, this.laws.ion)) {
		if (rt.length((law = rt.index(this.laws.ion, index))) > 0) {
			if (!rt.index(this.ioncheck, index)) {
				rt.setAt(this.ioncheck, index, "Yes");
			}
			list += fmt("<A href='byond://?src=＃;lawi=＀'>＀ ＀:</A> ＀<BR>", [this, index, rt.index(this.ioncheck, index), ionnum(), law]);
			this.ioncheck.len += 1;
		}
		index++;
	}
	let number: Value = 1;
	let index_2: Value = 1;
	while (index_2 <= rt.len(f, this.laws.inherent)) {
		if (rt.length((law_3 = rt.index(this.laws.inherent, index_2))) > 0) {
			this.lawcheck.len += 1;
			if (!rt.index(this.lawcheck, number + 1)) {
				rt.setAt(this.lawcheck, number + 1, "Yes");
			}
			list += fmt("<A href='byond://?src=＃;lawc=＀'>＀ ＀:</A> ＀<BR>", [this, number, rt.index(this.lawcheck, number + 1), number, law_3]);
			number++;
		}
		index_2++;
	}
	index_2 = 1;
	while (index_2 <= rt.len(f, this.laws.supplied)) {
		if (rt.length((law_3 = rt.index(this.laws.supplied, index_2))) > 0) {
			this.lawcheck.len += 1;
			if (!rt.index(this.lawcheck, number + 1)) {
				rt.setAt(this.lawcheck, number + 1, "Yes");
			}
			list += fmt("<A href='byond://?src=＃;lawc=＀'>＀ ＀:</A> ＀<BR>", [this, number, rt.index(this.lawcheck, number + 1), number, law_3]);
			number++;
		}
		index_2++;
	}
	list += fmt("<br><br><A href='byond://?src=＃;laws=1'>State Laws</A>", [this]);
	rt.op(f, "Browse", [], [f.usr, list, "window=laws"], false);
	return f.dot;
});

// silicon.dm:293
rt.def("/mob/living/silicon/proc/set_autosay", function* set_autosay(f: Frame) {
	let Autochan: Value = null, key: Value = null;
	let $1: any, $e: any;
	if (!this.radio) {
		to_chat(this, "Radio not detected.");
		return f.dot;
	}
	if (!(Autochan = (yield* g.op(f, "Prompt", [1], [null, null, null, "Select a channel:", list("Default", "None") + this.radio.channels])))) {
		return f.dot;
	}
	if (Autochan == "Default") {
		this.radiomod = ";";
		Autochan += ` (${this.radio.frequency})`;
	} else if (Autochan == "None") {
		this.radiomod = "";
	} else {
		for (key of each(GLOB.department_radio_keys)) {
			if (rt.index(GLOB.department_radio_keys, key) == Autochan) {
				this.radiomod = key;
				break;
			}
		}
	}
	let $0: any = this;
	if (Autochan == "None") {
		$1 = "will not use the radio.";
	} else {
		$1 = `set to ${Autochan}.`;
	}
	to_chat($0, `<span class='notice'>Automatic announcements ${$1}</span>`);
	return f.dot;
}, true);

// silicon.dm:328
rt.def("/mob/living/silicon/proc/remove_med_sec_hud", function remove_med_sec_hud(f: Frame) {
	let secsensor: Value = rt.index(GLOB.huds, this.sec_hud);
	let medsensor: Value = rt.index(GLOB.huds, this.med_hud);
	let diagsensor: Value = rt.index(GLOB.huds, this.d_hud);
	secsensor.remove_hud_from(this);
	medsensor.remove_hud_from(this);
	diagsensor.remove_hud_from(this);
	return f.dot;
});

// silicon.dm:336
rt.def("/mob/living/silicon/proc/add_sec_hud", function add_sec_hud(f: Frame) {
	let secsensor: Value = null;
	(secsensor = rt.index(GLOB.huds, this.sec_hud)).add_hud_to(this);
	return f.dot;
});

// silicon.dm:340
rt.def("/mob/living/silicon/proc/add_med_hud", function add_med_hud(f: Frame) {
	let medsensor: Value = null;
	(medsensor = rt.index(GLOB.huds, this.med_hud)).add_hud_to(this);
	return f.dot;
});

// silicon.dm:344
rt.def("/mob/living/silicon/proc/add_diag_hud", function add_diag_hud(f: Frame) {
	let diagsensor: Value = null;
	(diagsensor = rt.index(GLOB.huds, this.d_hud)).add_hud_to(this);
	return f.dot;
});

// silicon.dm:348
rt.def("/mob/living/silicon/proc/sensor_mode", function* sensor_mode(f: Frame) {
	if (this.incapacitated()) {
		return f.dot;
	}
	let sensor_type: Value = (yield* g.op(f, "Prompt", [0], [null, null, "Sensor Integration", "Please select sensor type.", list("Security", "Medical", "Diagnostic", "Disable")]));
	this.remove_med_sec_hud();
	if (sensor_type === "Security") {
		this.add_sec_hud();
		to_chat(this, "<span class='notice'>Security records overlay enabled.</span>");
	} else if (sensor_type === "Medical") {
		this.add_med_hud();
		to_chat(this, "<span class='notice'>Life signs monitor overlay enabled.</span>");
	} else if (sensor_type === "Diagnostic") {
		this.add_diag_hud();
		to_chat(this, "<span class='notice'>Robotics diagnostic overlay enabled.</span>");
	} else if (sensor_type === "Disable") {
		to_chat(this, "Sensor augmentations disabled.");
	}
	return f.dot;
}, true);

// silicon.dm:368
rt.def("/mob/living/silicon/proc/GetPhoto", function* GetPhoto(f: Frame) {
	if (!this.aicamera) return f.dot;
	return (yield* this.aicamera.selectpicture(this.aicamera));
}, true);

// silicon.dm:371
rt.def("/mob/living/silicon/proc/update_transform", function update_transform(f: Frame) {
	let ntransform: Value = matrix(this.transform);
	let changed: Value = 0;
	if (this.resize != RESIZE_DEFAULT_SIZE) {
		changed++;
		ntransform.Scale(this.resize);
		this.resize = RESIZE_DEFAULT_SIZE;
	}
	if (changed) {
		rt.op(f, "Animate", [2, 8], [null, this, "transform", ntransform, "time", 2, "easing", 192]);
	}
	return parent_proc();
});
