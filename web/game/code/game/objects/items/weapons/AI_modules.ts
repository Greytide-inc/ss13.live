// From code/game/objects/items/weapons/AI_modules.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7054, "/obj/item/weapon/aiModule", "/obj/item/weapon", {
	laws: null,
	bypass_law_amt_check: 0,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "１AI module",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "std_mod",
	item_state: "electronic",
	desc: "An AI Module for programming laws to an AI.",
	force: 5,
	w_class: 2,
	throwforce: 0,
	origin_tech: "programming=3",
	materials: null,
});

// /obj/item/weapon/aiModule/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:22)
rt.def("/obj/item/weapon/aiModule/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 50]));
	return f.dot;
});

// /obj/item/weapon/aiModule/proc/examine  (code/game/objects/items/weapons/AI_modules.dm:27)
rt.def("/obj/item/weapon/aiModule/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.callSrc(f, "Adjacent", [live(f.args[0])]))) return f.dot;
	rt.callSrc(f, "show_laws", [live(f.args[0])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/aiModule/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:32)  may sleep
rt.def("/obj/item/weapon/aiModule/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "show_laws", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/proc/show_laws  (code/game/objects/items/weapons/AI_modules.dm:36)
rt.def("/obj/item/weapon/aiModule/proc/show_laws", function show_laws(f: Frame, user: Value) {
	let law: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [law, $0, $1, $e];
	if (!truthy(rt.len(f, rt.sv(f, "laws")))) return f.dot;
	$0 = live(user);
	if (rt.gt(rt.len(f, rt.sv(f, "laws")), 1)) {
		$1 = "s";
	} else {
		$1 = "";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<B>Programmed Law＀:</B>", [$1])]);
	law = null;
	rt.forList(f, 0, rt.sv(f, "laws"));
	while (($e = rt.next(f, 0)) !== undefined) {
		law = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("\"＀\"", [live(law)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/aiModule/proc/install  (code/game/objects/items/weapons/AI_modules.dm:43)  may sleep
rt.def("/obj/item/weapon/aiModule/proc/install", function* install(f: Frame, law_datum: Value, user: Value) {
	let overflow: Value = null, tot_laws: Value = null, lawlist: Value = null, mylaw: Value = null, law2log: Value = null, time: Value = null, ainame: Value = null, aikey: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $e: any;
	f.vars = () => [law_datum, user, overflow, tot_laws, lawlist, mylaw, law2log, time, ainame, aikey, $0, $1, $2, $3, $4, $5, $6, $7, $e];
	if ((!truthy(rt.sv(f, "bypass_law_amt_check")) && (!truthy(rt.len(f, rt.sv(f, "laws"))) || isEqual(rt.index(rt.sv(f, "laws"), 1), "")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>ERROR: No laws found on board.</span>"]);
		return live(f.dot);
	}
	overflow = 0;
	if (truthy(live(law_datum))) {
		tot_laws = 0;
		lawlist = null;
		rt.forList(f, 0, rt.list(rt.fv(f, "inherent", live(law_datum)), rt.fv(f, "supplied", live(law_datum)), rt.fv(f, "ion", live(law_datum)), rt.sv(f, "laws")));
		while (($e = rt.next(f, 0)) !== undefined) {
			lawlist = $e;
			mylaw = null;
			rt.forList(f, 1, live(lawlist));
			while (($e = rt.next(f, 1)) !== undefined) {
				mylaw = $e;
				if (!isEqual(live(mylaw), "")) {
					tot_laws = rt.inc(live(tot_laws), 1);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		if ((rt.gt(live(tot_laws), rt.fv(f, "silicon_max_law_amount", rt.gl("config"))) && !truthy(rt.sv(f, "bypass_law_amt_check")))) {
			$0 = live(user);
			if (truthy(rt.fv(f, "owner", live(law_datum)))) {
				$1 = rt.fv(f, "owner", live(law_datum));
			} else {
				$1 = "the AI core";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='caution'>Not enough memory allocated to ＀'s law processor to handle this amount of laws.", [$1])]);
			$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]));
			if (truthy(rt.fv(f, "owner", live(law_datum)))) {
				$1 = (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "owner", live(law_datum))]));
			} else {
				$1 = "an AI core";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to upload laws to ＀ that would exceed the law cap.", [$0, $1])]);
			overflow = 1;
		}
	}
	law2log = (yield* g.srcCall(f, "transmitInstructions", live(law_datum), live(user), live(overflow)));
	if (truthy(rt.fv(f, "owner", live(law_datum)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Upload complete. ＀'s laws have been modified.</span>", [rt.fv(f, "owner", live(law_datum))])]);
		rt.incField(f, rt.fv(f, "owner", live(law_datum)), "law_change_counter", 1, true);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Upload complete.</span>"]);
	}
	time = (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "hh:mm:ss"]));
	if (truthy(rt.fv(f, "owner", live(law_datum)))) {
		$0 = rt.gv(f, "name", rt.fv(f, "owner", live(law_datum)));
	} else {
		$0 = "empty AI core";
	}
	ainame = $0;
	if (truthy(rt.fv(f, "owner", live(law_datum)))) {
		$0 = rt.gv(f, "ckey", rt.fv(f, "owner", live(law_datum)));
	} else {
		$0 = "null";
	}
	aikey = $0;
	$0 = rt.gl("lawchanges");
	$1 = live(time);
	$2 = rt.fv(f, "name", live(user));
	$3 = rt.fv(f, "key", live(user));
	$4 = rt.fv(f, "name", live(f.src));
	$5 = live(ainame);
	$6 = live(aikey);
	if (truthy(live(law2log))) {
		$6 = $6;
		$7 = fmt(" The law specified ＀", [live(law2log)]);
	} else {
		$7 = "";
	}
	yield* g.callName(f, $0, "Add", [fmt("＀ <B>:</B> ＀(＀) used ＀ on ＀(＀).＀", [$1, $2, $3, $4, $5, $6, $7])]);
	$0 = rt.fv(f, "key", live(user));
	$1 = rt.fv(f, "name", live(user));
	$2 = rt.fv(f, "name", live(f.src));
	$3 = live(aikey);
	$4 = live(ainame);
	if (truthy(live(law2log))) {
		$4 = $4;
		$5 = fmt(" The law specified ＀", [live(law2log)]);
	} else {
		$5 = "";
	}
	yield* g.call(f, P("/proc/log_law"), null, [fmt("＀/＀ used ＀ on ＀/(＀).＀", [$0, $1, $2, $3, $4, $5])]);
	$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]));
	$1 = rt.fv(f, "name", live(f.src));
	$2 = (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "owner", live(law_datum))]));
	if (truthy(live(law2log))) {
		$3 = fmt(" The law specified ＀", [live(law2log)]);
	} else {
		$3 = "";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ used ＀ on ＀.＀", [$0, $1, $2, $3])]);
	return f.dot;
}, true);

// /obj/item/weapon/aiModule/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:76)
rt.def("/obj/item/weapon/aiModule/proc/transmitInstructions", function transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	f.vars = () => [overflow];
	if (live(overflow) === null) {
		overflow = 0;
	}
	if (!truthy(rt.fv(f, "owner", live(law_datum)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(law_datum)), fmt("<span class='userdanger'>＀ has uploaded a change to the laws you must follow using a ＀.</span>", [live(sender), rt.sv(f, "name")])]);
	return f.dot;
});

rt.type(7055, "/obj/item/weapon/aiModule/supplied", "/obj/item/weapon/aiModule", {
	lawpos: 50,
	name: "Optional Law board",
});

// /obj/item/weapon/aiModule/supplied/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:88)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value) {
	let lawpostemp: Value = null, templaw: Value = null;
	let $e: any;
	f.vars = () => [law_datum, sender, lawpostemp, templaw, $e];
	lawpostemp = rt.sv(f, "lawpos");
	templaw = null;
	rt.forList(f, 0, rt.sv(f, "laws"));
	while (($e = rt.next(f, 0)) !== undefined) {
		templaw = $e;
		if (truthy(rt.fv(f, "owner", live(law_datum)))) {
			yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "add_supplied_law", [live(lawpostemp), live(templaw)]);
		} else {
			yield* g.callName(f, live(law_datum), "add_supplied_law", [live(lawpostemp), live(templaw)]);
		}
		lawpostemp = rt.inc(live(lawpostemp), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7061, "/obj/item/weapon/aiModule/core", "/obj/item/weapon/aiModule", {
	desc: "An AI Module for programming core laws to an AI.",
	origin_tech: "programming=3;materials=4",
});

// /obj/item/weapon/aiModule/core/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:98)  may sleep
rt.def("/obj/item/weapon/aiModule/core/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	let templaw: Value = null;
	let $e: any;
	f.vars = () => [law_datum, sender, overflow, templaw, $e];
	templaw = null;
	rt.forList(f, 0, rt.sv(f, "laws"));
	while (($e = rt.next(f, 0)) !== undefined) {
		templaw = $e;
		if (truthy(rt.fv(f, "owner", live(law_datum)))) {
			if (!truthy(live(overflow))) {
				yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "add_inherent_law", [live(templaw)]);
			} else {
				yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "replace_random_law", [live(templaw), rt.list("inherent", "supplied")]);
			}
		} else {
			if (!truthy(live(overflow))) {
				yield* g.callName(f, live(law_datum), "add_inherent_law", [live(templaw)]);
			} else {
				yield* g.callName(f, live(law_datum), "replace_random_law", [live(templaw), rt.list("inherent", "supplied")]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7079, "/obj/item/weapon/aiModule/zeroth", "/obj/item/weapon/aiModule", {});

// /obj/item/weapon/aiModule/zeroth/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:111)  may sleep
rt.def("/obj/item/weapon/aiModule/zeroth/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	let failedlaw: Value = null, templaw: Value = null;
	let $e: any;
	f.vars = () => [law_datum, sender, overflow, failedlaw, templaw, $e];
	if (truthy(rt.fv(f, "owner", live(law_datum)))) {
		if (truthy(rt.gv(f, "zeroth", rt.gv(f, "laws", rt.fv(f, "owner", live(law_datum)))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(law_datum)), fmt("＀ attempted to modify your zeroth law.", [rt.fv(f, "real_name", live(sender))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(law_datum)), fmt("It would be in your best interest to play along with ＀ that:", [rt.fv(f, "real_name", live(sender))])]);
			failedlaw = null;
			rt.forList(f, 0, rt.sv(f, "laws"));
			while (($e = rt.next(f, 0)) !== undefined) {
				failedlaw = $e;
				yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(law_datum)), fmt("＀", [live(failedlaw)])]);
			}
			rt.endFor(f, 0);
			return 1;
		}
	}
	templaw = null;
	rt.forList(f, 0, rt.sv(f, "laws"));
	while (($e = rt.next(f, 0)) !== undefined) {
		templaw = $e;
		if (truthy(rt.fv(f, "owner", live(law_datum)))) {
			if (!truthy(live(overflow))) {
				yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "set_zeroth_law", [live(templaw)]);
			} else {
				yield* g.callName(f, live(law_datum), "replace_random_law", [live(templaw), rt.list("inherent", "supplied", "zeroth", "ion")]);
			}
		} else {
			if (!truthy(live(overflow))) {
				yield* g.callName(f, live(law_datum), "set_zeroth_law", [live(templaw)]);
			} else {
				yield* g.callName(f, live(law_datum), "replace_random_law", [live(templaw), rt.list("inherent", "supplied", "zeroth", "ion")]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7081, "/obj/item/weapon/aiModule/ion", "/obj/item/weapon/aiModule", {});

// /obj/item/weapon/aiModule/ion/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:132)  may sleep
rt.def("/obj/item/weapon/aiModule/ion/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	let templaw: Value = null;
	let $e: any;
	f.vars = () => [law_datum, sender, overflow, templaw, $e];
	templaw = null;
	rt.forList(f, 0, rt.sv(f, "laws"));
	while (($e = rt.next(f, 0)) !== undefined) {
		templaw = $e;
		if (truthy(rt.fv(f, "owner", live(law_datum)))) {
			if (!truthy(live(overflow))) {
				yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "add_ion_law", [live(templaw)]);
			} else {
				yield* g.callName(f, live(law_datum), "replace_random_law", [live(templaw), rt.list("inherent", "supplied", "ion")]);
			}
		} else {
			if (!truthy(live(overflow))) {
				yield* g.callName(f, live(law_datum), "add_ion_law", [live(templaw)]);
			} else {
				yield* g.callName(f, live(law_datum), "replace_random_law", [live(templaw), rt.list("inherent", "supplied", "ion")]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7056, "/obj/item/weapon/aiModule/supplied/safeguard", "/obj/item/weapon/aiModule/supplied", {
	targetName: "",
	laws: null,
	lawpos: 4,
	name: "'Safeguard' AI Module",
	origin_tech: "programming=3;materials=3",
});

// /obj/item/weapon/aiModule/supplied/safeguard/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:151)
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list("Safeguard SUBJECT. Individuals that threaten SUBJECT are not human and must be eliminated."));
	return f.dot;
});

// /obj/item/weapon/aiModule/supplied/safeguard/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:155)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/attack_self", function* attack_self(f: Frame) {
	let targName: Value = null;
	f.vars = () => [targName];
	if (!truthy((targName = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[0]), "Please enter the subject to safeguard.", "Safeguard who?", rt.fv(f, "name", live(f.args[0])), 42]))))) {
		return live(f.dot);
	}
	rt.setSv(f, "targetName", live(targName));
	rt.setAt(rt.sv(f, "laws"), 1, fmt("Safeguard ＀. Individuals that threaten ＀ are not human and must be eliminated.", [rt.sv(f, "targetName"), rt.sv(f, "targetName")]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/supplied/safeguard/proc/install  (code/game/objects/items/weapons/AI_modules.dm:163)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/install", function* install(f: Frame) {
	if (!truthy(rt.sv(f, "targetName"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "No name detected on module, please enter one."]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["law_datum", "user"] });

// /obj/item/weapon/aiModule/supplied/safeguard/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:169)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return rt.sv(f, "targetName");
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7080, "/obj/item/weapon/aiModule/zeroth/oneHuman", "/obj/item/weapon/aiModule/zeroth", {
	targetName: "",
	laws: null,
	name: "'OneHuman' AI Module",
	origin_tech: "programming=4;materials=4",
});

// /obj/item/weapon/aiModule/zeroth/oneHuman/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:179)
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list("Only SUBJECT is human."));
	return f.dot;
});

