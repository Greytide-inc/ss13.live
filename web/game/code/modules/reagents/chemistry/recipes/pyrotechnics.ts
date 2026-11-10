// Based on /tg/station's code/modules/reagents/chemistry/recipes/pyrotechnics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(2561, "/datum/chemical_reaction/reagent_explosion", "/datum/chemical_reaction", {
	strengthdiv: 10,
	modifier: 0,
	name: "Generic explosive",
	id: "reagent_explosion",
});

// pyrotechnics.dm:8
rt.def("/datum/chemical_reaction/reagent_explosion/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let inside_msg: Value = null, M: Value = null, toucher: Value = null, e: Value = null;
	let $1: any;
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	let A: Value = get_area(_T);
	if (ismob(holder.my_atom)) {
		inside_msg = ` inside ${key_name_admin((M = holder.my_atom))}`;
	}
	let lastkey: Value = holder.my_atom.fingerprintslast;
	let touch_msg: Value = "N/A";
	if (lastkey) {
		touch_msg = `${`${key_name_admin((toucher = get_mob_by_key(lastkey)))}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [toucher])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [toucher])}`}`;
	}
	let $0: any = A;
	if (_T) {
		$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`Reagent explosion reaction occurred at ${$0} ${`${$1}`}${inside_msg}. Last Fingerprint: ${touch_msg}.`);
	log_game(`Reagent explosion reaction occurred at ${A} ${`(${_T.x},${_T.y},${_T.z})`}. Last Fingerprint: ${lastkey ? lastkey : "N/A"}.`);
	yield* (e = (yield* new_(T("/datum/effect_system/reagents_explosion")))).set_up(this.modifier + round(created_volume / this.strengthdiv, 1), _T, 0, 0);
	yield* e.start();
	yield* holder.clear_reagents();
	return f.dot;
}, true);

rt.type(2562, "/datum/chemical_reaction/reagent_explosion/nitroglycerin", "/datum/chemical_reaction/reagent_explosion", {
	name: "Nitroglycerin",
	id: "nitroglycerin",
	strengthdiv: 2,
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:30
rt.def("/datum/chemical_reaction/reagent_explosion/nitroglycerin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["nitroglycerin", 2]);
	this.required_reagents = rt.alist(f, ["glycerol", 1, "facid", 1, "sacid", 1]);
	return f.dot;
});

// pyrotechnics.dm:35
rt.def("/datum/chemical_reaction/reagent_explosion/nitroglycerin/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	yield* holder.remove_reagent("nitroglycerin", created_volume * 2);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2563, "/datum/chemical_reaction/reagent_explosion/nitroglycerin_explosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Nitroglycerin explosion",
	id: "nitroglycerin_explosion",
	required_temp: 474,
	strengthdiv: 2,
	required_reagents: null,
});

// pyrotechnics.dm:43
rt.def("/datum/chemical_reaction/reagent_explosion/nitroglycerin_explosion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["nitroglycerin", 1]);
	return f.dot;
});

rt.type(2564, "/datum/chemical_reaction/reagent_explosion/potassium_explosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Explosion",
	id: "potassium_explosion",
	strengthdiv: 10,
	required_reagents: null,
});

// pyrotechnics.dm:51
rt.def("/datum/chemical_reaction/reagent_explosion/potassium_explosion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 1, "potassium", 1]);
	return f.dot;
});

rt.type(2565, "/datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom", "/datum/chemical_reaction/reagent_explosion/potassium_explosion", {
	name: "Holy Explosion",
	id: "holyboom",
	required_reagents: null,
});

// pyrotechnics.dm:57
rt.def("/datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["holywater", 1, "potassium", 1]);
	return f.dot;
});

