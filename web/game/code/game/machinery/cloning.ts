// Based on /tg/station's code/game/machinery/cloning.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10785, "/obj/machinery/clonepod", "/obj/machinery", {
	heal_level: null,
	connected: null,
	mess: 0,
	attempting: 0,
	speed_coeff: null,
	efficiency: null,
	clonemind: null,
	grab_ghost_when: "mature",
	radio: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_med"),
	radio_channel: "Medical",
	countdown: null,
	unattached_flesh: null,
	flesh_number: 0,
	anchored: 1,
	verb_say: "states",
	name: "cloning pod",
	desc: "An electronically-lockable pod for growing organic tissue.",
	density: 1,
	icon: rt.rsc("icons/obj/cloning.dmi"),
	icon_state: "pod_0",
	req_access: null,
}, { global: { brine_types: 753 } });

// cloning.dm:18
rt.def("/obj/machinery/clonepod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(68);
	return f.dot;
});

// cloning.dm:48
rt.def("/obj/machinery/clonepod/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/clonepod"), null))).apply_default_parts(this);
	this.countdown = (yield* new_(T("/obj/effect/countdown/clonepod"), this));
	this.radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.radio.keyslot = (yield* new_(this.radio_key));
	this.radio.subspace_transmission = 1;
	this.radio.canhear_range = 0;
	this.radio.recalculateChannels();
	return f.dot;
}, true);

// cloning.dm:61
rt.def("/obj/machinery/clonepod/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null;
	yield* this.go_out();
	yield* qdel(this.radio);
	this.radio = null;
	yield* qdel(this.countdown);
	this.countdown = null;
	if (this.connected) {
		this.connected.DetachCloner(this);
	}
	for (i of each(this.unattached_flesh)) {
		yield* qdel(i);
	}
	if (this.unattached_flesh) {
		this.unattached_flesh.Cut();
	}
	this.unattached_flesh = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cloning.dm:77
rt.def("/obj/machinery/clonepod/proc/RefreshParts", function RefreshParts(f: Frame) {
	let S: Value = null, _P: Value = null;
	this.speed_coeff = 0;
	this.efficiency = 0;
	for (S of each(this.component_parts, T("/obj/item/weapon/stock_parts/scanning_module"))) {
		this.efficiency += S.rating;
	}
	for (_P of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		this.speed_coeff += _P.rating;
	}
	this.heal_level = this.efficiency * 15 + 10;
	if (this.heal_level < 40) {
		this.heal_level = 40;
	}
	if (!(this.heal_level > 100)) return f.dot;
	this.heal_level = 100;
	return f.dot;
});

rt.type(6716, "/obj/item/weapon/circuitboard/machine/clonepod", "/obj/item/weapon/circuitboard/machine", {
	name: "Clone Pod (Machine Board)",
	build_path: rt.typePath("/obj/machinery/clonepod"),
	origin_tech: "programming=2;biotech=2",
	req_components: null,
});

// cloning.dm:91
rt.def("/obj/item/weapon/circuitboard/machine/clonepod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/scanning_module"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/sheet/glass"), 1]);
	return f.dot;
});

rt.type(6674, "/obj/item/weapon/disk/data", "/obj/item/weapon/disk", {
	fields: null,
	read_only: 0,
	name: "cloning data disk",
	icon_state: "datadisk0",
});

// cloning.dm:102
rt.def("/obj/item/weapon/disk/data/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.fields = list();
	return f.dot;
});

// cloning.dm:107
rt.def("/obj/item/weapon/disk/data/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.icon_state = `datadisk${rand(0, 6)}`;
	this.add_overlay("datadisk_gene");
	return f.dot;
}, true);

// cloning.dm:112
rt.def("/obj/item/weapon/disk/data/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $1: any;
	this.read_only = (!this.read_only ? 1 : 0);
	let $0: any = user;
	if (this.read_only) {
		$1 = "protected";
	} else {
		$1 = "unprotected";
	}
	to_chat($0, `<span class='notice'>You flip the write-protect tab to ${$1}.</span>`);
	return f.dot;
});

