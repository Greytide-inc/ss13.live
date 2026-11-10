// Based on /tg/station's code/game/machinery/computer/dna_console.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10380, "/obj/machinery/computer/scan_consolenew", "/obj/machinery/computer", {
	radduration: 2,
	radstrength: 1,
	buffer: null,
	injectorready: 0,
	current_screen: "mainmenu",
	connected: null,
	diskette: null,
	delayed_action: null,
	icon_screen: "dna",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/scan_consolenew"),
	anchored: 1,
	light_color: "#6496FA",
	name: "１DNA scanner access console",
	desc: "Scan DNA.",
	density: 1,
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 400,
});

// dna_console.dm:29
rt.def("/obj/machinery/computer/scan_consolenew/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.buffer = rt.op(f, "CreateMultidimensionalList", [1], [3]);
	return f.dot;
});

// dna_console.dm:44
rt.def("/obj/machinery/computer/scan_consolenew/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/disk/data"))) {
		if (!this.diskette) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			I.loc = this;
			this.diskette = I;
			to_chat(user, `<span class='notice'>You insert ${I}.</span>`);
			yield* this.updateUsrDialog();
			return f.dot;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// dna_console.dm:57
rt.def("/obj/machinery/computer/scan_consolenew/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.spawnTail(f, 5, "/obj/machinery/computer/scan_consolenew/proc/New: spawn at game/machinery/computer/dna_console.dm:59");
	return f.dot;
}, true);

// a spawn(5) body of /obj/machinery/computer/scan_consolenew/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/scan_consolenew/proc/New: spawn at game/machinery/computer/dna_console.dm:59", function* (f: Frame) {
	let $e: any;
	rt.forList(f, 0, list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		this.dir = $e;
		this.connected = rt.locateIn(f, T("/obj/machinery/dna_scannernew"), rt.getStep(f, this, this.dir));
		if (this.connected !== null) {
			break;
		}
	}
	rt.endFor(f, 0);
	this.injectorready = rt.worldTime(f) + 100;
	return f.dot;
});

// dna_console.dm:69
rt.def("/obj/machinery/computer/scan_consolenew/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.ShowInterface(user);
	return f.dot;
}, true);

