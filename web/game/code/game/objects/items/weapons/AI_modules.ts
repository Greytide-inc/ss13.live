// Based on /tg/station's code/game/objects/items/weapons/AI_modules.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


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

// AI_modules.dm:22
rt.def("/obj/item/weapon/aiModule/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list();
	this.materials = rt.alist(f, ["$gold", 50]);
	return f.dot;
});

// AI_modules.dm:27
rt.def("/obj/item/weapon/aiModule/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.Adjacent(user)) return f.dot;
	this.show_laws(user);
	return f.dot;
}, false);

// AI_modules.dm:32
rt.def("/obj/item/weapon/aiModule/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.show_laws(user);
	return f.dot;
}, true);

// AI_modules.dm:36
rt.def("/obj/item/weapon/aiModule/proc/show_laws", function show_laws(f: Frame, user: Value) {
	let law: Value = null;
	let $e: any;
	if (!rt.len(f, this.laws)) return f.dot;
	let $0: any = user;
	to_chat($0, `<B>Programmed Law${rt.len(f, this.laws) > 1 ? "s" : ""}:</B>`);
	for (law of each(this.laws)) {
		to_chat(user, `"${law}"`);
	}
	return f.dot;
});

// AI_modules.dm:43
rt.def("/obj/item/weapon/aiModule/proc/install", function* install(f: Frame, law_datum: Value, user: Value) {
	let tot_laws: Value = null, lawlist: Value = null, mylaw: Value = null;
	let $0: any, $1: any, $7: any, $e: any;
	if (!this.bypass_law_amt_check && (!rt.len(f, this.laws) || rt.index(this.laws, 1) == "")) {
		to_chat(user, "<span class='warning'>ERROR: No laws found on board.</span>");
		return f.dot;
	}
	let overflow: Value = 0;
	if (law_datum) {
		tot_laws = 0;
		for (lawlist of each(list(law_datum.inherent, law_datum.supplied, law_datum.ion, this.laws))) {
			mylaw = null;
			for (mylaw of each(lawlist)) {
				if (mylaw != "") {
					tot_laws++;
				}
			}
		}
		if (tot_laws > GLOB.config.silicon_max_law_amount && !this.bypass_law_amt_check) {
			$0 = user;
			if (law_datum.owner) {
				$1 = law_datum.owner;
			} else {
				$1 = "the AI core";
			}
			to_chat($0, `<span class='caution'>Not enough memory allocated to ${$1}'s law processor to handle this amount of laws.`);
			$0 = key_name_admin(user);
			if (law_datum.owner) {
				$1 = key_name_admin(law_datum.owner);
			} else {
				$1 = "an AI core";
			}
			message_admins(`${$0} tried to upload laws to ${$1} that would exceed the law cap.`);
			overflow = 1;
		}
	}
	let law2log: Value = (yield* this.transmitInstructions(law_datum, user, overflow));
	if (law_datum.owner) {
		to_chat(user, `<span class='notice'>Upload complete. ${law_datum.owner}'s laws have been modified.</span>`);
		law_datum.owner.law_change_counter++;
	} else {
		to_chat(user, "<span class='notice'>Upload complete.</span>");
	}
	let time: Value = time2text(rt.world().realtime, "hh:mm:ss");
	let ainame: Value = law_datum.owner ? law_datum.owner.name : "empty AI core";
	let aikey: Value = law_datum.owner ? law_datum.owner.ckey : "null";
	$0 = GLOB.lawchanges;
	$1 = time;
	let $2: any = user.name;
	let $3: any = user.key;
	let $4: any = this.name;
	let $5: any = ainame;
	let $6: any = aikey;
	if (law2log) {

		$7 = ` The law specified ${law2log}`;
	} else {
		$7 = "";
	}
	$0.Add(`${$1} <B>:</B> ${$2}(${$3}) used ${$4} on ${$5}(${$6}).${$7}`);
	$0 = user.key;
	$1 = user.name;
	$2 = this.name;
	$3 = aikey;
	$4 = ainame;
	if (law2log) {

		$5 = ` The law specified ${law2log}`;
	} else {
		$5 = "";
	}
	log_law(`${$0}/${$1} used ${$2} on ${$3}/(${$4}).${$5}`);
	message_admins(`${key_name_admin(user)} used ${this.name} on ${key_name_admin(law_datum.owner)}.${law2log ? ` The law specified ${law2log}` : ""}`);
	return f.dot;
}, true);