// cloning.dm:116
rt.def("/obj/item/weapon/disk/data/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The write-protect tab is set to ${this.read_only ? "protected" : "unprotected"}.`);
	return f.dot;
}, false);

// cloning.dm:123
rt.def("/obj/machinery/clonepod/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let mob_occupant: Value = this.occupant;
	if (this.mess) {
		to_chat(user, "It's filled with blood and viscera. You swear you can see it moving...");
	}
	if (!(this.is_operational() && mob_occupant)) return f.dot;
	if (mob_occupant.stat == 2) return f.dot;
	to_chat(user, `Current clone cycle is ${round(this.get_completion())}% complete.`);
	return f.dot;
}, false);

// cloning.dm:136
rt.def("/obj/machinery/clonepod/proc/return_air", function return_air(f: Frame) {
	if (!GLOB.GM) {
		GLOB.GM = new_(T("/datum/gas_mixture/immutable/cloner"));
	}
	return GLOB.GM;
});

// cloning.dm:142
rt.def("/obj/machinery/clonepod/proc/get_completion", function get_completion(f: Frame) {
	let mob_occupant: Value = null;
	f.dot = 0;
	if (!(mob_occupant = this.occupant)) return f.dot;
	f.dot = 100 * ((mob_occupant.health + 100) / (this.heal_level + 100));
	return f.dot;
});

// cloning.dm:147
rt.def("/obj/machinery/clonepod/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return this.examine(user);
});

// cloning.dm:153
rt.def("/obj/machinery/clonepod/proc/growclone", function* growclone(f: Frame, ckey: Value, clonename: Value, ui: Value, se: Value, mindref: Value, mrace: Value, features: Value, factions: Value) {
	let G: Value = null, B: Value = null, unclean_mutations: Value = null, M: Value = null;
	if (this.panel_open) {
		return 0;
	}
	if (this.mess || this.attempting) {
		return 0;
	}
	this.clonemind = rt.locateIn(f, mindref, rt.world());
	if (!rt.istype(this.clonemind, T("/datum/mind"))) {
		return 0;
	}
	if (this.clonemind.current && this.clonemind.current.stat != 2) {
		return 0;
	}
	if (this.clonemind.active) {
		if ((yield* g.call(f, P("/proc/ckey"), null, [this.clonemind.key])) != ckey) {
			return 0;
		}
	} else if (!(G = this.clonemind.get_ghost())) {
		return 0;
	}
	if (this.clonemind.damnation_type) {
		yield* ImmediateInvokeAsync(this, P("/obj/machinery/clonepod/proc/horrifyingsound"));
		this.mess = 1;
		this.icon_state = "pod_g";
		yield* this.update_icon();
		return 0;
	}
	this.attempting = 1;
	yield* this.countdown.start();
	let H: Value = (yield* new_(T("/mob/living/carbon/human"), this));
	if (this.clonemind.changeling) {
		(B = H.getorganslot("brain")).vital = 0;
		B.decoy_override = 1;
	}
	yield* H.hardset_dna(ui, se, H.real_name, null, mrace, features);
	if (this.efficiency > 2) {
		unclean_mutations = rt.bitOr(GLOB.not_good_mutations, GLOB.bad_mutations);
		yield* H.dna.remove_mutation_group(unclean_mutations);
	}
	if (this.efficiency > 5 && prob(20)) {
		yield* H.randmutvg();
	}
	if (this.efficiency < 3 && prob(50)) {
		if (ismob((M = (yield* H.randmutb())))) {
			H = M;
		}
	}
	H.silent = 20;
	this.occupant = H;
	if (!clonename) {
		clonename = `clone (${rand(0, 999)})`;
	}
	H.real_name = clonename;
	this.icon_state = "pod_1";
	yield* this.maim_clone(H);
	yield* this.check_brine();
	yield* H.Unconscious(80);
	yield* this.clonemind.transfer_to(H);
	if (this.grab_ghost_when == "fresh") {
		yield* H.grab_ghost();
		to_chat(H, "<span class='notice'><b>Consciousness slowly creeps over you as your body regenerates.</b><br><i>So this is what cloning feels like?</i></span>");
	}
	if (this.grab_ghost_when == "mature") {
		yield* H.ghostize(1);
		to_chat(H.get_ghost(1), "<span class='notice'>Your body is beginning to regenerate in a cloning pod. You will become conscious when it is complete.</span>");
	}
	if (H) {
		(rt.modField(f, H, "faction", factions, rt.bitOr));
		yield* H.set_cloned_appearance();
		H.suiciding = 0;
	}
	this.attempting = 0;
	return 1;
}, true);