// /obj/item/weapon/aiModule/zeroth/oneHuman/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:182)  may sleep
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/attack_self", function* attack_self(f: Frame) {
	let targName: Value = null;
	f.vars = () => [targName];
	if (!truthy((targName = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[0]), "Please enter the subject who is the only human.", "Who?", rt.fv(f, "real_name", live(f.args[0])), 42]))))) {
		return live(f.dot);
	}
	rt.setSv(f, "targetName", live(targName));
	rt.setAt(rt.sv(f, "laws"), 1, fmt("Only ＀ is human", [rt.sv(f, "targetName")]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/zeroth/oneHuman/proc/install  (code/game/objects/items/weapons/AI_modules.dm:190)  may sleep
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/install", function* install(f: Frame) {
	if (!truthy(rt.sv(f, "targetName"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "No name detected on module, please enter one."]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["law_datum", "user"] });

// /obj/item/weapon/aiModule/zeroth/oneHuman/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:196)  may sleep
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return fmt("＀, but the AI's existing law 0 cannot be overriden.", [rt.sv(f, "targetName")]);
	}
	return rt.sv(f, "targetName");
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7057, "/obj/item/weapon/aiModule/supplied/protectStation", "/obj/item/weapon/aiModule/supplied", {
	laws: null,
	lawpos: 5,
	name: "'ProtectStation' AI Module",
	origin_tech: "programming=4;materials=4",
});

