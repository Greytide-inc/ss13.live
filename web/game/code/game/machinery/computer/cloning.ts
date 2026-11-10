// Based on /tg/station's code/game/machinery/computer/cloning.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10377, "/obj/machinery/computer/cloning", "/obj/machinery/computer", {
	scanner: null,
	pods: null,
	temp: "Inactive",
	scantemp_ckey: null,
	scantemp: "Ready to Scan",
	menu: 1,
	records: null,
	active_record: null,
	diskette: null,
	loading: 0,
	autoprocess: 0,
	light_color: "#6496FA",
	name: "cloning console",
	desc: "Used to clone people and manage DNA.",
	icon_screen: "dna",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/cloning"),
	req_access: null,
});

// cloning.dm:14
rt.def("/obj/machinery/computer/cloning/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.records = list();

	this.req_access = list(19);
	return f.dot;
});

// cloning.dm:23
rt.def("/obj/machinery/computer/cloning/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.updatemodules(1);
	return f.dot;
}, true);

// cloning.dm:28
rt.def("/obj/machinery/computer/cloning/proc/Destroy", function* Destroy(f: Frame) {
	let _P: Value = null;
	if (this.pods) {
		for (_P of each(this.pods)) {
			this.DetachCloner(_P);
		}
		this.pods = null;
	}
	return (yield* parent_proc());
}, true);

// cloning.dm:35
rt.def("/obj/machinery/computer/cloning/proc/GetAvailablePod", function GetAvailablePod(f: Frame, mind: Value) {
	let _P: Value = null, pod: Value = null;
	if (!this.pods) return f.dot;
	for (_P of each(this.pods)) {
		if ((pod = _P).occupant && pod.clonemind == mind) {
			return null;
		}
		if (pod.is_operational() && !(pod.occupant || pod.mess)) {
			return pod;
		}
	}
	return f.dot;
});

// cloning.dm:44
rt.def("/obj/machinery/computer/cloning/proc/HasEfficientPod", function HasEfficientPod(f: Frame) {
	let _P: Value = null, pod: Value = null;
	if (!this.pods) return f.dot;
	for (_P of each(this.pods)) {
		if ((pod = _P).is_operational() && pod.efficiency > 5) {
			return 1;
		}
	}
	return f.dot;
});

// cloning.dm:51
rt.def("/obj/machinery/computer/cloning/proc/GetAvailableEfficientPod", function GetAvailableEfficientPod(f: Frame, mind: Value) {
	let _P: Value = null, pod: Value = null;
	if (!this.pods) return f.dot;
	for (_P of each(this.pods)) {
		if ((pod = _P).occupant && pod.clonemind == mind) {
			return pod;
		} else if (!f.dot && pod.is_operational() && !(pod.occupant || pod.mess) && pod.efficiency > 5) {
			f.dot = pod;
		}
	}
	return f.dot;
});

// cloning.dm:59
rt.def("/obj/machinery/computer/cloning/proc/process", function* process(f: Frame) {
	let R: Value = null, pod: Value = null;
	if (!(this.scanner && rt.length(this.pods) && this.autoprocess)) {
		return f.dot;
	}
	if (this.scanner.occupant && this.scanner.scan_level > 2) {
		yield* this.scan_occupant(this.scanner.occupant);
	}
	for (R of each(this.records, T("/datum/data/record"))) {
		if (!(pod = this.GetAvailableEfficientPod(rt.index(R.fields, "mind")))) {
			return f.dot;
		}
		if (pod.occupant) {
			continue;
		}
		if (yield* pod.growclone(rt.index(R.fields, "ckey"), rt.index(R.fields, "name"), rt.index(R.fields, "UI"), rt.index(R.fields, "SE"), rt.index(R.fields, "mind"), rt.index(R.fields, "mrace"), rt.index(R.fields, "features"), rt.index(R.fields, "factions"))) {
			this.records -= R;
		}
	}
	return f.dot;
}, true, { waitfor: false });

// cloning.dm:78
rt.def("/obj/machinery/computer/cloning/proc/updatemodules", function updatemodules(f: Frame, findfirstcloner: Value) {
	this.scanner = this.findscanner();
	if (!(findfirstcloner && !rt.length(this.pods))) return f.dot;
	this.findcloner();
	return f.dot;
});

// cloning.dm:86
rt.def("/obj/machinery/computer/cloning/proc/findscanner", function findscanner(f: Frame) {
	let scannerf: Value = null;
	let $e: any;
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		if ((scannerf = rt.locateIn(f, T("/obj/machinery/dna_scannernew"), rt.getStep(f, this, this.dir))) !== null && scannerf.is_operational()) {
			return scannerf;
		}
	}
	rt.endFor(f, 0);
	return null;
});

