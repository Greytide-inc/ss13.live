// Based on /tg/station's code/modules/detectivework/scanner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(9392, "/obj/item/device/detective_scanner", "/obj/item/device", {
	scanning: 0,
	log: null,
	range: 8,
	view_check: 1,
	flags: 68,
	name: "forensic scanner",
	desc: "Used to remotely scan objects and biomass for DNA and fingerprints. Can print a report of the findings.",
	icon_state: "forensicnew",
	w_class: 2,
	item_state: "electronic",
	slot_flags: 512,
	origin_tech: "engineering=4;biotech=2;programming=5",
});

// scanner.dm:14
rt.def("/obj/item/device/detective_scanner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.log = list();
	return f.dot;
});

// scanner.dm:20
rt.def("/obj/item/device/detective_scanner/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (rt.len(f, this.log) && !this.scanning) {
		this.scanning = 1;
		to_chat(user, "<span class='notice'>Printing report, please wait...</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/detective_scanner/proc/PrintReport"))), 100);
	} else {
		to_chat(user, "<span class='notice'>The scanner has no logs or is in use.</span>");
	}
	return f.dot;
}, true);

// scanner.dm:32
rt.def("/obj/item/device/detective_scanner/proc/PrintReport", function* PrintReport(f: Frame) {
	let _P: Value = null, M: Value = null;
	(_P = (yield* new_(T("/obj/item/weapon/paper"), rt.getStep(f, this, 0)))).name = "paper- 'Scanner Report'";
	_P.info = "<center><font size='6'><B>Scanner Report</B></font></center><HR><BR>";
	_P.info += jointext(this.log, "<BR>");
	_P.info += "<HR><B>Notes:</B><BR>";
	_P.info_links = _P.info;
	if (ismob(this.loc)) {
		yield* (M = this.loc).put_in_hands(_P);
		to_chat(M, "<span class='notice'>Report printed. Log cleared.<span>");
	}
	this.log = list();
	this.scanning = 0;
	return f.dot;
}, true);

// scanner.dm:49
rt.def("/obj/item/device/detective_scanner/proc/afterattack", function afterattack(f: Frame, A: Value, user: Value, params: Value) {
	this.scan(A, user);
	return 0;
});

// scanner.dm:54
rt.def("/obj/item/device/detective_scanner/proc/scan", function* scan(f: Frame, A: Value, user: Value) {
	let H: Value = null, R: Value = null, blood_DNA: Value = null, blood_type: Value = null, finger: Value = null, B: Value = null, fiber: Value = null, R_6: Value = null, holder: Value = null;
	if (this.scanning) return f.dot;
	if (get_dist(A, user) > this.range || !rt.isIn(f, A, view(this.range, user)) && this.view_check || this.loc != user) {
		return f.dot;
	}
	this.scanning = 1;
	user.visible_message(fmt("＄！ points the ＀ at ％！ and performs a forensic scan.", [user, this.name, A]));
	to_chat(user, fmt("<span class='notice'>You scan ％！. The scanner is now analysing the results...</span>", [A]));
	let fingerprints: Value = list();
	let blood: Value = list();
	let fibers: Value = list();
	let reagents: Value = list();
	let target_name: Value = A.name;
	if (A.blood_DNA && rt.len(f, A.blood_DNA)) {
		blood = (yield* A.blood_DNA.Copy());
	}
	if (A.suit_fibers && rt.len(f, A.suit_fibers)) {
		fibers = (yield* A.suit_fibers.Copy());
	}
	if (rt.istype(A, T("/mob/living/carbon/human"))) {
		if (!(H = A).gloves) {
			fingerprints += md5(H.dna.uni_identity);
		}
	} else if (!ismob(A)) {
		if (A.fingerprints && rt.len(f, A.fingerprints)) {
			fingerprints = (yield* A.fingerprints.Copy());
		}
		if (A.reagents && rt.len(f, A.reagents.reagent_list)) {
			for (R of each(A.reagents.reagent_list, T("/datum/reagent"))) {
				rt.setAt(reagents, R.name, R.volume);
				if (rt.istype(R, T("/datum/reagent/blood"))) {
					if (rt.index(R.data, "blood_DNA") && rt.index(R.data, "blood_type")) {
						blood_DNA = rt.index(R.data, "blood_DNA");
						blood_type = rt.index(R.data, "blood_type");
						rt.setAt(blood, blood_DNA, blood_type);
					}
				}
			}
		}
	}
	let found_something: Value = 0;
	yield* this.add_log(`<B>${worldtime2text()}${get_timestamp()} - ${target_name}</B>`, 0);
	if (fingerprints && rt.len(f, fingerprints)) {
		yield* sleep(30);
		yield* this.add_log("<span class='info'><B>Prints:</B></span>");
		for (finger of each(fingerprints)) {
			yield* this.add_log(`${finger}`);
		}
		found_something = 1;
	}
	if (blood && rt.len(f, blood)) {
		yield* sleep(30);
		yield* this.add_log("<span class='info'><B>Blood:</B></span>");
		found_something = 1;
		for (B of each(blood)) {
			yield* this.add_log(`Type: <font color='red'>${rt.index(blood, B)}</font> DNA: <font color='red'>${B}</font>`);
		}
	}
	if (fibers && rt.len(f, fibers)) {
		yield* sleep(30);
		yield* this.add_log("<span class='info'><B>Fibers:</B></span>");
		for (fiber of each(fibers)) {
			yield* this.add_log(`${fiber}`);
		}
		found_something = 1;
	}
	if (reagents && rt.len(f, reagents)) {
		yield* sleep(30);
		yield* this.add_log("<span class='info'><B>Reagents:</B></span>");
		for (R_6 of each(reagents)) {
			yield* this.add_log(`Reagent: <font color='red'>${R_6}</font> Volume: <font color='red'>${rt.index(reagents, R_6)}</font>`);
		}
		found_something = 1;
	}
	if (ismob(this.loc)) {
		holder = this.loc;
	}
	if (!found_something) {
		yield* this.add_log("<I># No forensic traces found #</I>", 0);
		if (holder) {
			to_chat(holder, fmt("<span class='warning'>Unable to locate any fingerprints, materials, fibers, or blood on ％！!</span>", [target_name]));
		}
	} else if (holder) {
		to_chat(holder, fmt("<span class='notice'>You finish scanning ％！.</span>", [target_name]));
	}
	yield* this.add_log("---------------------------------------------------------", 0);
	this.scanning = 0;
	return f.dot;
}, true, { waitfor: false });

// scanner.dm:164
rt.def("/obj/item/device/detective_scanner/proc/add_log", function add_log(f: Frame, msg: Value, broadcast: Value) {
	let M: Value = null;
	broadcast ??= 1;
	if (this.scanning) {
		if (broadcast && ismob(this.loc)) {
			to_chat((M = this.loc), msg);
		}
		this.log += `&nbsp;&nbsp;${msg}`;
	} else {
		CRASH(fmt("＀ ＃ is adding a log when it was never put in scanning mode!", [this, this]));
	}
	return f.dot;
});

// scanner.dm:172
rt.def("/proc/get_timestamp", function get_timestamp(f: Frame) {
	return time2text(rt.worldTime(f) + 432000, ":ss");
});