// dna_console.dm:74
rt.def("/obj/machinery/computer/scan_consolenew/proc/ShowInterface", function* ShowInterface(f: Frame, user: Value, last_change: Value) {
	let viable_occupant: Value = null, scanner_status: Value = null, temp_html: Value = null, rejuvenators: Value = null, chance_to_hit: Value = null, max_line_len: Value = null, len: Value = null, i: Value = null, i_9: Value = null, buffer_slot: Value = null, ui: Value = null, se: Value = null, ue: Value = null, name: Value = null, label: Value = null, blood_type: Value = null;
	let $0: any, $1: any, $2: any;
	if (!user) {
		return f.dot;
	}
	let popup: Value = (yield* new_(T("/datum/browser"), user, "scannernew", "DNA Modifier Console", 800, 630));
	if (!(get_dist(this, user) <= 1 || rt.istype(user, T("/mob/living/silicon")))) {
		yield* popup.close();
		return f.dot;
	}
	popup.add_stylesheet("scannernew", rt.rsc("html/browser/scannernew.css"));
	let occupant_status: Value = "<div class='line'><div class='statusLabel'>Subject Status:</div><div class='statusValue'>";
	if (this.connected && this.connected.is_operational()) {
		if (this.connected.occupant) {
			if ((viable_occupant = this.connected.occupant).has_dna() && !rt.isIn(f, RADIMMUNE, viable_occupant.dna.species.species_traits) && (!rt.bitAnd(viable_occupant.disabilities, 128) || this.connected.scan_level == 3)) {
				occupant_status += `${viable_occupant.name} => `;
				$0 = viable_occupant.stat;
				if ($0 === 0) {
					occupant_status += "<span class='good'>Conscious</span>";
				} else if ($0 === RADIATION_STRENGTH_MULTIPLIER) {
					occupant_status += "<span class='average'>Unconscious</span>";
				} else {
					occupant_status += "<span class='bad'>DEAD</span>";
				}
				occupant_status += "</div></div>";
				occupant_status += `<div class='line'><div class='statusLabel'>Health:</div><div class='progressBar'><div style='width: ${viable_occupant.health}%;' class='progressFill good'></div></div><div class='statusValue'>${viable_occupant.health} %</div></div>`;
				occupant_status += `<div class='line'><div class='statusLabel'>Radiation Level:</div><div class='progressBar'><div style='width: ${viable_occupant.radiation}%;' class='progressFill bad'></div></div><div class='statusValue'>${viable_occupant.radiation} %</div></div>`;
				occupant_status += `<div class='line'><div class='statusLabel'>Rejuvenators:</div><div class='progressBar'><div style='width: ${round((rejuvenators = viable_occupant.reagents.get_reagent_amount("potass_iodide")) / REJUVENATORS_MAX * 100)}%;' class='progressFill highlight'></div></div><div class='statusValue'>${rejuvenators} units</div></div>`;
				occupant_status += `<div class='line'><div class='statusLabel'>Unique Enzymes :</div><div class='statusValue'><span class='highlight'>${viable_occupant.dna.unique_enzymes}</span></div></div>`;
				if (last_change) {
					$0 = last_change;
				} else {
					$0 = "----";
				}
				occupant_status += `<div class='line'><div class='statusLabel'>Last Operation:</div><div class='statusValue'>${$0}</div></div>`;
			} else {
				viable_occupant = null;
				occupant_status += "<span class='bad'>Invalid DNA structure</span></div></div>";
			}
		} else {
			occupant_status += "<span class='bad'>No subject detected</span></div></div>";
		}
		if (this.connected.state_open) {
			scanner_status = "Open";
		} else {
			scanner_status = "Closed";
			if (this.connected.locked) {
				scanner_status += " <span class='bad'>(Locked)</span>";
			} else {
				scanner_status += " <span class='good'>(Unlocked)</span>";
			}
		}
	} else {
		occupant_status += "<span class='bad'>----</span></div></div>";
		scanner_status += "<span class='bad'>Error: No scanner detected</span>";
	}
	let status: Value = "<div class='statusDisplay'>";
	status += `<div class='line'><div class='statusLabel'>Scanner:</div><div class='statusValue'>${scanner_status}</div></div>`;
	status += `${occupant_status}`;
	status += "<div class='line'><h3>Radiation Emitter Status</h3></div>";
	let stddev: Value = this.radstrength * RADIATION_STRENGTH_MULTIPLIER;
	status += `<div class='line'><div class='statusLabel'>Output Level:</div><div class='statusValue'>${this.radstrength}</div></div>`;
	status += `<div class='line'><div class='statusLabel'>&nbsp;&nbsp;> Mutation:</div><div class='statusValue'>(-${stddev} to +${stddev} = 68 %) (-${2 * stddev} to +${2 * stddev} = 95 %)</div></div>`;
	if (this.connected) {
		stddev = RADIATION_ACCURACY_MULTIPLIER / (this.radduration + this.connected.precision_coeff ** 2);
	} else {
		stddev = RADIATION_ACCURACY_MULTIPLIER / this.radduration;
	}
	if (rt.inRange(stddev, 0, 0.25)) {
		chance_to_hit = ">95 %";
	} else if (rt.inRange(stddev, 0.25, 0.5)) {
		chance_to_hit = "68-95 %";
	} else if (rt.inRange(stddev, 0.5, 0.75)) {
		chance_to_hit = "55-68 %";
	} else {
		chance_to_hit = "<38 %";
	}
	status += `<div class='line'><div class='statusLabel'>Pulse Duration:</div><div class='statusValue'>${this.radduration}</div></div>`;
	status += `<div class='line'><div class='statusLabel'>&nbsp;&nbsp;> Accuracy:</div><div class='statusValue'>${chance_to_hit}</div></div>`;
	status += "<br></div>";
	let buttons: Value = fmt("<a href='?src=＃;'>Scan</a> ", [this]);
	if (this.connected) {
		$0 = this;
		if (this.connected.state_open) {
			$1 = "Close";
		} else {
			$1 = "Open";
		}
		buttons += fmt(" <a href='?src=＃;task=toggleopen;'>＀ Scanner</a> ", [$0, $1]);
		if (this.connected.state_open) {
			buttons += `<span class='linkOff'>${this.connected.locked ? "Unlock" : "Lock"} Scanner</span> `;
		} else {
			buttons += fmt("<a href='?src=＃;task=togglelock;'>＀ Scanner</a> ", [this, this.connected.locked ? "Unlock" : "Lock"]);
		}
	} else {
		buttons += "<span class='linkOff'>Open Scanner</span> <span class='linkOff'>Lock Scanner</span> ";
	}
	if (viable_occupant) {
		buttons += fmt("<a href='?src=＃;task=rejuv'>Inject Rejuvenators</a> ", [this]);
	} else {
		buttons += "<span class='linkOff'>Inject Rejuvenators</span> ";
	}
	if (this.diskette) {
		buttons += fmt("<a href='?src=＃;task=ejectdisk'>Eject Disk</a> ", [this]);
	} else {
		buttons += "<span class='linkOff'>Eject Disk</span> ";
	}
	if (this.current_screen == "buffer") {
		buttons += fmt("<a href='?src=＃;task=screen;text=mainmenu;'>Radiation Emitter Menu</a> ", [this]);
	} else {
		buttons += fmt("<a href='?src=＃;task=screen;text=buffer;'>Buffer Menu</a> ", [this]);
	}
	if (this.current_screen === "working") {
		temp_html += status;
		temp_html += "<h1>System Busy</h1>";
		temp_html += `Working ... Please wait (${this.radduration} Seconds)`;
	} else if (this.current_screen === "buffer") {
		temp_html += status;
		temp_html += buttons;
		temp_html += "<h1>Buffer Menu</h1>";
		if (rt.istype(this.buffer, T("/list"))) {
			i_9 = 1;
			while (i_9 <= rt.len(f, this.buffer)) {
				temp_html += `<br>Slot ${i_9}: `;
				if (!(buffer_slot = rt.index(this.buffer, i_9)) || !rt.len(f, buffer_slot) || !rt.at(buffer_slot, "name") || !(rt.at(buffer_slot, "UI") && rt.at(buffer_slot, "UE") || rt.at(buffer_slot, "SE"))) {
					temp_html += "<br>\tNo Data";
					if (viable_occupant) {
						temp_html += fmt("<br><a href='?src=＃;task=setbuffer;num=＀;'>Save to Buffer</a> ", [this, i_9]);
					} else {
						temp_html += "<br><span class='linkOff'>Save to Buffer</span> ";
					}
					temp_html += "<span class='linkOff'>Clear Buffer</span> ";
					if (this.diskette) {
						temp_html += fmt("<a href='?src=＃;task=loaddisk;num=＀;'>Load from Disk</a> ", [this, i_9]);
					} else {
						temp_html += "<span class='linkOff'>Load from Disk</span> ";
					}
					temp_html += "<span class='linkOff'>Save to Disk</span> ";
				} else {
					ui = rt.at(buffer_slot, "UI");
					se = rt.at(buffer_slot, "SE");
					ue = rt.at(buffer_slot, "UE");
					name = rt.at(buffer_slot, "name");
					label = rt.at(buffer_slot, "label");
					blood_type = rt.at(buffer_slot, "blood_type");
					$0 = this;
					$1 = i_9;
					if (label) {

						$2 = label;
					} else {
						$2 = name;
					}
					temp_html += fmt("<br>\t<a href='?src=＃;task=setbufferlabel;num=＀;'>Label</a>: ＀", [$0, $1, $2]);
					temp_html += `<br>\tSubject: ${name}`;
					if (ue && name && blood_type) {
						temp_html += `<br>\tBlood Type: ${blood_type}`;
						temp_html += `<br>\tUE: ${ue} `;
						if (viable_occupant) {
							temp_html += fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=ue'>Occupant</a> ", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Occupant</span>";
						}
						temp_html += fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [this, i_9, SCANNER_ACTION_UE]);
						if (this.injectorready < rt.worldTime(f)) {
							temp_html += fmt("<a href='?src=＃;task=injector;num=＀;text=ue'>Injector</a>", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Injector</span>";
						}
					} else {
						temp_html += "<br>\tBlood Type: No Data";
						temp_html += "<br>\tUE: No Data";
					}
					if (ui) {
						temp_html += `<br>\tUI: ${ui} `;
						if (viable_occupant) {
							temp_html += fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=ui'>Occupant</a> ", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Occupant</span>";
						}
						temp_html += fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [this, i_9, SCANNER_ACTION_UI]);
						if (this.injectorready < rt.worldTime(f)) {
							temp_html += fmt("<a href='?src=＃;task=injector;num=＀;text=ui'>Injector</a>", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Injector</span>";
						}
					} else {
						temp_html += "<br>\tUI: No Data";
					}
					if (ue && name && blood_type && ui) {
						temp_html += `<br>\tUI+UE: ${ui}/${ue} `;
						if (viable_occupant) {
							temp_html += fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=mixed'>Occupant</a> ", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Occupant</span>";
						}
						temp_html += fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [this, i_9, SCANNER_ACTION_MIXED]);
						if (this.injectorready < rt.worldTime(f)) {
							temp_html += fmt("<a href='?src=＃;task=injector;num=＀;text=mixed'>UI+UE Injector</a>", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>UI+UE Injector</span>";
						}
					}
					if (se) {
						temp_html += `<br>\tSE: ${se} `;
						if (viable_occupant) {
							temp_html += fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=se'>Occupant</a> ", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Occupant</span> ";
						}
						temp_html += fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [this, i_9, SCANNER_ACTION_SE]);
						if (this.injectorready < rt.worldTime(f)) {
							temp_html += fmt("<a href='?src=＃;task=injector;num=＀;text=se'>Injector</a>", [this, i_9]);
						} else {
							temp_html += "<span class='linkOff'>Injector</span>";
						}
					} else {
						temp_html += "<br>\tSE: No Data";
					}
					if (viable_occupant) {
						temp_html += fmt("<br><a href='?src=＃;task=setbuffer;num=＀;'>Save to Buffer</a> ", [this, i_9]);
					} else {
						temp_html += "<br><span class='linkOff'>Save to Buffer</span> ";
					}
					temp_html += fmt("<a href='?src=＃;task=clearbuffer;num=＀;'>Clear Buffer</a> ", [this, i_9]);
					if (this.diskette) {
						temp_html += fmt("<a href='?src=＃;task=loaddisk;num=＀;'>Load from Disk</a> ", [this, i_9]);
					} else {
						temp_html += "<span class='linkOff'>Load from Disk</span> ";
					}
					if (this.diskette && !this.diskette.read_only) {
						temp_html += fmt("<a href='?src=＃;task=savedisk;num=＀;'>Save to Disk</a> ", [this, i_9]);
					} else {
						temp_html += "<span class='linkOff'>Save to Disk</span> ";
					}
				}
				i_9++;
			}
		}
	} else {
		temp_html += status;
		temp_html += buttons;
		temp_html += "<h1>Radiation Emitter Menu</h1>";
		temp_html += fmt("<a href='?src=＃;task=setstrength;num=＀;'>--</a> <a href='?src=＃;task=setstrength;'>Output Level</a> <a href='?src=＃;task=setstrength;num=＀;'>++</a>", [this, this.radstrength - 1, this, this, this.radstrength + 1]);
		temp_html += fmt("<br><a href='?src=＃;task=setduration;num=＀;'>--</a> <a href='?src=＃;task=setduration;'>Pulse Duration</a> <a href='?src=＃;task=setduration;num=＀;'>++</a>", [this, this.radduration - 1, this, this, this.radduration + 1]);
		temp_html += "<h3>Irradiate Subject</h3>";
		temp_html += "<div class='line'><div class='statusLabel'>Unique Identifier:</div><div class='statusValue'><div class='clearBoth'>";
		max_line_len = 21;
		if (viable_occupant) {
			temp_html += "<div class='dnaBlockNumber'>1</div>";
			len = rt.length(viable_occupant.dna.uni_identity);
			i = 1;
			while (i <= len) {
				temp_html += fmt("<a class='dnaBlock' href='?src=＃;task=pulseui;num=＀;'>＀</a>", [this, i, copytext(viable_occupant.dna.uni_identity, i, i + 1)]);
				if (i % max_line_len == 0) {
					temp_html += "</div><div class='clearBoth'>";
				}
				if (i % DNA_BLOCK_SIZE == 0 && i < len) {
					temp_html += `<div class='dnaBlockNumber'>${i / DNA_BLOCK_SIZE + 1}</div>`;
				}
				i++;
			}
		} else {
			temp_html += "----";
		}
		temp_html += "</div></div></div><br>";
		temp_html += "<br><div class='line'><div class='statusLabel'>Structural Enzymes:</div><div class='statusValue'><div class='clearBoth'>";
		if (viable_occupant) {
			temp_html += "<div class='dnaBlockNumber'>1</div>";
			len = rt.length(viable_occupant.dna.struc_enzymes);
			i = 1;
			while (i <= len) {
				temp_html += fmt("<a class='dnaBlock' href='?src=＃;task=pulsese;num=＀;'>＀</a>", [this, i, copytext(viable_occupant.dna.struc_enzymes, i, i + 1)]);
				if (i % max_line_len == 0) {
					temp_html += "</div><div class='clearBoth'>";
				}
				if (i % DNA_BLOCK_SIZE == 0 && i < len) {
					temp_html += `<div class='dnaBlockNumber'>${i / DNA_BLOCK_SIZE + 1}</div>`;
				}
				i++;
			}
		} else {
			temp_html += "----";
		}
		temp_html += "</div></div></div>";
	}
	popup.set_content(temp_html);
	yield* popup.open();
	return f.dot;
}, true);