// pyrotechnics.dm:60
rt.def("/datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let R: Value = null, deity: Value = null, C: Value = null;
	if (created_volume >= 150) {
		playsound(rt.getStep(f, holder.my_atom, 0), rt.rsc("sound/effects/pray.ogg"), 80, 0, round(created_volume / 48));
		this.strengthdiv = 8;
		for (R of each(get_hearers_in_view(7, rt.getStep(f, holder.my_atom, 0)), T("/mob/living/simple_animal/revenant"))) {
			deity = null;
			if (GLOB.SSreligion.deity) {
				deity = GLOB.SSreligion.deity;
			} else {
				deity = "Christ";
			}
			to_chat(R, `<span class='userdanger'>The power of ${deity} compels you!</span>`);
			R.stun(20);
			R.reveal(100);
			yield* R.adjustHealth(50);
		}
		yield* sleep(20);
		for (C of each(get_hearers_in_view(round(created_volume / 48, 1), rt.getStep(f, holder.my_atom, 0)), T("/mob/living/carbon"))) {
			if (iscultist(C)) {
				to_chat(C, "<span class='userdanger'>The divine explosion sears you!</span>");
				yield* C.Knockdown(40);
				yield* C.adjust_fire_stacks(5);
				yield* C.IgniteMob();
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2572, "/datum/chemical_reaction/blackpowder", "/datum/chemical_reaction", {
	name: "Black Powder",
	id: "blackpowder",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:86
rt.def("/datum/chemical_reaction/blackpowder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["blackpowder", 3]);
	this.required_reagents = rt.alist(f, ["saltpetre", 1, "charcoal", 1, "sulfur", 1]);
	return f.dot;
});

rt.type(2566, "/datum/chemical_reaction/reagent_explosion/blackpowder_explosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Black Powder Kaboom",
	id: "blackpowder_explosion",
	required_temp: 474,
	strengthdiv: 6,
	modifier: 1,
	mix_message: "<span class='boldannounce'>Sparks start flying around the black powder!</span>",
	required_reagents: null,
});

// pyrotechnics.dm:92
rt.def("/datum/chemical_reaction/reagent_explosion/blackpowder_explosion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blackpowder", 1]);
	return f.dot;
});

// pyrotechnics.dm:99
rt.def("/datum/chemical_reaction/reagent_explosion/blackpowder_explosion/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	yield* sleep(rand(50, 100));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2573, "/datum/chemical_reaction/thermite", "/datum/chemical_reaction", {
	name: "Thermite",
	id: "thermite",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:105
rt.def("/datum/chemical_reaction/thermite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["thermite", 3]);
	this.required_reagents = rt.alist(f, ["aluminium", 1, "iron", 1, "oxygen", 1]);
	return f.dot;
});

rt.type(2574, "/datum/chemical_reaction/emp_pulse", "/datum/chemical_reaction", {
	name: "EMP Pulse",
	id: "emp_pulse",
	required_reagents: null,
});

// pyrotechnics.dm:111
rt.def("/datum/chemical_reaction/emp_pulse/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["uranium", 1, "iron", 1]);
	return f.dot;
});

// pyrotechnics.dm:114
rt.def("/datum/chemical_reaction/emp_pulse/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null;
	yield* empulse((location = rt.getStep(f, holder.my_atom, 0)), round(created_volume / 12), round(created_volume / 7), 1);
	yield* holder.clear_reagents();
	return f.dot;
}, true);