// cloning.dm:231
rt.def("/obj/machinery/clonepod/proc/process", function* process(f: Frame) {
	let progress: Value = null, milestone: Value = null, installed: Value = null, I: Value = null, O: Value = null, BP: Value = null, i: Value = null, O_2: Value = null, BP_2: Value = null;
	let mob_occupant: Value = this.occupant;
	if (!this.is_operational()) {
		if (mob_occupant) {
			yield* this.go_out();
			yield* this.connected_message("Clone Ejected: Loss of power.");
		}
	} else if (mob_occupant && mob_occupant.loc == this) {
		if (mob_occupant.stat == 2 || mob_occupant.suiciding || mob_occupant.hellbound) {
			yield* this.connected_message("Clone Rejected: Deceased.");
			yield* this.radio.talk_into(this, `The cloning of ${mob_occupant.real_name} has been aborted due to unrecoverable tissue failure.`, this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
			yield* this.go_out();
		} else if (mob_occupant.cloneloss > 100 - this.heal_level) {
			yield* mob_occupant.Unconscious(80);
			yield* mob_occupant.adjustCloneLoss(-(this.speed_coeff / 2 * GLOB.config.damage_multiplier));
			progress = CLONE_INITIAL_DAMAGE - mob_occupant.getCloneLoss();
			progress += 60;
			milestone = CLONE_INITIAL_DAMAGE / this.flesh_number;
			installed = this.flesh_number - rt.len(f, this.unattached_flesh);
			if (progress / milestone >= installed) {
				if (rt.istype((I = pick_n_take(this.unattached_flesh)), T("/obj/item/organ"))) {
					yield* (O = I).Insert(mob_occupant);
				} else if (rt.istype(I, T("/obj/item/bodypart"))) {
					yield* (BP = I).attach_limb(mob_occupant);
				}
			}
			yield* mob_occupant.adjustBrainLoss(-(this.speed_coeff / 2 * GLOB.config.damage_multiplier));
			yield* this.check_brine();
			yield* this.use_power(7500);
		} else if (mob_occupant.cloneloss <= 100 - this.heal_level) {
			yield* this.connected_message("Cloning Process Complete.");
			yield* this.radio.talk_into(this, `The cloning cycle of ${mob_occupant.real_name} is complete.`, this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
			for (i of each(this.unattached_flesh)) {
				if (rt.istype(i, T("/obj/item/organ"))) {
					yield* (O_2 = i).Insert(mob_occupant);
				} else if (rt.istype(i, T("/obj/item/bodypart"))) {
					yield* (BP_2 = i).attach_limb(mob_occupant);
				}
			}
			yield* this.go_out();
		}
	} else {
		if (!(!mob_occupant || mob_occupant.loc != this)) return f.dot;
		this.occupant = null;
		if (!this.mess && !this.panel_open) {
			this.icon_state = "pod_0";
		}
		yield* this.use_power(200);
	}
	return f.dot;
}, true, { waitfor: false });

// cloning.dm:297
rt.def("/obj/machinery/clonepod/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _P: Value = null, comp: Value = null;
	if (!(this.occupant || this.mess)) {
		if (this.default_deconstruction_screwdriver(user, `${this.icon_state}_maintenance`, `${rt.initial(f, this, "icon_state")}`, W)) {
			return f.dot;
		}
	}
	if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (rt.istype((_P = W).buffer, T("/obj/machinery/computer/cloning"))) {
			if (get_area(_P.buffer) != get_area(this)) {
				to_chat(user, "<font color = #666633>-% Cannot link machines across power zones. Buffer cleared %-</font color>");
				_P.buffer = null;
				return f.dot;
			}
			to_chat(user, `<font color = #666633>-% Successfully linked ${_P.buffer} with ${this} %-</font color>`);
			comp = _P.buffer;
			if (this.connected) {
				this.connected.DetachCloner(this);
			}
			comp.AttachCloner(this);
		} else {
			_P.buffer = this;
			to_chat(user, fmt("<font color = #666633>-% Successfully stored ＃ ＀ in buffer %-</font color>", [_P.buffer, _P.buffer.name]));
		}
		return f.dot;
	}
	let mob_occupant: Value = this.occupant;
	if (W.GetID()) {
		if (!this.check_access(W)) {
			to_chat(user, "<span class='danger'>Access Denied.</span>");
			return f.dot;
		}
		if (!(mob_occupant || this.mess)) {
			to_chat(user, "<span class='danger'>Error: Pod has no occupant.</span>");
			return f.dot;
		} else {
			yield* this.connected_message("Emergency Ejection");
			yield* this.radio.talk_into(this, `An emergency ejection of ${this.clonemind.name} has occurred. Survival not guaranteed.`, this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
			to_chat(user, "<span class='notice'>You force an emergency ejection. </span>");
			yield* this.go_out();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cloning.dm:342
rt.def("/obj/machinery/clonepod/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (!this.occupant) {
		return f.dot;
	}
	to_chat(user, "<span class='warning'>You corrupt the genetic compiler.</span>");
	yield* this.malfunction();
	return f.dot;
}, true);

// cloning.dm:349
rt.def("/obj/machinery/clonepod/proc/connected_message", function* connected_message(f: Frame, message: Value) {
	if (this.connected === null || !rt.istype(this.connected, T("/obj/machinery/computer/cloning"))) {
		return 0;
	}
	if (!message) {
		return 0;
	}
	this.connected.temp = message;
	yield* this.connected.updateUsrDialog();
	return 1;
}, true);

// cloning.dm:359
rt.def("/obj/machinery/clonepod/proc/go_out", function* go_out(f: Frame) {
	let fl: Value = null;
	yield* this.countdown.stop();
	let mob_occupant: Value = this.occupant;
	let _T: Value = rt.getStep(f, this, 0);
	if (this.mess) {
		for (fl of each(this.unattached_flesh, T("/obj"))) {
			yield* fl.forceMove(_T);
		}
		this.unattached_flesh.Cut();
		this.mess = 0;
		yield* new_(T("/obj/effect/gibspawner/generic"), this.loc);
		this.audible_message("<span class='italics'>You hear a splat.</span>");
		this.icon_state = "pod_0";
		return f.dot;
	}
	if (!mob_occupant) {
		return f.dot;
	}
	if (this.grab_ghost_when == "mature") {
		yield* mob_occupant.grab_ghost();
		to_chat(this.occupant, "<span class='notice'><b>There is a bright flash!</b><br><i>You feel like a new being.</i></span>");
		yield* mob_occupant.flash_act();
	}
	yield* this.occupant.forceMove(_T);
	this.icon_state = "pod_0";
	yield* mob_occupant.domutcheck(1);
	fl = null;
	for (fl of each(this.unattached_flesh)) {
		yield* qdel(fl);
	}
	this.unattached_flesh.Cut();
	this.occupant = null;
	return f.dot;
}, true);

// cloning.dm:392
rt.def("/obj/machinery/clonepod/proc/malfunction", function* malfunction(f: Frame) {
	let mob_occupant: Value = null;
	if (!(mob_occupant = this.occupant)) return f.dot;
	yield* this.connected_message("Critical Error!");
	yield* this.radio.talk_into(this, "Critical error! Please contact a Thinktronic Systems technician, as your warranty may be affected.", this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
	this.mess = 1;
	yield* this.maim_clone(mob_occupant);
	this.icon_state = "pod_g";
	if (mob_occupant.mind != this.clonemind) {
		yield* this.clonemind.transfer_to(mob_occupant);
	}
	yield* mob_occupant.grab_ghost();
	yield* flash_color(mob_occupant, { flash_color: "#960000", flash_time: 100 });
	to_chat(mob_occupant, "<span class='warning'><b>Agony blazes across your consciousness as your body is torn apart.</b><br><i>Is this what dying is like? Yes it is.</i></span>");
	playsound(this.loc, rt.rsc("sound/machines/warning-buzzer.ogg"), 50, 0);
	rt.op(f, "Output", [], [mob_occupant, sound(rt.rsc("sound/hallucinations/veryfar_noise.ogg"), 0, 1, 50)], false);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), mob_occupant)), 40, 8);
	return f.dot;
}, true);