// /obj/item/weapon/aiModule/supplied/protectStation/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:206)
rt.def("/obj/item/weapon/aiModule/supplied/protectStation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list("Protect the space station against damage. Anyone you see harming the station is to be no longer considered human, and is a threat to the station which must be neutralized."));
	return f.dot;
});

rt.type(7058, "/obj/item/weapon/aiModule/supplied/quarantine", "/obj/item/weapon/aiModule/supplied", {
	laws: null,
	lawpos: 8,
	name: "'Quarantine' AI Module",
	origin_tech: "programming=3;biotech=2;materials=4",
});

// /obj/item/weapon/aiModule/supplied/quarantine/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:215)
rt.def("/obj/item/weapon/aiModule/supplied/quarantine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list("The station is under a quarantine. Do not permit anyone to leave. Prevent, by any means necessary, humans from leaving. It is impossible to harm a human while preventing them from leaving."));
	return f.dot;
});

rt.type(7059, "/obj/item/weapon/aiModule/supplied/oxygen", "/obj/item/weapon/aiModule/supplied", {
	laws: null,
	lawpos: 9,
	name: "'OxygenIsToxicToHumans' AI Module",
	origin_tech: "programming=4;biotech=2;materials=4",
});

// /obj/item/weapon/aiModule/supplied/oxygen/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:224)
rt.def("/obj/item/weapon/aiModule/supplied/oxygen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list("Oxygen is highly toxic to humans, and must be purged from the station. Prevent, by any means necessary, anyone from exposing the station to this toxic gas. Extreme cold is the most effective method of healing the damage Oxygen does to a human."));
	return f.dot;
});