rt.type(2575, "/datum/chemical_reaction/stabilizing_agent", "/datum/chemical_reaction", {
	name: "stabilizing_agent",
	id: "stabilizing_agent",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:123
rt.def("/datum/chemical_reaction/stabilizing_agent/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["stabilizing_agent", 3]);
	this.required_reagents = rt.alist(f, ["iron", 1, "oxygen", 1, "hydrogen", 1]);
	return f.dot;
});

rt.type(2576, "/datum/chemical_reaction/clf3", "/datum/chemical_reaction", {
	name: "Chlorine Trifluoride",
	id: "clf3",
	required_temp: 424,
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:129
rt.def("/datum/chemical_reaction/clf3/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["clf3", 4]);
	this.required_reagents = rt.alist(f, ["chlorine", 1, "fluorine", 3]);
	return f.dot;
});

// pyrotechnics.dm:134
rt.def("/datum/chemical_reaction/clf3/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let turf: Value = null;
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	for (turf of each(range(1, _T), T("/turf"))) {
		yield* new_(T("/obj/effect/hotspot"), turf);
	}
	holder.chem_temp = 1000;
	return f.dot;
}, true);

rt.type(2567, "/datum/chemical_reaction/reagent_explosion/methsplosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Meth explosion",
	id: "methboom1",
	required_temp: 380,
	strengthdiv: 6,
	modifier: 1,
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:142
rt.def("/datum/chemical_reaction/reagent_explosion/methsplosion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["methboom1", 1]);
	this.required_reagents = rt.alist(f, ["methamphetamine", 1]);
	return f.dot;
});

// pyrotechnics.dm:149
rt.def("/datum/chemical_reaction/reagent_explosion/methsplosion/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let turf: Value = null;
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	for (turf of each(range(1, _T), T("/turf"))) {
		yield* new_(T("/obj/effect/hotspot"), turf);
	}
	holder.chem_temp = 1000;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2568, "/datum/chemical_reaction/reagent_explosion/methsplosion/methboom2", "/datum/chemical_reaction/reagent_explosion/methsplosion", {
	required_temp: 300,
	required_reagents: null,
	results: null,
});

// pyrotechnics.dm:156
rt.def("/datum/chemical_reaction/reagent_explosion/methsplosion/methboom2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["diethylamine", 1, "iodine", 1, "phosphorus", 1, "hydrogen", 1]);
	this.results = rt.alist(f, ["methboom1", 4]);
	return f.dot;
});

rt.type(2577, "/datum/chemical_reaction/sorium", "/datum/chemical_reaction", {
	name: "Sorium",
	id: "sorium",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:163
rt.def("/datum/chemical_reaction/sorium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["sorium", 4]);
	this.required_reagents = rt.alist(f, ["mercury", 1, "oxygen", 1, "nitrogen", 1, "carbon", 1]);
	return f.dot;
});

// pyrotechnics.dm:167
rt.def("/datum/chemical_reaction/sorium/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	yield* holder.remove_reagent("sorium", created_volume * 4);
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	let range: Value = max(1, min(rt.op(f, "Sqrt", [], [created_volume * 4]), 6));
	yield* this.goonchem_vortex(_T, 1, range);
	return f.dot;
}, true);

rt.type(2578, "/datum/chemical_reaction/sorium_vortex", "/datum/chemical_reaction", {
	name: "sorium_vortex",
	id: "sorium_vortex",
	required_temp: 474,
	required_reagents: null,
});

// pyrotechnics.dm:177
rt.def("/datum/chemical_reaction/sorium_vortex/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["sorium", 1]);
	return f.dot;
});

// pyrotechnics.dm:181
rt.def("/datum/chemical_reaction/sorium_vortex/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	let range: Value = max(1, min(rt.op(f, "Sqrt", [], [created_volume]), 6));
	yield* this.goonchem_vortex(_T, 1, range);
	return f.dot;
}, true);

rt.type(2579, "/datum/chemical_reaction/liquid_dark_matter", "/datum/chemical_reaction", {
	name: "Liquid Dark Matter",
	id: "liquid_dark_matter",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:188
rt.def("/datum/chemical_reaction/liquid_dark_matter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["liquid_dark_matter", 3]);
	this.required_reagents = rt.alist(f, ["stable_plasma", 1, "radium", 1, "carbon", 1]);
	return f.dot;
});

// pyrotechnics.dm:192
rt.def("/datum/chemical_reaction/liquid_dark_matter/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	yield* holder.remove_reagent("liquid_dark_matter", created_volume * 3);
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	let range: Value = max(1, min(rt.op(f, "Sqrt", [], [created_volume * 3]), 6));
	yield* this.goonchem_vortex(_T, 0, range);
	return f.dot;
}, true);

rt.type(2580, "/datum/chemical_reaction/ldm_vortex", "/datum/chemical_reaction", {
	name: "LDM Vortex",
	id: "ldm_vortex",
	required_temp: 474,
	required_reagents: null,
});