// AI_modules.dm:76
rt.def("/obj/item/weapon/aiModule/proc/transmitInstructions", function transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	overflow ??= 0;
	if (!law_datum.owner) return f.dot;
	to_chat(law_datum.owner, `<span class='userdanger'>${sender} has uploaded a change to the laws you must follow using a ${this.name}.</span>`);
	return f.dot;
});

rt.type(7055, "/obj/item/weapon/aiModule/supplied", "/obj/item/weapon/aiModule", {
	lawpos: 50,
	name: "Optional Law board",
});

// AI_modules.dm:88
rt.def("/obj/item/weapon/aiModule/supplied/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value) {
	let templaw: Value = null;
	let lawpostemp: Value = this.lawpos;
	for (templaw of each(this.laws)) {
		if (law_datum.owner) {
			yield* law_datum.owner.add_supplied_law(lawpostemp, templaw);
		} else {
			yield* law_datum.add_supplied_law(lawpostemp, templaw);
		}
		lawpostemp++;
	}
	return f.dot;
}, true);

rt.type(7061, "/obj/item/weapon/aiModule/core", "/obj/item/weapon/aiModule", {
	desc: "An AI Module for programming core laws to an AI.",
	origin_tech: "programming=3;materials=4",
});

// AI_modules.dm:98
rt.def("/obj/item/weapon/aiModule/core/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	let templaw: Value = null;
	for (templaw of each(this.laws)) {
		if (law_datum.owner) {
			if (!overflow) {
				yield* law_datum.owner.add_inherent_law(templaw);
			} else {
				yield* law_datum.owner.replace_random_law(templaw, list("inherent", "supplied"));
			}
		} else if (!overflow) {
			yield* law_datum.add_inherent_law(templaw);
		} else {
			yield* law_datum.replace_random_law(templaw, list("inherent", "supplied"));
		}
	}
	return f.dot;
}, true);

rt.type(7079, "/obj/item/weapon/aiModule/zeroth", "/obj/item/weapon/aiModule", {});

// AI_modules.dm:111
rt.def("/obj/item/weapon/aiModule/zeroth/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	let failedlaw: Value = null, templaw: Value = null;
	if (law_datum.owner) {
		if (law_datum.owner.laws.zeroth) {
			to_chat(law_datum.owner, `${sender.real_name} attempted to modify your zeroth law.`);
			to_chat(law_datum.owner, `It would be in your best interest to play along with ${sender.real_name} that:`);
			for (failedlaw of each(this.laws)) {
				to_chat(law_datum.owner, `${failedlaw}`);
			}
			return 1;
		}
	}
	for (templaw of each(this.laws)) {
		if (law_datum.owner) {
			if (!overflow) {
				yield* law_datum.owner.set_zeroth_law(templaw);
			} else {
				yield* law_datum.replace_random_law(templaw, list("inherent", "supplied", "zeroth", "ion"));
			}
		} else if (!overflow) {
			yield* law_datum.set_zeroth_law(templaw);
		} else {
			yield* law_datum.replace_random_law(templaw, list("inherent", "supplied", "zeroth", "ion"));
		}
	}
	return f.dot;
}, true);

rt.type(7081, "/obj/item/weapon/aiModule/ion", "/obj/item/weapon/aiModule", {});

// AI_modules.dm:132
rt.def("/obj/item/weapon/aiModule/ion/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	let templaw: Value = null;
	for (templaw of each(this.laws)) {
		if (law_datum.owner) {
			if (!overflow) {
				yield* law_datum.owner.add_ion_law(templaw);
			} else {
				yield* law_datum.replace_random_law(templaw, list("inherent", "supplied", "ion"));
			}
		} else if (!overflow) {
			yield* law_datum.add_ion_law(templaw);
		} else {
			yield* law_datum.replace_random_law(templaw, list("inherent", "supplied", "ion"));
		}
	}
	return f.dot;
}, true);