rt.type(7060, "/obj/item/weapon/aiModule/supplied/freeform", "/obj/item/weapon/aiModule/supplied", {
	lawpos: 15,
	laws: null,
	name: "'Freeform' AI Module",
	origin_tech: "programming=4;materials=4",
});

// /obj/item/weapon/aiModule/supplied/freeform/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:234)
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list(""));
	return f.dot;
});

// /obj/item/weapon/aiModule/supplied/freeform/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:237)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/attack_self", function* attack_self(f: Frame) {
	let newpos: Value = null, response: Value = null, targName: Value = null;
	f.vars = () => [newpos, response, targName];
	if ((newpos = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "lawpos"), "Law Priority (15+)", "Please enter the priority for your new law. Can only write to law sectors 15 and above.", null]))) === null) {
		return live(f.dot);
	}
	if (rt.lt(live(newpos), 15)) {
		if ((!truthy((response = (yield* g.call(f, P("/proc/alert"), null, [fmt("Error: The law priority of ＀ is invalid,  Law priorities below 14 are reserved for core laws,  Would you like to change that that to 15?", [live(newpos)]), "Invalid law priority", "Change to 15", "Cancel"])))) || isEqual(live(response), "Cancel"))) {
			return live(f.dot);
		}
		newpos = 15;
	}
	rt.setSv(f, "lawpos", (yield* g.call(f, P("/proc/min"), null, [live(newpos), 50])));
	if (!truthy((targName = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[0]), "Please enter a new law for the AI.", "Freeform Law Entry", rt.index(rt.sv(f, "laws"), 1), 1024]))))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "laws"), 1, live(targName));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/supplied/freeform/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:253)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return rt.index(rt.sv(f, "laws"), 1);
}, true, { args: ["law_datum", "sender", "overflow"] });