// pyrotechnics.dm:202
rt.def("/datum/chemical_reaction/ldm_vortex/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["liquid_dark_matter", 1]);
	return f.dot;
});

// pyrotechnics.dm:206
rt.def("/datum/chemical_reaction/ldm_vortex/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = rt.getStep(f, holder.my_atom, 0);
	let range: Value = max(1, min(rt.op(f, "Sqrt", [], [created_volume / 2]), 6));
	yield* this.goonchem_vortex(_T, 0, range);
	return f.dot;
}, true);

rt.type(2581, "/datum/chemical_reaction/flash_powder", "/datum/chemical_reaction", {
	name: "Flash powder",
	id: "flash_powder",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:213
rt.def("/datum/chemical_reaction/flash_powder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["flash_powder", 3]);
	this.required_reagents = rt.alist(f, ["aluminium", 1, "potassium", 1, "sulfur", 1]);
	return f.dot;
});

// pyrotechnics.dm:217
rt.def("/datum/chemical_reaction/flash_powder/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let C: Value = null;
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	yield* do_sparks(2, 1, location);
	for (C of each(get_hearers_in_view(created_volume / 3, location), T("/mob/living/carbon"))) {
		if (yield* C.flash_act()) {
			if (get_dist(C, location) < 4) {
				yield* C.Knockdown(60);
			} else {
				yield* C.Stun(100);
			}
		}
	}
	yield* holder.remove_reagent("flash_powder", created_volume * 3);
	return f.dot;
}, true);

rt.type(2582, "/datum/chemical_reaction/flash_powder_flash", "/datum/chemical_reaction", {
	name: "Flash powder activation",
	id: "flash_powder_flash",
	required_temp: 374,
	required_reagents: null,
});

// pyrotechnics.dm:232
rt.def("/datum/chemical_reaction/flash_powder_flash/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["flash_powder", 1]);
	return f.dot;
});

// pyrotechnics.dm:236
rt.def("/datum/chemical_reaction/flash_powder_flash/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let C: Value = null;
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	yield* do_sparks(2, 1, location);
	for (C of each(get_hearers_in_view(created_volume / 10, location), T("/mob/living/carbon"))) {
		if (yield* C.flash_act()) {
			if (get_dist(C, location) < 4) {
				yield* C.Knockdown(60);
			} else {
				yield* C.Stun(100);
			}
		}
	}
	return f.dot;
}, true);

rt.type(2583, "/datum/chemical_reaction/smoke_powder", "/datum/chemical_reaction", {
	name: "smoke_powder",
	id: "smoke_powder",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:248
rt.def("/datum/chemical_reaction/smoke_powder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["smoke_powder", 3]);
	this.required_reagents = rt.alist(f, ["potassium", 1, "sugar", 1, "phosphorus", 1]);
	return f.dot;
});

// pyrotechnics.dm:252
rt.def("/datum/chemical_reaction/smoke_powder/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let S: Value = null;
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	yield* holder.remove_reagent("smoke_powder", created_volume * 3);
	let smoke_radius: Value = round(rt.op(f, "Sqrt", [], [created_volume * 1.5]), 1);
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	yield* (S = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).attach(location);
	playsound(location, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
	if (S) {
		yield* S.set_up(holder, smoke_radius, location, 0);
		yield* S.start();
	}
	if (!(holder && holder.my_atom)) return f.dot;
	yield* holder.clear_reagents();
	return f.dot;
}, true);

rt.type(2584, "/datum/chemical_reaction/smoke_powder_smoke", "/datum/chemical_reaction", {
	name: "smoke_powder_smoke",
	id: "smoke_powder_smoke",
	required_temp: 374,
	secondary: 1,
	mob_react: 1,
	required_reagents: null,
});

// pyrotechnics.dm:269
rt.def("/datum/chemical_reaction/smoke_powder_smoke/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["smoke_powder", 1]);
	return f.dot;
});