// cloning.dm:410
rt.def("/obj/machinery/clonepod/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.stat != 0) return f.dot;
	yield* this.go_out();
	return f.dot;
}, true);

// cloning.dm:414
rt.def("/obj/machinery/clonepod/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let mob_occupant: Value = null;
	if ((mob_occupant = this.occupant) && prob(100 / (severity * this.efficiency))) {
		yield* this.connected_message(Gibberish("EMP-caused Accidental Ejection", 0));
		yield* this.radio.talk_into(this, Gibberish(`Exposure to electromagnetic fields has caused the ejection of ${mob_occupant.real_name} prematurely.`, 0), this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
		yield* this.go_out();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cloning.dm:422
rt.def("/obj/machinery/clonepod/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* parent_proc();
	if (!this || this.gc_destroyed) return f.dot;
	yield* this.go_out();
	return f.dot;
}, true, { waitfor: false });

// cloning.dm:427
rt.def("/obj/machinery/clonepod/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (A != this.occupant) return f.dot;
	this.occupant = null;
	this.countdown.stop();
	return f.dot;
});

// cloning.dm:432
rt.def("/obj/machinery/clonepod/proc/horrifyingsound", function* horrifyingsound(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		playsound(this.loc, pick(rt.rsc("sound/hallucinations/growl1.ogg"), rt.rsc("sound/hallucinations/growl2.ogg"), rt.rsc("sound/hallucinations/growl3.ogg")), 100, rand(0.95, 1.05));
		yield* sleep(1);
	}
	rt.endFor(f, 0);
	yield* sleep(10);
	playsound(this.loc, rt.rsc("sound/hallucinations/wail.ogg"), 100, 1);
	return f.dot;
}, true);