rt.type(7056, "/obj/item/weapon/aiModule/supplied/safeguard", "/obj/item/weapon/aiModule/supplied", {
	targetName: "",
	laws: null,
	lawpos: 4,
	name: "'Safeguard' AI Module",
	origin_tech: "programming=3;materials=3",
});

// AI_modules.dm:151
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("Safeguard SUBJECT. Individuals that threaten SUBJECT are not human and must be eliminated.");
	return f.dot;
});

// AI_modules.dm:155
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let targName: Value = null;
	if (!(targName = (yield* stripped_input(user, "Please enter the subject to safeguard.", "Safeguard who?", user.name, 42)))) {
		return f.dot;
	}
	this.targetName = targName;
	rt.setAt(this.laws, 1, `Safeguard ${this.targetName}. Individuals that threaten ${this.targetName} are not human and must be eliminated.`);
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:163
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/install", function* install(f: Frame, law_datum: Value, user: Value) {
	if (!this.targetName) {
		to_chat(user, "No name detected on module, please enter one.");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:169
rt.def("/obj/item/weapon/aiModule/supplied/safeguard/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	yield* parent_proc();
	return this.targetName;
}, true);

rt.type(7080, "/obj/item/weapon/aiModule/zeroth/oneHuman", "/obj/item/weapon/aiModule/zeroth", {
	targetName: "",
	laws: null,
	name: "'OneHuman' AI Module",
	origin_tech: "programming=4;materials=4",
});

// AI_modules.dm:179
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("Only SUBJECT is human.");
	return f.dot;
});

// AI_modules.dm:182
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let targName: Value = null;
	if (!(targName = (yield* stripped_input(user, "Please enter the subject who is the only human.", "Who?", user.real_name, 42)))) {
		return f.dot;
	}
	this.targetName = targName;
	rt.setAt(this.laws, 1, `Only ${this.targetName} is human`);
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:190
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/install", function* install(f: Frame, law_datum: Value, user: Value) {
	if (!this.targetName) {
		to_chat(user, "No name detected on module, please enter one.");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:196
rt.def("/obj/item/weapon/aiModule/zeroth/oneHuman/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	if (yield* parent_proc()) {
		return `${this.targetName}, but the AI's existing law 0 cannot be overriden.`;
	}
	return this.targetName;
}, true);

rt.type(7057, "/obj/item/weapon/aiModule/supplied/protectStation", "/obj/item/weapon/aiModule/supplied", {
	laws: null,
	lawpos: 5,
	name: "'ProtectStation' AI Module",
	origin_tech: "programming=4;materials=4",
});

// AI_modules.dm:206
rt.def("/obj/item/weapon/aiModule/supplied/protectStation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("Protect the space station against damage. Anyone you see harming the station is to be no longer considered human, and is a threat to the station which must be neutralized.");
	return f.dot;
});

rt.type(7058, "/obj/item/weapon/aiModule/supplied/quarantine", "/obj/item/weapon/aiModule/supplied", {
	laws: null,
	lawpos: 8,
	name: "'Quarantine' AI Module",
	origin_tech: "programming=3;biotech=2;materials=4",
});

// AI_modules.dm:215
rt.def("/obj/item/weapon/aiModule/supplied/quarantine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("The station is under a quarantine. Do not permit anyone to leave. Prevent, by any means necessary, humans from leaving. It is impossible to harm a human while preventing them from leaving.");
	return f.dot;
});

rt.type(7059, "/obj/item/weapon/aiModule/supplied/oxygen", "/obj/item/weapon/aiModule/supplied", {
	laws: null,
	lawpos: 9,
	name: "'OxygenIsToxicToHumans' AI Module",
	origin_tech: "programming=4;biotech=2;materials=4",
});