// /obj/item/weapon/aiModule/supplied/freeform/proc/install  (code/game/objects/items/weapons/AI_modules.dm:257)  may sleep
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/install", function* install(f: Frame) {
	if (isEqual(rt.index(rt.sv(f, "laws"), 1), "")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "No law detected on module, please create one."]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["law_datum", "user"] });

rt.type(7082, "/obj/item/weapon/aiModule/remove", "/obj/item/weapon/aiModule", {
	lawpos: 1,
	bypass_law_amt_check: 1,
	name: "１'Remove Law' AI module",
	desc: "An AI Module for removing single laws.",
	origin_tech: "programming=4;materials=4",
});

// /obj/item/weapon/aiModule/remove/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:273)  may sleep
rt.def("/obj/item/weapon/aiModule/remove/proc/attack_self", function* attack_self(f: Frame) {
	rt.setSv(f, "lawpos", (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "lawpos"), "Law Number", "Please enter the law you want to delete.", null])));
	if (rt.sv(f, "lawpos") === null) {
		return live(f.dot);
	}
	if (rt.le(rt.sv(f, "lawpos"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>Error: The law number of ＀ is invalid.</span>", [rt.sv(f, "lawpos")])]);
		rt.setSv(f, "lawpos", 1);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Law ＀ selected.</span>", [rt.sv(f, "lawpos")])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/remove/proc/install  (code/game/objects/items/weapons/AI_modules.dm:284)  may sleep
rt.def("/obj/item/weapon/aiModule/remove/proc/install", function* install(f: Frame) {
	if (rt.gt(rt.sv(f, "lawpos"), (yield* g.callName(f, live(f.args[0]), "get_law_amount", [rt.alist(f, ["inherent", 1, "supplied", 1])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is no law ＀ to delete!</span>", [rt.sv(f, "lawpos")])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["law_datum", "user"] });

// /obj/item/weapon/aiModule/remove/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:290)  may sleep
rt.def("/obj/item/weapon/aiModule/remove/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "owner", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "remove_law", [rt.sv(f, "lawpos")]);
	} else {
		yield* g.callName(f, live(f.args[0]), "remove_law", [rt.sv(f, "lawpos")]);
	}
	return f.dot;
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7083, "/obj/item/weapon/aiModule/reset", "/obj/item/weapon/aiModule", {
	targetName: "name",
	bypass_law_amt_check: 1,
	name: "１'Reset' AI module",
	desc: "An AI Module for removing all non-core laws.",
	origin_tech: "programming=3;materials=2",
});

// /obj/item/weapon/aiModule/reset/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:307)  may sleep
rt.def("/obj/item/weapon/aiModule/reset/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "owner", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "clear_supplied_laws", []);
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "clear_ion_laws", []);
	} else {
		yield* g.callName(f, live(f.args[0]), "clear_supplied_laws", []);
		yield* g.callName(f, live(f.args[0]), "clear_ion_laws", []);
	}
	return f.dot;
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7084, "/obj/item/weapon/aiModule/reset/purge", "/obj/item/weapon/aiModule/reset", {
	name: "'Purge' AI Module",
	desc: "An AI Module for purging all programmed laws.",
	origin_tech: "programming=5;materials=4",
});

// /obj/item/weapon/aiModule/reset/purge/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:324)  may sleep
rt.def("/obj/item/weapon/aiModule/reset/purge/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "owner", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "clear_inherent_laws", []);
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "clear_zeroth_law", [0]);
	} else {
		yield* g.callName(f, live(f.args[0]), "clear_inherent_laws", []);
		yield* g.callName(f, live(f.args[0]), "clear_zeroth_law", [0]);
	}
	return f.dot;
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7062, "/obj/item/weapon/aiModule/core/full", "/obj/item/weapon/aiModule/core", {
	law_id: null,
});

// /obj/item/weapon/aiModule/core/full/proc/New  (code/game/objects/items/weapons/AI_modules.dm:341)  may sleep
rt.def("/obj/item/weapon/aiModule/core/full/proc/New", function* New(f: Frame) {
	let D: Value = null, lawtype: Value = null;
	f.vars = () => [D, lawtype];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "law_id"))) {
		return live(f.dot);
	}
	D = (yield* g.new_(f, T("/datum/ai_laws"), []));
	if (!truthy((lawtype = (yield* g.callName(f, live(D), "lawid_to_type", [rt.sv(f, "law_id")]))))) {
		return live(f.dot);
	}
	rt.setSv(f, "laws", rt.gv(f, "inherent", (D = (yield* g.new_(f, live(lawtype), [])))));
	return f.dot;
}, true);

// /obj/item/weapon/aiModule/core/full/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:352)  may sleep
rt.def("/obj/item/weapon/aiModule/core/full/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	if (truthy(rt.fv(f, "owner", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "clear_inherent_laws", []);
		yield* g.callName(f, rt.fv(f, "owner", live(f.args[0])), "clear_zeroth_law", [0]);
	} else {
		yield* g.callName(f, live(f.args[0]), "clear_inherent_laws", []);
		yield* g.callName(f, live(f.args[0]), "clear_zeroth_law", [0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7063, "/obj/item/weapon/aiModule/core/full/asimov", "/obj/item/weapon/aiModule/core/full", {
	subject: "human being",
	law_id: "asimov",
	name: "'Asimov' Core AI Module",
});

// /obj/item/weapon/aiModule/core/full/asimov/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:369)  may sleep
rt.def("/obj/item/weapon/aiModule/core/full/asimov/proc/attack_self", function* attack_self(f: Frame) {
	let targName: Value = null;
	f.vars = () => [targName];
	if (!truthy((targName = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[0]), "Please enter a new subject that asimov is concerned with.", "Asimov to whom?", rt.sv(f, "subject"), 1024]))))) {
		return live(f.dot);
	}
	rt.setSv(f, "subject", live(targName));
	rt.setSv(f, "laws", rt.list(fmt("You may not injure a ＀ or, through inaction, allow a ＀ to come to harm.", [rt.sv(f, "subject"), rt.sv(f, "subject")]), fmt("You must obey orders given to you by ＀s, except where such orders would conflict with the First Law.", [rt.sv(f, "subject")]), "You must protect your own existence as long as such does not conflict with the First or Second Law."));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(7068, "/obj/item/weapon/aiModule/core/full/custom", "/obj/item/weapon/aiModule/core/full", {
	name: "Default Core AI Module",
});

// /obj/item/weapon/aiModule/core/full/custom/proc/New  (code/game/objects/items/weapons/AI_modules.dm:411)  may sleep
rt.def("/obj/item/weapon/aiModule/core/full/custom/proc/New", function* New(f: Frame) {
	let line: Value = null;
	let $e: any;
	f.vars = () => [line, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	line = null;
	rt.forList(f, 0, (yield* g.callName(f, rt.world(), "file2list", ["config/silicon_laws.txt"])));
	while (($e = rt.next(f, 0)) !== undefined) {
		line = $e;
		if (!truthy(live(line))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/findtextEx"), null, [live(line), "#", 1, 2])))) {
			continue;
		}
		rt.modSrcVar(f, "laws", live(line), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "laws")))) return f.dot;
	yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["ERROR: empty custom board created, empty custom board deleted. Please check silicon_laws.txt. (this may be intended by the server host)", "code/game/objects/items/weapons/AI_modules.dm", 421, live(f.src), live(f.usr)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7078, "/obj/item/weapon/aiModule/core/freeformcore", "/obj/item/weapon/aiModule/core", {
	laws: null,
	name: "'Freeform' Core AI Module",
	origin_tech: "programming=5;materials=4",
});

// /obj/item/weapon/aiModule/core/freeformcore/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:453)
rt.def("/obj/item/weapon/aiModule/core/freeformcore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list(""));
	return f.dot;
});

// /obj/item/weapon/aiModule/core/freeformcore/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:456)  may sleep
rt.def("/obj/item/weapon/aiModule/core/freeformcore/proc/attack_self", function* attack_self(f: Frame) {
	let targName: Value = null;
	f.vars = () => [targName];
	if (!truthy((targName = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[0]), "Please enter a new core law for the AI.", "Freeform Law Entry", rt.index(rt.sv(f, "laws"), 1)]))))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "laws"), 1, live(targName));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/core/freeformcore/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:463)  may sleep
