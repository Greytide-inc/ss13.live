// Based on /tg/station's code/modules/ninja/suit/ninjaDrainAct.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// ninjaDrainAct.dm:15
rt.def("/atom/proc/ninjadrain_act", function ninjadrain_act(f: Frame) {
	return "INVALID";
});

// ninjaDrainAct.dm:22
rt.def("/obj/machinery/power/apc/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let spark_system: Value = null;
	if (!S || !H || !G) {
		return "INVALID";
	}
	let maxcapacity: Value = 0;
	let drain: Value = 0;
	f.dot = 0;
	if (!(this.cell && this.cell.charge)) return f.dot;
	yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 0, this.loc);
	while (G.candrain && this.cell.charge > 0 && !maxcapacity) {
		drain = rand(G.mindrain, G.maxdrain);
		if (this.cell.charge < drain) {
			drain = this.cell.charge;
		}
		if (S.cell.charge + drain > S.cell.maxcharge) {
			drain = S.cell.maxcharge - S.cell.charge;
			maxcapacity = 1;
		}
		if (yield* do_after(H, 10, { target: this })) {
			yield* spark_system.start();
			playsound(this.loc, "sparks", 50, 1);
			this.cell.charge -= drain;
			S.cell.charge += drain;
			f.dot += drain;
		} else {
			break;
		}
	}
	if (this.emagged) return f.dot;
	flick("apc-spark", G);
	this.emagged = 1;
	this.locked = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// ninjaDrainAct.dm:65
rt.def("/obj/machinery/power/smes/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let spark_system: Value = null;
	if (!S || !H || !G) {
		return "INVALID";
	}
	let maxcapacity: Value = 0;
	let drain: Value = 0;
	f.dot = 0;
	if (!this.charge) return f.dot;
	yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 0, this.loc);
	while (G.candrain && this.charge > 0 && !maxcapacity) {
		drain = rand(G.mindrain, G.maxdrain);
		if (this.charge < drain) {
			drain = this.charge;
		}
		if (S.cell.charge + drain > S.cell.maxcharge) {
			drain = S.cell.maxcharge - S.cell.charge;
			maxcapacity = 1;
		}
		if (yield* do_after(H, 10, { target: this })) {
			yield* spark_system.start();
			playsound(this.loc, "sparks", 50, 1);
			this.charge -= drain;
			S.cell.charge += drain;
			f.dot += drain;
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// ninjaDrainAct.dm:100
rt.def("/obj/item/weapon/stock_parts/cell/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	if (!S || !H || !G) {
		return "INVALID";
	}
	f.dot = 0;
	if (!this.charge) return f.dot;
	if (!(G.candrain && (yield* do_after(H, 30, { target: this })))) return f.dot;
	f.dot = this.charge;
	if (S.cell.charge + this.charge > S.cell.maxcharge) {
		S.cell.charge = S.cell.maxcharge;
	} else {
		S.cell.charge += this.charge;
	}
	this.charge = 0;
	this.corrupt();
	yield* this.update_icon();
	return f.dot;
}, true);