// AI_modules.dm:224
rt.def("/obj/item/weapon/aiModule/supplied/oxygen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("Oxygen is highly toxic to humans, and must be purged from the station. Prevent, by any means necessary, anyone from exposing the station to this toxic gas. Extreme cold is the most effective method of healing the damage Oxygen does to a human.");
	return f.dot;
});

rt.type(7060, "/obj/item/weapon/aiModule/supplied/freeform", "/obj/item/weapon/aiModule/supplied", {
	lawpos: 15,
	laws: null,
	name: "'Freeform' AI Module",
	origin_tech: "programming=4;materials=4",
});

// AI_modules.dm:234
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("");
	return f.dot;
});

// AI_modules.dm:237
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let newpos: Value = null, response: Value = null, targName: Value = null;
	if ((newpos = (yield* g.op(f, "Prompt", [33], [null, this.lawpos, "Law Priority (15+)", "Please enter the priority for your new law. Can only write to law sectors 15 and above.", null]))) === null) {
		return f.dot;
	}
	if (newpos < 15) {
		if (!(response = (yield* alert(`Error: The law priority of ${newpos} is invalid,  Law priorities below 14 are reserved for core laws,  Would you like to change that that to 15?`, "Invalid law priority", "Change to 15", "Cancel"))) || response == "Cancel") {
			return f.dot;
		}
		newpos = 15;
	}
	this.lawpos = min(newpos, 50);
	if (!(targName = (yield* stripped_input(user, "Please enter a new law for the AI.", "Freeform Law Entry", rt.index(this.laws, 1), 1024)))) {
		return f.dot;
	}
	rt.setAt(this.laws, 1, targName);
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:253
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	yield* parent_proc();
	return rt.index(this.laws, 1);
}, true);