// cloning.dm:440
rt.def("/obj/machinery/clonepod/proc/deconstruct", function* deconstruct(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (this.occupant) {
		yield* this.go_out();
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

// cloning.dm:444
rt.def("/obj/machinery/clonepod/proc/maim_clone", function* maim_clone(f: Frame, H: Value) {
	let fl: Value = null, zone: Value = null, BP: Value = null, o: Value = null, organ: Value = null;
	if (!this.unattached_flesh) {
		this.unattached_flesh = list();
	} else {
		for (fl of each(this.unattached_flesh)) {
			yield* qdel(fl);
		}
		this.unattached_flesh.Cut();
	}
	yield* H.setCloneLoss(CLONE_INITIAL_DAMAGE);
	H.setBrainLoss(CLONE_INITIAL_DAMAGE);
	for (zone of each(GLOB.zones)) {
		if (BP = H.get_bodypart(zone)) {
			yield* BP.drop_limb();
			yield* BP.forceMove(this);
			this.unattached_flesh += BP;
		}
	}
	for (o of each(H.internal_organs)) {
		if (!rt.istype((organ = o), T("/obj/item/organ")) || organ.vital) {
			continue;
		}
		yield* organ.Remove(H, { special: 1 });
		yield* organ.forceMove(this);
		this.unattached_flesh += organ;
	}
	this.flesh_number = rt.len(f, this.unattached_flesh);
	return f.dot;
}, true);

// cloning.dm:476
rt.def("/obj/machinery/clonepod/proc/check_brine", function* check_brine(f: Frame) {
	let bt: Value = null;
	for (bt of each(GLOB.brine_types)) {
		if (this.occupant.reagents.get_reagent_amount(bt) < 1) {
			yield* this.occupant.reagents.add_reagent(bt, 1);
		}
	}
	return f.dot;
}, true);
