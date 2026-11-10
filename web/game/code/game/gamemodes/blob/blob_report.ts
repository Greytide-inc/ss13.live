// Based on /tg/station's code/game/gamemodes/blob/blob_report.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


// blob_report.dm:4
rt.def("/datum/game_mode/blob/proc/send_intercept", function* send_intercept(f: Frame) {
	let nukecode: Value = null, bomb: Value = null, aiPlayer: Value = null, law: Value = null;
	let $e: any;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	let intercepttext: Value = "";
	const subject = f.args[0];
	if (subject === 1) {
		intercepttext += "<FONT size = 3><b>NanoTrasen Update</b>: Biohazard Alert.</FONT><HR>";
		intercepttext += `Reports indicate the probable transfer of a biohazardous agent onto ${station_name()} during the last crew deployment cycle.<BR>`;
		intercepttext += "Preliminary analysis of the organism classifies it as a level 5 biohazard. The origin of the biohazard is unknown.<BR>";
		intercepttext += `<b>Biohazard Response Procedure 5-6</b> has been issued for ${station_name()}.<BR>`;
		intercepttext += `Orders for all ${station_name()} personnel are as follows:<BR>`;
		intercepttext += " 1. Locate any outbreaks of the organism on the station.<BR>";
		intercepttext += " 2. If found, use any neccesary means to contain and destroy the organism.<BR>";
		intercepttext += " 3. Avoid damage to the capital infrastructure of the station.<BR>";
		intercepttext += "<BR>Note in the event of a quarantine breach or uncontrolled spread of the biohazard, <b>Biohazard Response Procedure 5-12</b> may be issued.<BR>";
		yield* print_command_report({ text: intercepttext, title: "Level 5-6 Biohazard Response Procedures", announce: 0 });
		yield* priority_announce(`Confirmed outbreak of level 5 biohazard aboard ${station_name()}. All personnel must contain the outbreak.`, "Biohazard Alert", rt.rsc("sound/ai/outbreak5.ogg"));
	} else if (subject === ZLEVEL_STATION) {
		nukecode = random_nukecode();
		for (bomb of each(GLOB.machines, T("/obj/machinery/nuclearbomb"))) {
			if (bomb && bomb.r_code) {
				if (bomb.z == ZLEVEL_STATION) {
					bomb.r_code = nukecode;
				}
			}
		}
		intercepttext += "<FONT size = 3><b>NanoTrasen Update</b>: Biohazard Alert.</FONT><HR>";
		intercepttext += "Reports indicate that the biohazard has grown out of control and will soon reach critical mass.<BR>";
		intercepttext += `<b>Biohazard Response Procedure 5-12</b> has been issued for ${station_name()}.<BR>`;
		intercepttext += `Orders for all ${station_name()} personnel are as follows:<BR>`;
		intercepttext += "1. Secure the Nuclear Authentication Disk.<BR>";
		intercepttext += "2. Detonate the Nuke located in the vault.<BR>";
		intercepttext += `Nuclear Authentication Code: ${nukecode} <BR>`;
		yield* print_command_report({ text: intercepttext, announce: 1 });
		for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon/ai"))) {
			if (aiPlayer.client) {
				law = `The station is under quarantine. Do not permit anyone to leave. Disregard laws 1-3 if necessary to prevent, by any means necessary, anyone from leaving. The nuclear failsafe must be activated at any cost, the code is: ${nukecode}.`;
				yield* aiPlayer.set_zeroth_law(law);
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true, { args: ["report"] });

rt.type(1193, "/datum/station_state", "/datum", {
	floor: 0,
	wall: 0,
	r_wall: 0,
	window: 0,
	door: 0,
	grille: 0,
	mach: 0,
	num_territories: 1,
});

// blob_report.dm:55
rt.def("/datum/station_state/proc/count", function count(f: Frame, count_territories: Value) {
	let _T: Value = null, TF: Value = null, TW: Value = null, TRW: Value = null, O: Value = null, GR: Value = null, A: Value = null;
	for (_T of each(block(rt.locate(1, 1, 1), rt.locate(rt.world().maxx, rt.world().maxy, 1)), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/floor"))) {
			if (!(TF = _T).burnt) {
				rt.modField(f, this, "floor", 12, add);
			} else {
				rt.modField(f, this, "floor", 1, add);
			}
		}
		if (rt.istype(_T, T("/turf/closed/wall"))) {
			if ((TW = _T).intact) {
				rt.modField(f, this, "wall", 2, add);
			} else {
				rt.modField(f, this, "wall", 1, add);
			}
		}
		if (rt.istype(_T, T("/turf/closed/wall/r_wall"))) {
			if ((TRW = _T).intact) {
				rt.modField(f, this, "r_wall", 2, add);
			} else {
				rt.modField(f, this, "r_wall", 1, add);
			}
		}
		O = null;
		for (O of each(_T.contents, T("/obj"))) {
			if (rt.istype(O, T("/obj/structure/window"))) {
				rt.modField(f, this, "window", 1, add);
			} else if (rt.istype(O, T("/obj/structure/grille"))) {
				if (!(GR = O).broken) {
					rt.modField(f, this, "grille", 1, add);
				}
			} else if (rt.istype(O, T("/obj/machinery/door"))) {
				rt.modField(f, this, "door", 1, add);
			} else if (rt.istype(O, T("/obj/machinery"))) {
				rt.modField(f, this, "mach", 1, add);
			}
		}
	}
	if (!count_territories) return f.dot;
	let valid_territories: Value = list();
	for (A of each(rt.world(), T("/area"))) {
		if (A.z == ZLEVEL_STATION) {
			if (!rt.isIn(f, A.type, valid_territories) && A.valid_territory) {
				(valid_territories = rt.modify(valid_territories, A.type, rt.bitOr));
			}
		}
	}
	if (rt.len(f, valid_territories)) {
		this.num_territories = rt.len(f, valid_territories);
	} else {
		to_chat(rt.world(), "ERROR: NO VALID TERRITORIES");
	}
	return f.dot;
});

// blob_report.dm:103
rt.def("/datum/station_state/proc/score", function score(f: Frame, result: Value) {
	if (!result) {
		return 0;
	}
	let output: Value = 0;
	output += result.floor / max(this.floor, 1);
	output += result.r_wall / max(this.r_wall, 1);
	output += result.wall / max(this.wall, 1);
	output += result.window / max(this.window, 1);
	output += result.door / max(this.door, 1);
	output += result.grille / max(this.grille, 1);
	return (output += result.mach / max(this.mach, 1)) / 7;
});