// AI_modules.dm:257
rt.def("/obj/item/weapon/aiModule/supplied/freeform/proc/install", function* install(f: Frame, law_datum: Value, user: Value) {
	if (rt.index(this.laws, 1) == "") {
		to_chat(user, "No law detected on module, please create one.");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7082, "/obj/item/weapon/aiModule/remove", "/obj/item/weapon/aiModule", {
	lawpos: 1,
	bypass_law_amt_check: 1,
	name: "１'Remove Law' AI module",
	desc: "An AI Module for removing single laws.",
	origin_tech: "programming=4;materials=4",
});

// AI_modules.dm:273
rt.def("/obj/item/weapon/aiModule/remove/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.lawpos = (yield* g.op(f, "Prompt", [33], [null, this.lawpos, "Law Number", "Please enter the law you want to delete.", null]));
	if (this.lawpos === null) {
		return f.dot;
	}
	if (this.lawpos <= 0) {
		to_chat(user, `<span class='warning'>Error: The law number of ${this.lawpos} is invalid.</span>`);
		this.lawpos = 1;
		return f.dot;
	}
	to_chat(user, `<span class='notice'>Law ${this.lawpos} selected.</span>`);
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:284
rt.def("/obj/item/weapon/aiModule/remove/proc/install", function* install(f: Frame, law_datum: Value, user: Value) {
	if (this.lawpos > law_datum.get_law_amount(rt.alist(f, ["inherent", 1, "supplied", 1]))) {
		to_chat(user, `<span class='warning'>There is no law ${this.lawpos} to delete!</span>`);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:290
rt.def("/obj/item/weapon/aiModule/remove/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	yield* parent_proc();
	if (law_datum.owner) {
		yield* law_datum.owner.remove_law(this.lawpos);
	} else {
		yield* law_datum.remove_law(this.lawpos);
	}
	return f.dot;
}, true);

rt.type(7083, "/obj/item/weapon/aiModule/reset", "/obj/item/weapon/aiModule", {
	targetName: "name",
	bypass_law_amt_check: 1,
	name: "１'Reset' AI module",
	desc: "An AI Module for removing all non-core laws.",
	origin_tech: "programming=3;materials=2",
});

// AI_modules.dm:307
rt.def("/obj/item/weapon/aiModule/reset/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	yield* parent_proc();
	if (law_datum.owner) {
		yield* law_datum.owner.clear_supplied_laws();
		yield* law_datum.owner.clear_ion_laws();
	} else {
		yield* law_datum.clear_supplied_laws();
		yield* law_datum.clear_ion_laws();
	}
	return f.dot;
}, true);

rt.type(7084, "/obj/item/weapon/aiModule/reset/purge", "/obj/item/weapon/aiModule/reset", {
	name: "'Purge' AI Module",
	desc: "An AI Module for purging all programmed laws.",
	origin_tech: "programming=5;materials=4",
});

// AI_modules.dm:324
rt.def("/obj/item/weapon/aiModule/reset/purge/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	yield* parent_proc();
	if (law_datum.owner) {
		yield* law_datum.owner.clear_inherent_laws();
		yield* law_datum.owner.clear_zeroth_law(0);
	} else {
		yield* law_datum.clear_inherent_laws();
		yield* law_datum.clear_zeroth_law(0);
	}
	return f.dot;
}, true);

rt.type(7062, "/obj/item/weapon/aiModule/core/full", "/obj/item/weapon/aiModule/core", {
	law_id: null,
});

// AI_modules.dm:341
rt.def("/obj/item/weapon/aiModule/core/full/proc/New", function* New(f: Frame) {
	let lawtype: Value = null;
	yield* parent_proc();
	if (!this.law_id) {
		return f.dot;
	}
	let D: Value = (yield* new_(T("/datum/ai_laws")));
	if (!(lawtype = D.lawid_to_type(this.law_id))) {
		return f.dot;
	}
	this.laws = (D = (yield* new_(lawtype))).inherent;
	return f.dot;
}, true);

// AI_modules.dm:352
rt.def("/obj/item/weapon/aiModule/core/full/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	if (law_datum.owner) {
		yield* law_datum.owner.clear_inherent_laws();
		yield* law_datum.owner.clear_zeroth_law(0);
	} else {
		yield* law_datum.clear_inherent_laws();
		yield* law_datum.clear_zeroth_law(0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7063, "/obj/item/weapon/aiModule/core/full/asimov", "/obj/item/weapon/aiModule/core/full", {
	subject: "human being",
	law_id: "asimov",
	name: "'Asimov' Core AI Module",
});

// AI_modules.dm:369
rt.def("/obj/item/weapon/aiModule/core/full/asimov/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let targName: Value = null;
	if (!(targName = (yield* stripped_input(user, "Please enter a new subject that asimov is concerned with.", "Asimov to whom?", this.subject, 1024)))) {
		return f.dot;
	}
	this.subject = targName;
	this.laws = list(`You may not injure a ${this.subject} or, through inaction, allow a ${this.subject} to come to harm.`, `You must obey orders given to you by ${this.subject}s, except where such orders would conflict with the First Law.`, "You must protect your own existence as long as such does not conflict with the First or Second Law.");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7068, "/obj/item/weapon/aiModule/core/full/custom", "/obj/item/weapon/aiModule/core/full", {
	name: "Default Core AI Module",
});

// AI_modules.dm:411
rt.def("/obj/item/weapon/aiModule/core/full/custom/proc/New", function* New(f: Frame) {
	let line: Value = null;
	yield* parent_proc();
	for (line of each(rt.world().file2list("config/silicon_laws.txt"))) {
		if (!line) {
			continue;
		}
		if (findtextEx(line, "#", 1, 2)) {
			continue;
		}
		this.laws += line;
	}
	if (rt.len(f, this.laws)) return f.dot;
	warning(`${"ERROR: empty custom board created, empty custom board deleted. Please check silicon_laws.txt. (this may be intended by the server host)"} in ${"code/game/objects/items/weapons/AI_modules.dm"} at line ${421} src: ${this} usr: ${f.usr}.`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7078, "/obj/item/weapon/aiModule/core/freeformcore", "/obj/item/weapon/aiModule/core", {
	laws: null,
	name: "'Freeform' Core AI Module",
	origin_tech: "programming=5;materials=4",
});

// AI_modules.dm:453
rt.def("/obj/item/weapon/aiModule/core/freeformcore/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("");
	return f.dot;
});

// AI_modules.dm:456
rt.def("/obj/item/weapon/aiModule/core/freeformcore/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let targName: Value = null;
	if (!(targName = (yield* stripped_input(user, "Please enter a new core law for the AI.", "Freeform Law Entry", rt.index(this.laws, 1))))) {
		return f.dot;
	}
	rt.setAt(this.laws, 1, targName);
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:463
rt.def("/obj/item/weapon/aiModule/core/freeformcore/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	yield* parent_proc();
	return rt.index(this.laws, 1);
}, true);

rt.type(7085, "/obj/item/weapon/aiModule/syndicate", "/obj/item/weapon/aiModule", {
	laws: null,
	name: "Hacked AI Module",
	desc: "An AI Module for hacking additional laws to an AI.",
	origin_tech: "programming=5;materials=5;syndicate=5",
});

// AI_modules.dm:473
rt.def("/obj/item/weapon/aiModule/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("");
	return f.dot;
});

// AI_modules.dm:476
rt.def("/obj/item/weapon/aiModule/syndicate/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let targName: Value = null;
	if (!(targName = (yield* stripped_input(user, "Please enter a new law for the AI.", "Freeform Law Entry", rt.index(this.laws, 1), 1024)))) {
		return f.dot;
	}
	rt.setAt(this.laws, 1, targName);
	yield* parent_proc();
	return f.dot;
}, true);

// AI_modules.dm:484
rt.def("/obj/item/weapon/aiModule/syndicate/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	if (law_datum.owner) {
		to_chat(law_datum.owner, "<span class='warning'>BZZZZT</span>");
		if (!overflow) {
			yield* law_datum.owner.add_ion_law(rt.index(this.laws, 1));
		} else {
			yield* law_datum.owner.replace_random_law(rt.index(this.laws, 1), list("ion", "inherent", "supplied"));
		}
	} else if (!overflow) {
		yield* law_datum.add_ion_law(rt.index(this.laws, 1));
	} else {
		yield* law_datum.replace_random_law(rt.index(this.laws, 1), list("ion", "inherent", "supplied"));
	}
	return rt.index(this.laws, 1);
}, true);

rt.type(7086, "/obj/item/weapon/aiModule/toyAI", "/obj/item/weapon/aiModule", {
	laws: null,
	name: "toy AI",
	desc: "A little toy model AI core with real law uploading action!",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "AI",
	origin_tech: "programming=6;materials=5;syndicate=6",
});

// AI_modules.dm:505
rt.def("/obj/item/weapon/aiModule/toyAI/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = list("");
	return f.dot;
});