// cloning.dm:101
rt.def("/obj/machinery/computer/cloning/proc/findcloner", function findcloner(f: Frame) {
	let podf: Value = null;
	let $e: any;
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		if ((podf = rt.locateIn(f, T("/obj/machinery/clonepod"), rt.getStep(f, this, this.dir))) !== null && podf.is_operational()) {
			this.AttachCloner(podf);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// cloning.dm:109
rt.def("/obj/machinery/computer/cloning/proc/AttachCloner", function AttachCloner(f: Frame, pod: Value) {
	if (pod.connected) return f.dot;
	pod.connected = this;
	if (!this.pods) {
		this.pods = list();
	}
	this.pods += pod;
	return f.dot;
});

// cloning.dm:114
rt.def("/obj/machinery/computer/cloning/proc/DetachCloner", function DetachCloner(f: Frame, pod: Value) {
	pod.connected = null;
	if (!this.pods) return f.dot;
	this.pods -= pod;
	if (rt.len(f, this.pods)) return f.dot;
	this.pods = null;
	return f.dot;
});

// cloning.dm:118
rt.def("/obj/machinery/computer/cloning/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _P: Value = null, pod: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/disk/data"))) {
		if (!this.diskette) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			W.loc = this;
			this.diskette = W;
			to_chat(user, `<span class='notice'>You insert ${W}.</span>`);
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			yield* this.updateUsrDialog();
		}
	} else if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (rt.istype((_P = W).buffer, T("/obj/machinery/clonepod"))) {
			if (get_area(_P.buffer) != get_area(this)) {
				to_chat(user, "<font color = #666633>-% Cannot link machines across power zones. Buffer cleared %-</font color>");
				_P.buffer = null;
				return f.dot;
			}
			to_chat(user, `<font color = #666633>-% Successfully linked ${_P.buffer} with ${this} %-</font color>`);
			if ((pod = _P.buffer).connected) {
				pod.connected.DetachCloner(pod);
			}
			this.AttachCloner(pod);
		} else {
			_P.buffer = this;
			to_chat(user, fmt("<font color = #666633>-% Successfully stored ＃ ＀ in buffer %-</font color>", [_P.buffer, _P.buffer.name]));
		}
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cloning.dm:148
rt.def("/obj/machinery/computer/cloning/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// cloning.dm:153
rt.def("/obj/machinery/computer/cloning/proc/interact", function* interact(f: Frame, user: Value) {
	let scanner_occupant: Value = null, R: Value = null, H: Value = null, L: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	yield* user.set_machine(this);
	yield* this.add_fingerprint(user);
	if (yield* parent_proc()) {
		return f.dot;
	}
	this.updatemodules(1);
	let dat: Value = "";
	dat += fmt("<a href='byond://?src=＃;refresh=1'>Refresh</a>", [this]);
	if (this.scanner && this.HasEfficientPod() && this.scanner.scan_level > 2) {
		if (!this.autoprocess) {
			dat += fmt("<a href='byond://?src=＃;task=autoprocess'>Autoprocess</a>", [this]);
		} else {
			dat += fmt("<a href='byond://?src=＃;task=stopautoprocess'>Stop autoprocess</a>", [this]);
		}
	} else {
		dat += "<span class='linkOff'>Autoprocess</span>";
	}
	dat += "<h3>Cloning Pod Status</h3>";
	dat += `<div class='statusDisplay'>${this.temp}&nbsp;</div>`;
	if (this.menu === 1) {
		if (this.scanner === null || !rt.length(this.pods)) {
			dat += "<h3>Modules</h3>";
			if (this.scanner === null) {
				dat += "<font class='bad'>ERROR: No Scanner detected!</font><br>";
			}
			if (!rt.length(this.pods)) {
				dat += "<font class='bad'>ERROR: No Pod detected</font><br>";
			}
		}
		if (this.scanner !== null) {
			scanner_occupant = get_mob_or_brainmob(this.scanner.occupant);
			dat += "<h3>Scanner Functions</h3>";
			dat += "<div class='statusDisplay'>";
			if (!scanner_occupant) {
				dat += "Scanner Unoccupied";
			} else if (this.loading) {
				dat += `${scanner_occupant} => Scanning...`;
			} else {
				if (scanner_occupant.ckey != this.scantemp_ckey) {
					this.scantemp = "Ready to Scan";
					this.scantemp_ckey = scanner_occupant.ckey;
				}
				dat += `${scanner_occupant} => ${this.scantemp}`;
			}
			dat += "</div>";
			if (scanner_occupant) {
				dat += fmt("<a href='byond://?src=＃;scan=1'>Start Scan</a>", [this]);
				$0 = this;
				if (this.scanner.locked) {
					$1 = "Unlock Scanner";
				} else {
					$1 = "Lock Scanner";
				}
				dat += fmt("<br><a href='byond://?src=＃;lock=1'>＀</a>", [$0, $1]);
			} else {
				dat += "<span class='linkOff'>Start Scan</span>";
			}
		}
		dat += "<h3>Database Functions</h3>";
		if (rt.len(f, this.records) && rt.len(f, this.records) > 0) {
			dat += fmt("<a href='byond://?src=＃;menu=2'>View Records (＀)</a><br>", [this, rt.len(f, this.records)]);
		} else {
			dat += "<span class='linkOff'>View Records (0)</span><br>";
		}
		if (this.diskette) {
			dat += fmt("<a href='byond://?src=＃;disk=eject'>Eject Disk</a><br>", [this]);
		}
	} else if (this.menu === 2) {
		dat += "<h3>Current records</h3>";
		dat += fmt("<a href='byond://?src=＃;menu=1'><< Back</a><br><br>", [this]);
		for (R of each(this.records, T("/datum/data/record"))) {
			dat += fmt("<h4>＀</h4>Scan ID ＀ <a href='byond://?src=＃;view_rec=＀'>View Record</a>", [rt.index(R.fields, "name"), rt.index(R.fields, "id"), this, rt.index(R.fields, "id")]);
		}
	} else if (this.menu === 3) {
		dat += "<h3>Selected Record</h3>";
		dat += fmt("<a href='byond://?src=＃;menu=2'><< Back</a><br>", [this]);
		if (!this.active_record) {
			dat += "<font class='bad'>Record not found.</font>";
		} else {
			dat += `<h4>${rt.index(this.active_record.fields, "name")}</h4>`;
			dat += fmt("Scan ID ＀ <a href='byond://?src=＃;clone=＀'>Clone</a><br>", [rt.index(this.active_record.fields, "id"), this, rt.index(this.active_record.fields, "id")]);
			if ((H = rt.locateIn(f, rt.index(this.active_record.fields, "imp"), rt.world())) && rt.istype(H, T("/obj/item/weapon/implant/health"))) {
				dat += `<b>Health Implant Data:</b><br />${H.sensehealth()}<br><br />`;
			} else {
				dat += "<font class='bad'>Unable to locate Health Implant.</font><br /><br />";
			}
			dat += `<b>Unique Identifier:</b><br /><span class='highlight'>${rt.index(this.active_record.fields, "UI")}</span><br>`;
			dat += `<b>Structural Enzymes:</b><br /><span class='highlight'>${rt.index(this.active_record.fields, "SE")}</span><br>`;
			if (this.diskette && this.diskette.fields) {
				dat += "<div class='block'>";
				dat += "<h4>Inserted Disk</h4>";
				dat += "<b>Contents:</b> ";
				L = list();
				if (rt.index(this.diskette.fields, "UI")) {
					L += "Unique Identifier";
				}
				if (rt.index(this.diskette.fields, "UE") && rt.index(this.diskette.fields, "name") && rt.index(this.diskette.fields, "blood_type")) {
					L += "Unique Enzymes";
				}
				if (rt.index(this.diskette.fields, "SE")) {
					L += "Structural Enzymes";
				}
				dat += english_list(L, "Empty", " + ", " + ");
				dat += fmt("<br /><a href='byond://?src=＃;disk=load'>Load from Disk</a>", [this]);
				dat += fmt("<br /><a href='byond://?src=＃;disk=save'>Save to Disk</a>", [this]);
				dat += "</div>";
			}
			dat += fmt("<font size=1><a href='byond://?src=＃;del_rec=1'>Delete Record</a></font>", [this]);
		}
	} else if (this.menu === 4) {
		if (!this.active_record) {
			this.menu = 2;
		}
		dat = `${this.temp}<br>`;
		dat += "<h3>Confirm Record Deletion</h3>";
		dat += fmt("<b><a href='byond://?src=＃;del_rec=1'>Scan card to confirm.</a></b><br>", [this]);
		dat += fmt("<b><a href='byond://?src=＃;menu=3'>Cancel</a></b>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "cloning", "Cloning System Control"))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// cloning.dm:280
rt.def("/obj/machinery/computer/cloning/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let C: Value = null, key: Value = null, pod: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.loading) {
		return f.dot;
	}
	if (rt.at(href_list, "task")) {
		const item = rt.at(href_list, "task");
		if (item === "autoprocess") {
			this.autoprocess = 1;
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		} else if (item === "stopautoprocess") {
			this.autoprocess = 0;
			playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		}
	} else if (rt.at(href_list, "scan") && this.scanner !== null && this.scanner.is_operational()) {
		this.scantemp = "";
		this.loading = 1;
		yield* this.updateUsrDialog();
		playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0);
		yield* this.say("Initiating scan...");
		rt.spawnTail(f, 20, "/obj/machinery/computer/cloning/proc/Topic: spawn at game/machinery/computer/cloning.dm:303", C, key, pod);
	} else if (rt.at(href_list, "lock") && this.scanner !== null && this.scanner.is_operational()) {
		if (!this.scanner.locked && this.scanner.occupant) {
			this.scanner.locked = 1;
			playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		} else {
			this.scanner.locked = 0;
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		}
	} else if (rt.at(href_list, "view_rec")) {
		playsound(this, "terminal_type", 25, 0);
		this.active_record = find_record("id", rt.at(href_list, "view_rec"), this.records);
		if (this.active_record) {
			if (!rt.index(this.active_record.fields, "ckey")) {
				this.records -= this.active_record;
				this.active_record = null;
				this.temp = "<font class='bad'>Record Corrupt</font>";
			} else {
				this.menu = 3;
			}
		} else {
			this.temp = "Record missing.";
		}
	} else if (rt.at(href_list, "del_rec")) {
		if (!this.active_record || this.menu < 3) {
			return f.dot;
		}
		if (this.menu == 3) {
			this.temp = "Delete record?";
			this.menu = 4;
			playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0);
		} else if (this.menu == 4) {
			if (rt.istype((C = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id")) || rt.istype(C, T("/obj/item/device/pda"))) {
				if (this.check_access(C)) {
					this.temp = `${rt.index(this.active_record.fields, "name")} => Record deleted.`;
					yield* this.records.Remove(this.active_record);
					this.active_record = null;
					playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
					this.menu = 2;
				} else {
					this.temp = "<font class='bad'>Access Denied.</font>";
					playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
				}
			}
		}
	} else if (rt.at(href_list, "disk")) {
		const item = rt.at(href_list, "disk");
		if (item === "load") {
			if (!this.diskette || !rt.istype(this.diskette.fields, T("/list")) || !rt.index(this.diskette.fields, "name") || !this.diskette.fields) {
				this.temp = "<font class='bad'>Load error.</font>";
				yield* this.updateUsrDialog();
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
				return f.dot;
			}
			if (!this.active_record) {
				this.temp = "<font class='bad'>Record error.</font>";
				this.menu = 1;
				yield* this.updateUsrDialog();
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
				return f.dot;
			}
			for (key of each(this.diskette.fields)) {
				rt.setAt(this.active_record.fields, key, rt.index(this.diskette.fields, key));
			}
			this.temp = "Load successful.";
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		} else if (item === "eject") {
			if (this.diskette) {
				this.diskette.loc = this.loc;
				this.diskette = null;
				playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			}
		} else if (item === "save") {
			if (!this.diskette || this.diskette.read_only || !this.active_record || !this.active_record.fields) {
				this.temp = "<font class='bad'>Save error.</font>";
				yield* this.updateUsrDialog();
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
				return f.dot;
			}
			this.diskette.fields = (yield* this.active_record.fields.Copy());
			this.diskette.name = `data disk - '${rt.index(this.diskette.fields, "name")}'`;
			this.temp = "Save successful.";
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		}
	} else if (rt.at(href_list, "refresh")) {
		yield* this.updateUsrDialog();
		playsound(this, "terminal_type", 25, 0);
	} else if (rt.at(href_list, "clone")) {
		if (C = find_record("id", rt.at(href_list, "clone"), this.records)) {
			pod = this.GetAvailablePod();
			if (!rt.length(this.pods)) {
				this.temp = "<font class='bad'>No Clonepods detected.</font>";
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
			} else if (!pod) {
				this.temp = "<font class='bad'>No Clonepods available.</font>";
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
			} else if (!GLOB.config.revival_cloning) {
				this.temp = "<font class='bad'>Unable to initiate cloning cycle.</font>";
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
			} else if (pod.occupant) {
				this.temp = "<font class='bad'>Cloning cycle already in progress.</font>";
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
			} else if (yield* pod.growclone(rt.index(C.fields, "ckey"), rt.index(C.fields, "name"), rt.index(C.fields, "UI"), rt.index(C.fields, "SE"), rt.index(C.fields, "mind"), rt.index(C.fields, "mrace"), rt.index(C.fields, "features"), rt.index(C.fields, "factions"))) {
				this.temp = `${rt.index(C.fields, "name")} => <font class='good'>Cloning cycle in progress...</font>`;
				playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
				yield* this.records.Remove(C);
				if (this.active_record == C) {
					this.active_record = null;
				}
				this.menu = 1;
			} else {
				this.temp = `${rt.index(C.fields, "name")} => <font class='bad'>Initialisation failure.</font>`;
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
			}
		} else {
			this.temp = "<font class='bad'>Data corruption.</font>";
			playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		}
	} else if (rt.at(href_list, "menu")) {
		this.menu = text2num(rt.at(href_list, "menu"));
		playsound(this, "terminal_type", 25, 0);
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// a spawn(20) body of /obj/machinery/computer/cloning/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/cloning/proc/Topic: spawn at game/machinery/computer/cloning.dm:303", function* (f: Frame, C: Value, key: Value, pod: Value) {
	yield* this.scan_occupant(this.scanner.occupant);
	this.loading = 0;
	yield* this.updateUsrDialog();
	playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
	return null;
});

// cloning.dm:437
rt.def("/obj/machinery/computer/cloning/proc/scan_occupant", function* scan_occupant(f: Frame, occupant: Value) {
	let dna: Value = null, C: Value = null, B: Value = null, rando_race: Value = null, imp: Value = null, HI: Value = null;
	let $e: any;
	let mob_occupant: Value = get_mob_or_brainmob(occupant);
	if (rt.istype(mob_occupant, T("/mob/living/carbon"))) {
		dna = (C = mob_occupant).has_dna();
	}
	if (rt.istype(mob_occupant, T("/mob/living/brain"))) {
		dna = (B = mob_occupant).stored_dna;
	}
	if (!rt.istype(dna, T("/datum/dna"))) {
		this.scantemp = "<font class='bad'>Unable to locate valid genetic data.</font>";
		playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		return f.dot;
	}
	if (mob_occupant.suiciding || mob_occupant.hellbound) {
		this.scantemp = "<font class='bad'>Subject's brain is not responding to scanning stimuli.</font>";
		playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		return f.dot;
	}
	if (rt.bitAnd(mob_occupant.disabilities, 128) && this.scanner.scan_level < 2) {
		this.scantemp = "<font class='bad'>Subject no longer contains the fundamental materials required to create a living clone.</font>";
		playsound(this, rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0);
		return f.dot;
	}
	if (!mob_occupant.ckey || !mob_occupant.client) {
		this.scantemp = "<font class='bad'>Mental interface failure.</font>";
		playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		return f.dot;
	}
	if (find_record("ckey", mob_occupant.ckey, this.records)) {
		this.scantemp = "<font class='average'>Subject already in database.</font>";
		playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		return f.dot;
	}
	let R: Value = (yield* new_(T("/datum/data/record")));
	if (dna.species) {
		rt.setAt(R.fields, "mrace", dna.species);
	} else {
		rando_race = pick(GLOB.config.roundstart_races);
		rt.setAt(R.fields, "mrace", rando_race.type);
	}
	rt.setAt(R.fields, "ckey", mob_occupant.ckey);
	rt.setAt(R.fields, "name", mob_occupant.real_name);
	rt.setAt(R.fields, "id", copytext(md5(mob_occupant.real_name), 2, 6));
	rt.setAt(R.fields, "UE", dna.unique_enzymes);
	rt.setAt(R.fields, "UI", dna.uni_identity);
	rt.setAt(R.fields, "SE", dna.struc_enzymes);
	rt.setAt(R.fields, "blood_type", dna.blood_type);
	rt.setAt(R.fields, "features", dna.features);
	rt.setAt(R.fields, "factions", mob_occupant.faction);
	if (mob_occupant.mind !== null) {
		rt.setAt(R.fields, "mind", fmt("＃", [mob_occupant.mind]));
	}
	rt.forList(f, 0, mob_occupant.implants, T("/obj/item/weapon/implant/health"));
	if (($e = rt.next(f, 0)) !== undefined) {
		HI = $e;
		imp = HI;
	}
	rt.endFor(f, 0);
	if (!imp) {
		yield* (imp = (yield* new_(T("/obj/item/weapon/implant/health"), mob_occupant))).implant(mob_occupant);
	}
	rt.setAt(R.fields, "imp", fmt("＃", [imp]));
	rt.modField(f, this, "records", R, add);
	this.scantemp = "Subject successfully scanned.";
	playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
	return f.dot;
}, true);