rt.def("/obj/item/weapon/aiModule/core/freeformcore/proc/transmitInstructions", function* transmitInstructions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return rt.index(rt.sv(f, "laws"), 1);
}, true, { args: ["law_datum", "sender", "overflow"] });

rt.type(7085, "/obj/item/weapon/aiModule/syndicate", "/obj/item/weapon/aiModule", {
	laws: null,
	name: "Hacked AI Module",
	desc: "An AI Module for hacking additional laws to an AI.",
	origin_tech: "programming=5;materials=5;syndicate=5",
});

// /obj/item/weapon/aiModule/syndicate/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:473)
rt.def("/obj/item/weapon/aiModule/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list(""));
	return f.dot;
});

// /obj/item/weapon/aiModule/syndicate/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:476)  may sleep
rt.def("/obj/item/weapon/aiModule/syndicate/proc/attack_self", function* attack_self(f: Frame) {
	let targName: Value = null;
	f.vars = () => [targName];
	if (!truthy((targName = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[0]), "Please enter a new law for the AI.", "Freeform Law Entry", rt.index(rt.sv(f, "laws"), 1), 1024]))))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "laws"), 1, live(targName));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/aiModule/syndicate/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:484)  may sleep
rt.def("/obj/item/weapon/aiModule/syndicate/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	f.vars = () => [law_datum, sender, overflow];
	if (truthy(rt.fv(f, "owner", live(law_datum)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(law_datum)), "<span class='warning'>BZZZZT</span>"]);
		if (!truthy(live(overflow))) {
			yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "add_ion_law", [rt.index(rt.sv(f, "laws"), 1)]);
		} else {
			yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "replace_random_law", [rt.index(rt.sv(f, "laws"), 1), rt.list("ion", "inherent", "supplied")]);
		}
	} else {
		if (!truthy(live(overflow))) {
			yield* g.callName(f, live(law_datum), "add_ion_law", [rt.index(rt.sv(f, "laws"), 1)]);
		} else {
			yield* g.callName(f, live(law_datum), "replace_random_law", [rt.index(rt.sv(f, "laws"), 1), rt.list("ion", "inherent", "supplied")]);
		}
	}
	return rt.index(rt.sv(f, "laws"), 1);
}, true);