// pyrotechnics.dm:275
rt.def("/datum/chemical_reaction/smoke_powder_smoke/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let S: Value = null;
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let smoke_radius: Value = round(rt.op(f, "Sqrt", [], [created_volume / 2]), 1);
	yield* (S = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).attach(location);
	playsound(location, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
	if (S) {
		yield* S.set_up(holder, smoke_radius, location, 0);
		yield* S.start();
	}
	if (!(holder && holder.my_atom)) return f.dot;
	yield* holder.clear_reagents();
	return f.dot;
}, true);

rt.type(2585, "/datum/chemical_reaction/sonic_powder", "/datum/chemical_reaction", {
	name: "sonic_powder",
	id: "sonic_powder",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:289
rt.def("/datum/chemical_reaction/sonic_powder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["sonic_powder", 3]);
	this.required_reagents = rt.alist(f, ["oxygen", 1, "cola", 1, "phosphorus", 1]);
	return f.dot;
});

// pyrotechnics.dm:293
rt.def("/datum/chemical_reaction/sonic_powder/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, C: Value = null;
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	yield* holder.remove_reagent("sonic_powder", created_volume * 3);
	playsound((location = rt.getStep(f, holder.my_atom, 0)), rt.rsc("sound/effects/bang.ogg"), 25, 1);
	for (C of each(get_hearers_in_view(created_volume / 3, location), T("/mob/living/carbon"))) {
		yield* C.soundbang_act(1, 100, rand(0, 5));
	}
	return f.dot;
}, true);

rt.type(2586, "/datum/chemical_reaction/sonic_powder_deafen", "/datum/chemical_reaction", {
	name: "sonic_powder_deafen",
	id: "sonic_powder_deafen",
	required_temp: 374,
	required_reagents: null,
});

// pyrotechnics.dm:304
rt.def("/datum/chemical_reaction/sonic_powder_deafen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["sonic_powder", 1]);
	return f.dot;
});

// pyrotechnics.dm:308
rt.def("/datum/chemical_reaction/sonic_powder_deafen/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, C: Value = null;
	playsound((location = rt.getStep(f, holder.my_atom, 0)), rt.rsc("sound/effects/bang.ogg"), 25, 1);
	for (C of each(get_hearers_in_view(created_volume / 10, location), T("/mob/living/carbon"))) {
		yield* C.soundbang_act(1, 100, rand(0, 5));
	}
	return f.dot;
}, true);

rt.type(2587, "/datum/chemical_reaction/phlogiston", "/datum/chemical_reaction", {
	name: "phlogiston",
	id: "phlogiston",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:316
rt.def("/datum/chemical_reaction/phlogiston/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["phlogiston", 3]);
	this.required_reagents = rt.alist(f, ["phosphorus", 1, "sacid", 1, "stable_plasma", 1]);
	return f.dot;
});

// pyrotechnics.dm:320
rt.def("/datum/chemical_reaction/phlogiston/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null;
	if (holder.has_reagent("stabilizing_agent")) {
		return f.dot;
	}
	if (rt.istype((_T = rt.getStep(f, holder.my_atom, 0)), T("/turf/open"))) {
		_T.atmos_spawn_air(`plasma=${created_volume};TEMP=1000`);
	}
	yield* holder.clear_reagents();
	return f.dot;
}, true);