// ninjaDrainAct.dm:119
rt.def("/obj/machinery/computer/rdconsole/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let location: Value = null, AI: Value = null, current_data: Value = null, id: Value = null, analyzing_data: Value = null;
	if (!S || !H || !G) {
		return "INVALID";
	}
	f.dot = "RDHACKFAIL";
	to_chat(H, fmt("<span class='notice'>Hacking ％！...</span>", [this]));
	rt.spawnTail(f, 0, "/obj/machinery/computer/rdconsole/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:125", S, H, G, location, AI, current_data, id, analyzing_data);
	if (this.files && rt.len(f, this.files.known_tech)) {
		for (current_data of each(S.stored_research, T("/datum/tech"))) {
			to_chat(H, fmt("<span class='notice'>Checking ％！ database.</span>", [current_data.name]));
			if ((yield* do_after(H, S.s_delay, { target: this })) && G.candrain && this) {
				id = null;
				for (id of each(this.files.known_tech)) {
					analyzing_data = rt.index(this.files.known_tech, id);
					if (current_data.id == analyzing_data.id) {
						if (analyzing_data.level > current_data.level) {
							to_chat(H, "<span class='notice'>Database:</span> <b>UPDATED</b>.");
							current_data.level = analyzing_data.level;
							f.dot = "RDHACK";
						}
						break;
					}
				}
			} else {
				break;
			}
		}
	}
	to_chat(H, "<span class='notice'>Data analyzed. Process finished.</span>");
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/computer/rdconsole/proc/ninjadrain_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:125", function* (f: Frame, S: Value, H: Value, G: Value, location: Value, AI: Value, current_data: Value, id: Value, analyzing_data: Value) {
	let $0: any, $1: any, $e: any;
	location = rt.getStep(f, H, 0);
	AI = null;
	for (AI of each(GLOB.player_list, T("/mob/living/silicon/ai"))) {
		$0 = AI;
		if (location) {
			$1 = ` in ${location}`;
		} else {
			$1 = ". Unable to pinpoint location";
		}
		to_chat($0, `<span class='userdanger'>Network Alert: Hacking attempt detected${$1}</span>.`);
	}
	return null;
});

// ninjaDrainAct.dm:151
rt.def("/obj/machinery/r_n_d/server/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let location: Value = null, AI: Value = null, current_data: Value = null, id: Value = null, analyzing_data: Value = null;
	if (!S || !H || !G) {
		return "INVALID";
	}
	f.dot = "RDHACKFAIL";
	to_chat(H, fmt("<span class='notice'>Hacking ％！...</span>", [this]));
	rt.spawnTail(f, 0, "/obj/machinery/r_n_d/server/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:157", S, H, G, location, AI, current_data, id, analyzing_data);
	if (this.files && rt.len(f, this.files.known_tech)) {
		for (current_data of each(S.stored_research, T("/datum/tech"))) {
			to_chat(H, fmt("<span class='notice'>Checking ％！ database.</span>", [current_data.name]));
			if ((yield* do_after(H, S.s_delay, { target: this })) && G.candrain && this) {
				id = null;
				for (id of each(this.files.known_tech)) {
					analyzing_data = rt.index(this.files.known_tech, id);
					if (current_data.id == analyzing_data.id) {
						if (analyzing_data.level > current_data.level) {
							to_chat(H, "<span class='notice'>Database:</span> <b>UPDATED</b>.");
							current_data.level = analyzing_data.level;
							f.dot = "RDHACK";
						}
						break;
					}
				}
			} else {
				break;
			}
		}
	}
	to_chat(H, "<span class='notice'>Data analyzed. Process finished.</span>");
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/r_n_d/server/proc/ninjadrain_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/r_n_d/server/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:157", function* (f: Frame, S: Value, H: Value, G: Value, location: Value, AI: Value, current_data: Value, id: Value, analyzing_data: Value) {
	let $0: any, $1: any, $e: any;
	location = rt.getStep(f, H, 0);
	AI = null;
	for (AI of each(GLOB.player_list, T("/mob/living/silicon/ai"))) {
		$0 = AI;
		if (location) {
			$1 = ` in ${location}`;
		} else {
			$1 = ". Unable to pinpoint location";
		}
		to_chat($0, `<span class='userdanger'>Network Alert: Hacking attempt detected${$1}</span>.`);
	}
	return null;
});