// dna_console.dm:316
rt.def("/obj/machinery/computer/scan_consolenew/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let last_change: Value = null, potassiodide_amount: Value = null, can_add: Value = null, text: Value = null, buffer_slot: Value = null, buffer_slot_3: Value = null, I: Value = null, powers: Value = null, HM: Value = null, time_coeff: Value = null, HM_7: Value = null, locked_state: Value = null, len: Value = null, block: Value = null, subblock: Value = null, hex: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!isturf(f.usr.loc)) {
		return f.dot;
	}
	if (!(isturf(this.loc) && get_dist(this, f.usr) <= 1 || rt.istype(f.usr, T("/mob/living/silicon")))) {
		return f.dot;
	}
	if (this.current_screen == "working") {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	yield* f.usr.set_machine(this);
	let viable_occupant: Value = this.get_viable_occupant();
	let num: Value = round(text2num(rt.at(href_list, "num")));
	const item = rt.at(href_list, "task");
	if (item === "togglelock") {
		if (this.connected) {
			this.connected.locked = (!this.connected.locked ? 1 : 0);
		}
	} else if (item === "toggleopen") {
		if (this.connected) {
			yield* this.connected.toggle_open(f.usr);
		}
	} else if (item === "setduration") {
		if (!num) {
			num = round((yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose pulse duration:", f.usr, null])));
		}
		if (num) {
			this.radduration = Wrap(num, 1, 31);
		}
	} else if (item === "setstrength") {
		if (!num) {
			num = round((yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose pulse strength:", f.usr, null])));
		}
		if (num) {
			this.radstrength = Wrap(num, SCANNER_ACTION_SE, 16);
		}
	} else if (item === "screen") {
		this.current_screen = rt.at(href_list, "text");
	} else if (item === "rejuv") {
		if (viable_occupant && viable_occupant.reagents) {
			potassiodide_amount = viable_occupant.reagents.get_reagent_amount("potass_iodide");
			can_add = max(min(REJUVENATORS_MAX - potassiodide_amount, REJUVENATORS_INJECT), 0);
			yield* viable_occupant.reagents.add_reagent("potass_iodide", can_add);
		}
	} else if (item === "setbufferlabel") {
		text = sanitize((yield* g.op(f, "Prompt", [NUMBER_OF_BUFFERS], [null, "Input an Text", "Input a new label:", f.usr, null])));
		if (num && text) {
			num = max(SCANNER_ACTION_SE, min(num, NUMBER_OF_BUFFERS));
			if (rt.istype((buffer_slot = rt.index(this.buffer, num)), T("/list"))) {
				rt.setAt(buffer_slot, "label", text);
			}
		}
	} else if (item === "setbuffer") {
		if (num && viable_occupant) {
			num = max(SCANNER_ACTION_SE, min(num, NUMBER_OF_BUFFERS));
			rt.setAt(this.buffer, num, rt.alist(f, ["label", `Buffer${num}:${viable_occupant.real_name}`, "UI", viable_occupant.dna.uni_identity, "SE", viable_occupant.dna.struc_enzymes, "UE", viable_occupant.dna.unique_enzymes, "name", viable_occupant.real_name, "blood_type", viable_occupant.dna.blood_type]));
		}
	} else if (item === "clearbuffer") {
		if (num) {
			num = max(SCANNER_ACTION_SE, min(num, NUMBER_OF_BUFFERS));
			if (rt.istype((buffer_slot_3 = rt.index(this.buffer, num)), T("/list"))) {
				buffer_slot_3.Cut();
			}
		}
	} else if (item === "transferbuffer") {
		if (num && viable_occupant) {
			const item_2 = rt.at(href_list, "text");
			if (item_2 === "se") {
				yield* this.apply_buffer(SCANNER_ACTION_SE, num);
			} else if (item_2 === "ui") {
				yield* this.apply_buffer(SCANNER_ACTION_UI, num);
			} else if (item_2 === "ue") {
				yield* this.apply_buffer(SCANNER_ACTION_UE, num);
			} else if (item_2 === "mixed") {
				yield* this.apply_buffer(SCANNER_ACTION_MIXED, num);
			}
		}
	} else if (item === "injector") {
		if (num && this.injectorready < rt.worldTime(f)) {
			num = max(1, min(num, NUMBER_OF_BUFFERS));
			if (rt.istype((buffer_slot_3 = rt.index(this.buffer, num)), T("/list"))) {
				const item_2 = rt.at(href_list, "text");
				if (item_2 === "se") {
					if (rt.at(buffer_slot_3, "SE")) {
						I = (yield* new_(T("/obj/item/weapon/dnainjector/timed"), this.loc));
						powers = 0;
						for (HM of each(GLOB.good_mutations + GLOB.bad_mutations + GLOB.not_good_mutations, T("/datum/mutation/human"))) {
							if (HM.check_block_string(rt.at(buffer_slot_3, "SE"))) {
								I.add_mutations.Add(HM);
								if (rt.isIn(f, HM, GLOB.good_mutations)) {
									powers += 1;
								}
								if (rt.isIn(f, HM, GLOB.bad_mutations + GLOB.not_good_mutations)) {
									powers -= 1;
								}
							} else {
								I.remove_mutations.Add(HM);
							}
						}
						I.origin_tech = `biotech=2;engineering=${max(1, min(6, powers))}`;
						for (HM_7 of each(I.add_mutations, T("/datum/mutation/human"))) {
							if (!time_coeff) {
								time_coeff = HM_7.time_coeff;
								continue;
							}
							time_coeff = min(time_coeff, HM_7.time_coeff);
						}
						if (this.connected) {
							I.duration = I.duration * time_coeff * this.connected.damage_coeff;
							I.damage_coeff = this.connected.damage_coeff;
						}
					}
				} else if (item_2 === "ui") {
					if (rt.at(buffer_slot_3, "UI")) {
						(I = (yield* new_(T("/obj/item/weapon/dnainjector/timed"), this.loc))).fields = rt.alist(f, ["UI", rt.at(buffer_slot_3, "UI")]);
						if (this.connected) {
							I.damage_coeff = this.connected.damage_coeff;
						}
					}
				} else if (item_2 === "ue") {
					if (rt.at(buffer_slot_3, "name") && rt.at(buffer_slot_3, "UE") && rt.at(buffer_slot_3, "blood_type")) {
						(I = (yield* new_(T("/obj/item/weapon/dnainjector/timed"), this.loc))).fields = rt.alist(f, ["name", rt.at(buffer_slot_3, "name"), "UE", rt.at(buffer_slot_3, "UE"), "blood_type", rt.at(buffer_slot_3, "blood_type")]);
						if (this.connected) {
							I.damage_coeff = this.connected.damage_coeff;
						}
					}
				} else if (item_2 === "mixed") {
					if (rt.at(buffer_slot_3, "UI") && rt.at(buffer_slot_3, "name") && rt.at(buffer_slot_3, "UE") && rt.at(buffer_slot_3, "blood_type")) {
						(I = (yield* new_(T("/obj/item/weapon/dnainjector/timed"), this.loc))).fields = rt.alist(f, ["UI", rt.at(buffer_slot_3, "UI"), "name", rt.at(buffer_slot_3, "name"), "UE", rt.at(buffer_slot_3, "UE"), "blood_type", rt.at(buffer_slot_3, "blood_type")]);
						if (this.connected) {
							I.damage_coeff = this.connected.damage_coeff;
						}
					}
				}
				if (I) {
					this.injectorready = rt.worldTime(f) + INJECTOR_TIMEOUT;
				}
			}
		}
	} else if (item === "loaddisk") {
		if (num && this.diskette && this.diskette.fields) {
			num = max(1, min(num, NUMBER_OF_BUFFERS));
			rt.setAt(this.buffer, num, (yield* this.diskette.fields.Copy()));
		}
	} else if (item === "savedisk") {
		if (num && this.diskette && !this.diskette.read_only) {
			num = max(1, min(num, NUMBER_OF_BUFFERS));
			if (rt.istype((buffer_slot_3 = rt.index(this.buffer, num)), T("/list"))) {
				this.diskette.name = `data disk [${rt.at(buffer_slot_3, "label")}]`;
				this.diskette.fields = (yield* buffer_slot_3.Copy());
			}
		}
	} else if (item === "ejectdisk") {
		if (this.diskette) {
			this.diskette.loc = rt.getStep(f, this, 0);
			this.diskette = null;
		}
	} else if (item === "setdelayed") {
		if (num) {
			this.delayed_action = rt.alist(f, ["action", text2num(rt.at(href_list, "delayaction")), "buffer", num]);
		}
	} else if (item === "pulseui" || item === "pulsese") {
		if (num && viable_occupant && this.connected) {
			this.radduration = Wrap(this.radduration, 1, 31);
			this.radstrength = Wrap(this.radstrength, 1, 16);
			locked_state = this.connected.locked;
			this.connected.locked = 1;
			this.current_screen = "working";
			yield* this.ShowInterface(f.usr);
			yield* sleep(this.radduration * 10);
			this.current_screen = "mainmenu";
			if (viable_occupant && this.connected && this.connected.occupant == viable_occupant) {
				viable_occupant.radiation += RADIATION_IRRADIATION_MULTIPLIER * this.radduration * this.radstrength / this.connected.damage_coeff ** 2;
				const item_2 = rt.at(href_list, "task");
				if (item_2 === "pulseui") {
					len = rt.length(viable_occupant.dna.uni_identity);
					num = this.randomize_radiation_accuracy((num = Wrap(num, 1, len + 1)), this.radduration + this.connected.precision_coeff ** 2, len);
					block = round((num - 1) / DNA_BLOCK_SIZE) + 1;
					subblock = num - block * DNA_BLOCK_SIZE;
					last_change = `UI #${block}-${subblock}; `;
					last_change += `${(hex = copytext(viable_occupant.dna.uni_identity, num, num + 1))}`;
					last_change += `->${(hex = this.scramble(hex, this.radstrength, this.radduration))}`;
					viable_occupant.dna.uni_identity = copytext(viable_occupant.dna.uni_identity, 1, num) + hex + copytext(viable_occupant.dna.uni_identity, num + 1, 0);
					yield* viable_occupant.updateappearance({ mutations_overlay_update: 1 });
				} else if (item_2 === "pulsese") {
					len = rt.length(viable_occupant.dna.struc_enzymes);
					num = this.randomize_radiation_accuracy((num = Wrap(num, 1, len + 1)), this.radduration + this.connected.precision_coeff ** 2, len);
					block = round((num - 1) / DNA_BLOCK_SIZE) + 1;
					subblock = num - block * DNA_BLOCK_SIZE;
					last_change = `SE #${block}-${subblock}; `;
					last_change += `${(hex = copytext(viable_occupant.dna.struc_enzymes, num, num + 1))}`;
					last_change += `->${(hex = this.scramble(hex, this.radstrength, this.radduration))}`;
					viable_occupant.dna.struc_enzymes = copytext(viable_occupant.dna.struc_enzymes, 1, num) + hex + copytext(viable_occupant.dna.struc_enzymes, num + 1, 0);
					yield* viable_occupant.domutcheck();
				}
			} else {
				this.current_screen = "mainmenu";
			}
			if (this.connected) {
				this.connected.locked = locked_state;
			}
		}
	}
	yield* this.ShowInterface(f.usr, last_change);
	return f.dot;
}, true);

// dna_console.dm:518
rt.def("/obj/machinery/computer/scan_consolenew/proc/scramble", function scramble(f: Frame, input: Value, rs: Value, rd: Value) {
	let ran: Value = null;
	let length: Value = rt.length(input);
	if ((ran = gaussian(0, rs * RADIATION_STRENGTH_MULTIPLIER)) == 0) {
		ran = pick(-1, 1);
	} else if (ran < 0) {
		ran = round(ran);
	} else {
		ran = -round(-ran);
	}
	return num2hex(Wrap(hex2num(input) + ran, 0, 16 ** length), length);
});

// dna_console.dm:529
rt.def("/obj/machinery/computer/scan_consolenew/proc/randomize_radiation_accuracy", function randomize_radiation_accuracy(f: Frame, position_we_were_supposed_to_hit: Value, radduration: Value, number_of_blocks: Value) {
	return Wrap(round(position_we_were_supposed_to_hit + gaussian(0, RADIATION_ACCURACY_MULTIPLIER / radduration), 1), 1, number_of_blocks + 1);
});

// dna_console.dm:535
rt.def("/obj/machinery/computer/scan_consolenew/proc/get_viable_occupant", function get_viable_occupant(f: Frame) {
	let viable_occupant: Value = null;
	if (this.connected) {
		if (!rt.istype((viable_occupant = this.connected.occupant), T("/mob/living/carbon")) || !viable_occupant.dna || rt.bitAnd(viable_occupant.disabilities, 128)) {
			viable_occupant = null;
		}
	}
	return viable_occupant;
});

// dna_console.dm:540
rt.def("/obj/machinery/computer/scan_consolenew/proc/apply_buffer", function* apply_buffer(f: Frame, action: Value, buffer_num: Value) {
	buffer_num = max(1, min(buffer_num, NUMBER_OF_BUFFERS));
	let buffer_slot: Value = rt.index(this.buffer, buffer_num);
	let viable_occupant: Value = this.get_viable_occupant();
	if (!rt.istype(buffer_slot, T("/list"))) return f.dot;
	viable_occupant.radiation += rand(10 / this.connected.damage_coeff ** 2, 25 / this.connected.damage_coeff ** 2);
	if (action === SCANNER_ACTION_SE) {
		if (rt.at(buffer_slot, "SE")) {
			viable_occupant.dna.struc_enzymes = rt.at(buffer_slot, "SE");
			yield* viable_occupant.domutcheck();
		}
	} else if (action === SCANNER_ACTION_UI) {
		if (rt.at(buffer_slot, "UI")) {
			viable_occupant.dna.uni_identity = rt.at(buffer_slot, "UI");
			yield* viable_occupant.updateappearance({ mutations_overlay_update: 1 });
		}
	} else if (action === SCANNER_ACTION_UE) {
		if (rt.at(buffer_slot, "name") && rt.at(buffer_slot, "UE") && rt.at(buffer_slot, "blood_type")) {
			viable_occupant.real_name = rt.at(buffer_slot, "name");
			viable_occupant.name = rt.at(buffer_slot, "name");
			viable_occupant.dna.unique_enzymes = rt.at(buffer_slot, "UE");
			viable_occupant.dna.blood_type = rt.at(buffer_slot, "blood_type");
		}
	} else if (action === SCANNER_ACTION_MIXED) {
		if (rt.at(buffer_slot, "UI")) {
			viable_occupant.dna.uni_identity = rt.at(buffer_slot, "UI");
			yield* viable_occupant.updateappearance({ mutations_overlay_update: 1 });
		}
		if (!(rt.at(buffer_slot, "name") && rt.at(buffer_slot, "UE") && rt.at(buffer_slot, "blood_type"))) return f.dot;
		viable_occupant.real_name = rt.at(buffer_slot, "name");
		viable_occupant.name = rt.at(buffer_slot, "name");
		viable_occupant.dna.unique_enzymes = rt.at(buffer_slot, "UE");
		viable_occupant.dna.blood_type = rt.at(buffer_slot, "blood_type");
	}
	return f.dot;
}, true);

// dna_console.dm:574
rt.def("/obj/machinery/computer/scan_consolenew/proc/on_scanner_close", function* on_scanner_close(f: Frame) {
	to_chat(this.connected.occupant, `<span class='notice'>${this} activates!</span>`);
	if (this.delayed_action) {
		yield* this.apply_buffer(rt.at(this.delayed_action, "action"), rt.at(this.delayed_action, "buffer"));
		this.delayed_action = null;
	}
	return f.dot;
}, true);