rt.type(2588, "/datum/chemical_reaction/napalm", "/datum/chemical_reaction", {
	name: "Napalm",
	id: "napalm",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:331
rt.def("/datum/chemical_reaction/napalm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["napalm", 3]);
	this.required_reagents = rt.alist(f, ["oil", 1, "welding_fuel", 1, "ethanol", 1]);
	return f.dot;
});

rt.type(2589, "/datum/chemical_reaction/cryostylane", "/datum/chemical_reaction", {
	name: "cryostylane",
	id: "cryostylane",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:337
rt.def("/datum/chemical_reaction/cryostylane/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["cryostylane", 3]);
	this.required_reagents = rt.alist(f, ["water", 1, "stable_plasma", 1, "nitrogen", 1]);
	return f.dot;
});

// pyrotechnics.dm:341
rt.def("/datum/chemical_reaction/cryostylane/proc/on_reaction", function on_reaction(f: Frame, holder: Value, created_volume: Value) {
	holder.chem_temp = 20;
	return f.dot;
});

rt.type(2590, "/datum/chemical_reaction/pyrosium", "/datum/chemical_reaction", {
	name: "pyrosium",
	id: "pyrosium",
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:348
rt.def("/datum/chemical_reaction/pyrosium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["pyrosium", 3]);
	this.required_reagents = rt.alist(f, ["stable_plasma", 1, "radium", 1, "phosphorus", 1]);
	return f.dot;
});

// pyrotechnics.dm:352
rt.def("/datum/chemical_reaction/pyrosium/proc/on_reaction", function on_reaction(f: Frame, holder: Value, created_volume: Value) {
	holder.chem_temp = 20;
	return f.dot;
});

rt.type(2591, "/datum/chemical_reaction/teslium", "/datum/chemical_reaction", {
	name: "Teslium",
	id: "teslium",
	mix_message: "<span class='danger'>A jet of sparks flies from the mixture as it merges into a flickering slurry.</span>",
	required_temp: 400,
	results: null,
	required_reagents: null,
});

// pyrotechnics.dm:358
rt.def("/datum/chemical_reaction/teslium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["teslium", 3]);
	this.required_reagents = rt.alist(f, ["stable_plasma", 1, "silver", 1, "blackpowder", 1]);
	return f.dot;
});

rt.type(2569, "/datum/chemical_reaction/reagent_explosion/teslium_lightning", "/datum/chemical_reaction/reagent_explosion", {
	name: "Teslium Destabilization",
	id: "teslium_lightning",
	strengthdiv: 100,
	modifier: -100,
	mix_message: "<span class='boldannounce'>The teslium starts to spark as electricity arcs away from it!</span>",
	mix_sound: rt.rsc("sound/machines/defib_zap.ogg"),
	required_reagents: null,
	results: null,
});

// pyrotechnics.dm:366
rt.def("/datum/chemical_reaction/reagent_explosion/teslium_lightning/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["teslium", 1, "water", 1]);
	this.results = rt.alist(f, ["destabilized_teslium", 1]);
	return f.dot;
});

// pyrotechnics.dm:374
rt.def("/datum/chemical_reaction/reagent_explosion/teslium_lightning/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let T1: Value = created_volume * 20;
	let T2: Value = created_volume * 50;
	let T3: Value = created_volume * 120;
	yield* sleep(5);
	if (created_volume >= 75) {
		yield* tesla_zap(holder.my_atom, 7, T1);
		playsound(holder.my_atom, rt.rsc("sound/machines/defib_zap.ogg"), 50, 1);
		yield* sleep(15);
	}
	if (created_volume >= 40) {
		yield* tesla_zap(holder.my_atom, 7, T2);
		playsound(holder.my_atom, rt.rsc("sound/machines/defib_zap.ogg"), 50, 1);
		yield* sleep(15);
	}
	if (created_volume >= 10) {
		yield* tesla_zap(holder.my_atom, 7, T3);
		playsound(holder.my_atom, rt.rsc("sound/machines/defib_zap.ogg"), 50, 1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2570, "/datum/chemical_reaction/reagent_explosion/teslium_lightning/heat", "/datum/chemical_reaction/reagent_explosion/teslium_lightning", {
	id: "teslium_lightning2",
	required_temp: 474,
	required_reagents: null,
});

// pyrotechnics.dm:394
rt.def("/datum/chemical_reaction/reagent_explosion/teslium_lightning/heat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["teslium", 1]);
	return f.dot;
});

rt.type(2571, "/datum/chemical_reaction/reagent_explosion/nitrous_oxide", "/datum/chemical_reaction/reagent_explosion", {
	name: "N2O explosion",
	id: "n2o_explosion",
	strengthdiv: 7,
	required_temp: 575,
	modifier: 1,
	required_reagents: null,
});

// pyrotechnics.dm:399
rt.def("/datum/chemical_reaction/reagent_explosion/nitrous_oxide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["nitrous_oxide", 1]);
	return f.dot;
});