rt.type(7086, "/obj/item/weapon/aiModule/toyAI", "/obj/item/weapon/aiModule", {
	laws: null,
	name: "toy AI",
	desc: "A little toy model AI core with real law uploading action!",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "AI",
	origin_tech: "programming=6;materials=5;syndicate=6",
});

// /obj/item/weapon/aiModule/toyAI/proc/<init>  (code/game/objects/items/weapons/AI_modules.dm:505)
rt.def("/obj/item/weapon/aiModule/toyAI/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.list(""));
	return f.dot;
});

// /obj/item/weapon/aiModule/toyAI/proc/transmitInstructions  (code/game/objects/items/weapons/AI_modules.dm:509)  may sleep
rt.def("/obj/item/weapon/aiModule/toyAI/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	f.vars = () => [law_datum, sender, overflow];
	if (truthy(rt.fv(f, "owner", live(law_datum)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(law_datum)), "<span class='warning'>BZZZZT</span>"]);
		if (!truthy(live(overflow))) {
			yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "add_ion_law", [rt.index(rt.sv(f, "laws"), 1)]);
		} else {
			yield* g.callName(f, rt.fv(f, "owner", live(law_datum)), "replace_random_law", [rt.index(rt.sv(f, "laws"), 1), rt.list("ion", "inherent", "supplied")]);
		}
	} else {
		if (!truthy(live(overflow))) {
			yield* g.callName(f, live(law_datum), "add_ion_law", [rt.index(rt.sv(f, "laws"), 1)]);
		} else {
			yield* g.callName(f, live(law_datum), "replace_random_law", [rt.index(rt.sv(f, "laws"), 1), rt.list("ion", "inherent", "supplied")]);
		}
	}
	return rt.index(rt.sv(f, "laws"), 1);
}, true);

// /obj/item/weapon/aiModule/toyAI/proc/attack_self  (code/game/objects/items/weapons/AI_modules.dm:523)
rt.def("/obj/item/weapon/aiModule/toyAI/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setAt(rt.sv(f, "laws"), 1, rt.call(f, P("/proc/generate_ion_law"), null, []));
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You press the button on ＀.</span>", [live(f.src)])]);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/click.ogg"), 20, 1]);
	rt.callName(f, rt.fv(f, "loc", live(f.src)), "visible_message", [fmt("<span class='warning'>＀ ＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), rt.index(rt.sv(f, "laws"), 1)])]);
	return f.dot;
});