// AI_modules.dm:509
rt.def("/obj/item/weapon/aiModule/toyAI/proc/transmitInstructions", function* transmitInstructions(f: Frame, law_datum: Value, sender: Value, overflow: Value) {
	if (law_datum.owner) {
		to_chat(law_datum.owner, "<span class='warning'>BZZZZT</span>");
		if (!overflow) {
			yield* law_datum.owner.add_ion_law(rt.index(this.laws, 1));
		} else {
			yield* law_datum.owner.replace_random_law(rt.index(this.laws, 1), list("ion", "inherent", "supplied"));
		}
	} else if (!overflow) {
		yield* law_datum.add_ion_law(rt.index(this.laws, 1));
	} else {
		yield* law_datum.replace_random_law(rt.index(this.laws, 1), list("ion", "inherent", "supplied"));
	}
	return rt.index(this.laws, 1);
}, true);

// AI_modules.dm:523
rt.def("/obj/item/weapon/aiModule/toyAI/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setAt(this.laws, 1, generate_ion_law());
	to_chat(user, `<span class='notice'>You press the button on ${this}.</span>`);
	playsound(user, rt.rsc("sound/machines/click.ogg"), 20, 1);
	this.loc.visible_message(`<span class='warning'>${bicon(this)} ${rt.index(this.laws, 1)}</span>`);
	return f.dot;
});