// ninjaDrainAct.dm:182
rt.def("/obj/structure/cable/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let drained: Value = null, _T: Value = null, AP: Value = null;
	if (!S || !H || !G) {
		return "INVALID";
	}
	let maxcapacity: Value = 0;
	let drain: Value = 0;
	f.dot = 0;
	let PN: Value = this.powernet;
	while (G.candrain && !maxcapacity && this) {
		drain = round(rand(G.mindrain, G.maxdrain) / 2);
		drained = 0;
		if (PN && (yield* do_after(H, 10, { target: this }))) {
			drained = min(drain, PN.avail);
			PN.load += drained;
			if (drained < drain) {
				_T = null;
				for (_T of each(PN.nodes, T("/obj/machinery/power/terminal"))) {
					if (rt.istype(_T.master, T("/obj/machinery/power/apc"))) {
						if ((AP = _T.master).operating && AP.cell && AP.cell.charge > 0) {
							AP.cell.charge = max(0, AP.cell.charge - 5);
							drained += 5;
						}
					}
				}
			}
		} else {
			break;
		}
		S.cell.charge += drained;
		if (S.cell.charge > S.cell.maxcharge) {
			f.dot += drained - (S.cell.charge - S.cell.maxcharge);
			S.cell.charge = S.cell.maxcharge;
			maxcapacity = 1;
		} else {
			f.dot += drained;
		}
		yield* S.spark_system.start();
	}
	return f.dot;
}, true);

// ninjaDrainAct.dm:218
rt.def("/obj/mecha/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	if (!S || !H || !G) {
		return "INVALID";
	}
	let maxcapacity: Value = 0;
	let drain: Value = 0;
	f.dot = 0;
	this.occupant_message("<span class='danger'>Warning: Unauthorized access through sub-route 4, block H, detected.</span>");
	if (!this.get_charge()) return f.dot;
	while (G.candrain && this.cell.charge > 0 && !maxcapacity) {
		drain = rand(G.mindrain, G.maxdrain);
		if (this.cell.charge < drain) {
			drain = this.cell.charge;
		}
		if (S.cell.charge + drain > S.cell.maxcharge) {
			drain = S.cell.maxcharge - S.cell.charge;
			maxcapacity = 1;
		}
		if (yield* do_after(H, 10, { target: this })) {
			yield* this.spark_system.start();
			playsound(this.loc, "sparks", 50, 1);
			yield* this.cell.use(drain);
			S.cell.charge += drain;
			f.dot += drain;
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// ninjaDrainAct.dm:245
rt.def("/mob/living/silicon/robot/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	if (!S || !H || !G) {
		return "INVALID";
	}
	let maxcapacity: Value = 0;
	let drain: Value = 0;
	f.dot = 0;
	to_chat(this, "<span class='danger'>Warning: Unauthorized access through sub-route 12, block C, detected.</span>");
	if (!(this.cell && this.cell.charge)) return f.dot;
	while (G.candrain && this.cell.charge > 0 && !maxcapacity) {
		drain = rand(G.mindrain, G.maxdrain);
		if (this.cell.charge < drain) {
			drain = this.cell.charge;
		}
		if (S.cell.charge + drain > S.cell.maxcharge) {
			drain = S.cell.maxcharge - S.cell.charge;
			maxcapacity = 1;
		}
		if (yield* do_after(H, 10)) {
			yield* this.spark_system.start();
			playsound(this.loc, "sparks", 50, 1);
			this.cell.charge -= drain;
			S.cell.charge += drain;
			f.dot += drain;
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// ninjaDrainAct.dm:274
rt.def("/mob/living/carbon/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let spark_system: Value = null;
	if (!S || !H || !G) {
		return "INVALID";
	}
	f.dot = "MOBSHOCKFAIL";
	if (!(S.cell && S.cell.charge && (yield* S.cell.use(1000)))) return f.dot;
	f.dot = "MOBSHOCK";
	yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 0, this.loc);
	playsound(this, "sparks", 50, 1);
	this.visible_message(`<span class='danger'>${H} electrocutes ${this} with ${H.p_their()} touch!</span>`, `<span class='userdanger'>${H} electrocutes you with ${H.p_their()} touch!</span>`);
	yield* this.electrocute_act(25, H);
	return f.dot;
}, true);
