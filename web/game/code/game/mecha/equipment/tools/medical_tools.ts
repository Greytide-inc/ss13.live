// Based on /tg/station's code/game/mecha/equipment/tools/medical_tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, subtract, fmt } = rt;


rt.type(9607, "/obj/item/mecha_parts/mecha_equipment/medical", "/obj/item/mecha_parts/mecha_equipment", {});

// medical_tools.dm:6
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (f.src.isprocessing) return f.dot;
	f.src.isprocessing = 1;
	GLOB.SSobj.processing += f.src;
	return f.dot;
}, true);

// medical_tools.dm:11
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (!(parent_proc() && rt.istype(M, T("/obj/mecha/medical")))) return f.dot;
	return 1;
}, false);

// medical_tools.dm:16
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/attach", function attach(f: Frame, M: Value) {
	parent_proc();
	if (f.src.isprocessing) return f.dot;
	f.src.isprocessing = 1;
	GLOB.SSobj.processing += f.src;
	return f.dot;
}, false);

// medical_tools.dm:20
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/Destroy", function* Destroy(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

// medical_tools.dm:24
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/proc/process", function process(f: Frame) {
	if (this.chassis) return f.dot;
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return 1;
}, false, { waitfor: false });

rt.type(9608, "/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam", "/obj/item/mecha_parts/mecha_equipment/medical", {
	medigun: null,
	energy_drain: 10,
	range: 3,
	equip_cooldown: 0,
	name: "exosuit medical beamgun",
	desc: "Equipment for medical exosuits. Generates a focused beam of medical nanites.",
	icon_state: "mecha_medigun",
	origin_tech: "combat=5;materials=6;powerstorage=7;biotech=6",
	materials: null,
});

// medical_tools.dm:29
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/detach", function* detach(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

rt.type(9609, "/obj/item/mecha_parts/mecha_equipment/medical/sleeper", "/obj/item/mecha_parts/mecha_equipment/medical", {
	patient: null,
	inject_amount: 10,
	energy_drain: 20,
	range: 1,
	equip_cooldown: 20,
	salvageable: 0,
	name: "mounted sleeper",
	desc: "Equipment for medical exosuits. A mounted sleeper that stabilizes patients and can inject reagents in the exosuit's reserves.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	origin_tech: "engineering=3;biotech=3;plasmatech=2",
});

// medical_tools.dm:49
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Destroy", function* Destroy(f: Frame) {
	let AM: Value = null;
	for (AM of each(f.src, T("/atom/movable"))) {
		yield* AM.forceMove(rt.getStep(f, f.src, 0));
	}
	return (yield* parent_proc());
}, true);

// medical_tools.dm:57
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/action", function* action(f: Frame, target: Value) {
	if (!(yield* this.action_checks(target))) {
		return f.dot;
	}
	if (!rt.istype(target, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!(yield* this.patient_insertion_check(target))) {
		return f.dot;
	}
	yield* this.occupant_message(`<span class='notice'>You start putting ${target} into ${f.src}...</span>`);
	this.chassis.visible_message(fmt("<span class='warning'>＀ starts putting ＀ into ％！.</span>", [this.chassis, target, f.src]));
	if (!(yield* this.do_after_cooldown(target))) return f.dot;
	if (!(yield* this.patient_insertion_check(target))) {
		return f.dot;
	}
	yield* target.forceMove(f.src);
	this.patient = target;
	if (!f.src.isprocessing) {
		f.src.isprocessing = 1;
		GLOB.SSobj.processing += f.src;
	}
	yield* this.update_equip_info();
	yield* this.occupant_message(`<span class='notice'>${target} successfully loaded into ${f.src}. Life support functions engaged.</span>`);
	this.chassis.visible_message(`<span class='warning'>${this.chassis} loads ${target} into ${f.src}.</span>`);
	yield* this.log_message(`${target} loaded. Life support functions engaged.`);
	return f.dot;
}, true);

// medical_tools.dm:77
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/patient_insertion_check", function patient_insertion_check(f: Frame, target: Value) {
	if (target.buckled) {
		this.occupant_message(`<span class='warning'>${target} will not fit into the sleeper because ${target.p_they()} ${target.p_are()} buckled to ${target.buckled}!</span>`);
		return f.dot;
	}
	if (target.has_buckled_mobs()) {
		this.occupant_message(`<span class='warning'>${target} will not fit into the sleeper because of the creatures attached to it!</span>`);
		return f.dot;
	}
	if (this.patient) {
		this.occupant_message("<span class='warning'>The sleeper is already occupied!</span>");
		return f.dot;
	}
	return 1;
});

// medical_tools.dm:89
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/go_out", function* go_out(f: Frame) {
	if (!this.patient) {
		return f.dot;
	}
	yield* this.patient.forceMove(rt.getStep(f, f.src, 0));
	yield* this.occupant_message(`${this.patient} ejected. Life support functions disabled.`);
	yield* this.log_message(`${this.patient} ejected. Life support functions disabled.`);
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	this.patient = null;
	yield* this.update_equip_info();
	return f.dot;
}, true);

// medical_tools.dm:100
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/detach", function* detach(f: Frame) {
	if (this.patient) {
		yield* this.occupant_message(`<span class='warning'>Unable to detach ${f.src} - equipment occupied!</span>`);
		return f.dot;
	}
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

// medical_tools.dm:106
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null, temp: Value = null;
	let $0: any, $1: any;
	if (output = parent_proc()) {
		temp = "";
		if (this.patient) {
			$0 = this.patient;
			if (this.patient.stat > 1) {
				$1 = "*DECEASED*";
			} else {
				$1 = `Health: ${this.patient.health}%`;
			}
			temp = fmt("<br />[Occupant: ＀ (＀)]<br /><a href='?src=＃;view_stats=1'>View stats</a>|<a href='?src=＃;eject=1'>Eject</a>", [$0, $1, f.src, f.src]);
		}
		return `${output} ${temp}`;
	}
	return f.dot;
});

// medical_tools.dm:115
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let filter: Value = null;
	yield* parent_proc();
	if (yield* g.callName(f, (filter = (yield* new_(T("/datum/topic_input"), href, href_list))), "get", ["eject"])) {
		yield* this.go_out();
	}
	if (yield* g.callName(f, filter, "get", ["view_stats"])) {
		rt.op(f, "Browse", [], [this.chassis.occupant, (yield* this.get_patient_stats()), "window=msleeper"], false);
		onclose(this.chassis.occupant, "msleeper");
		return f.dot;
	}
	if (yield* g.callName(f, filter, "get", ["inject"])) {
		yield* this.inject_reagent(filter.getType("inject", T("/datum/reagent")), filter.getObj("source"));
	}
	return f.dot;
}, true);

// medical_tools.dm:128
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_stats", function get_patient_stats(f: Frame) {
	if (!this.patient) {
		return f.dot;
	}
	return `<html>\n\t\t\t\t<head>\n\t\t\t\t<title>${this.patient} statistics</title>\n\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t${"\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n"}\n\t\t\t\t</script>\n\t\t\t\t<style>\n\t\t\t\th3 {margin-bottom:2px;font-size:14px;}\n\t\t\t\t#lossinfo, #reagents, #injectwith {padding-left:15px;}\n\t\t\t\t</style>\n\t\t\t\t</head>\n\t\t\t\t<body>\n\t\t\t\t<h3>Health statistics</h3>\n\t\t\t\t<div id="lossinfo">\n\t\t\t\t${this.get_patient_dam()}\n\t\t\t\t</div>\n\t\t\t\t<h3>Reagents in bloodstream</h3>\n\t\t\t\t<div id="reagents">\n\t\t\t\t${this.get_patient_reagents()}\n\t\t\t\t</div>\n\t\t\t\t<div id="injectwith">\n\t\t\t\t${this.get_available_reagents()}\n\t\t\t\t</div>\n\t\t\t\t</body>\n\t\t\t\t</html>`;
});

// medical_tools.dm:158
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_dam", function get_patient_dam(f: Frame) {
	let t1: Value = null;
	let $1: any, $2: any, $5: any, $7: any, $9: any, $11: any, $13: any, $14: any;
	let $0: any = this.patient.stat;
	if ($0 === 0) {
		t1 = "Conscious";
	} else if ($0 === 1) {
		t1 = "Unconscious";
	} else if ($0 === 2) {
		t1 = "*dead*";
	} else {
		t1 = "Unknown";
	}
	if (this.patient.health > 50) {
		$0 = "blue";
	} else {
		$0 = "red";
	}
	if (this.patient.stat > 1) {
		$1 = `${t1}`;
	} else {
		$1 = `${this.patient.health}% (${t1})`;
	}
	if (this.patient.bodytemperature > 50) {
		$2 = "blue";
	} else {
		$2 = "red";
	}
	let $3: any = this.patient.bodytemperature - T0C;
	let $4: any = this.patient.bodytemperature * 1.8 - 459.67;
	if (this.patient.getBruteLoss() < 60) {
		$5 = "blue";
	} else {
		$5 = "red";
	}
	let $6: any = this.patient.getBruteLoss();
	if (this.patient.getOxyLoss() < 60) {
		$7 = "blue";
	} else {
		$7 = "red";
	}
	let $8: any = this.patient.getOxyLoss();
	if (this.patient.getToxLoss() < 60) {
		$9 = "blue";
	} else {
		$9 = "red";
	}
	let $10: any = this.patient.getToxLoss();
	if (this.patient.getFireLoss() < 60) {
		$11 = "blue";
	} else {
		$11 = "red";
	}
	let $12: any = this.patient.getFireLoss();
	if (this.patient.getCloneLoss()) {
		$13 = "Subject appears to have cellular damage.";
	} else {
		$13 = "";
	}
	if (this.patient.getBrainLoss()) {
		$14 = "Significant brain damage detected.";
	} else {
		$14 = "";
	}
	return `<font color="${$0}"><b>Health:</b> ${$1}</font><br />\n\t\t\t\t<font color="${$2}"><b>Core Temperature:</b> ${$3}&deg;C (${$4}&deg;F)</font><br />\n\t\t\t\t<font color="${$5}"><b>Brute Damage:</b> ${$6}%</font><br />\n\t\t\t\t<font color="${$7}"><b>Respiratory Damage:</b> ${$8}%</font><br />\n\t\t\t\t<font color="${$9}"><b>Toxin Content:</b> ${$10}%</font><br />\n\t\t\t\t<font color="${$11}"><b>Burn Severity:</b> ${$12}%</font><br />\n\t\t\t\t<font color="red">${$13}</font><br />\n\t\t\t\t<font color="red">${$14}</font><br />\n\t\t\t\t`;
});

// medical_tools.dm:178
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_patient_reagents", function get_patient_reagents(f: Frame) {
	let R: Value = null;
	if (this.patient.reagents) {
		for (R of each(this.patient.reagents.reagent_list, T("/datum/reagent"))) {
			if (R.volume > 0) {
				f.dot += `${R}: ${round(R.volume, 0.01)}<br />`;
			}
		}
	}
	return (f.dot || "None");
});

// medical_tools.dm:186
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/get_available_reagents", function get_available_reagents(f: Frame) {
	let output: Value = null, SG: Value = null, R: Value = null;
	if ((SG = rt.locateIn(f, T("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun"), this.chassis)) && SG.reagents && rt.istype(SG.reagents.reagent_list, T("/list"))) {
		for (R of each(SG.reagents.reagent_list, T("/datum/reagent"))) {
			if (R.volume > 0) {
				output += fmt("<a href=\"?src=＃;inject=＃;source=＃\">Inject ＀</a><br />", [f.src, R, SG, R.name]);
			}
		}
	}
	return output;
});

// medical_tools.dm:195
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/inject_reagent", function* inject_reagent(f: Frame, R: Value, SG: Value) {
	let to_inject: Value = null;
	if (!R || !this.patient || !SG || !rt.isIn(f, SG, this.chassis.equipment)) {
		return 0;
	}
	if ((to_inject = min(R.volume, this.inject_amount)) && this.patient.reagents.get_reagent_amount(R.id) + to_inject <= this.inject_amount * 2) {
		yield* this.occupant_message(`Injecting ${this.patient} with ${to_inject} units of ${R.name}.`);
		yield* this.log_message(`Injecting ${this.patient} with ${to_inject} units of ${R.name}.`);
		add_logs(this.chassis.occupant, this.patient, "injected", `${this.name} (${R} - ${to_inject} units)`);
		yield* SG.reagents.trans_id_to(this.patient, R.id, to_inject);
		yield* this.update_equip_info();
	}
	return f.dot;
}, true);

// medical_tools.dm:207
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/update_equip_info", function update_equip_info(f: Frame) {
	if (parent_proc()) {
		if (this.patient) {
			send_byjax(this.chassis.occupant, "msleeper.browser", "lossinfo", this.get_patient_dam());
			send_byjax(this.chassis.occupant, "msleeper.browser", "reagents", this.get_patient_reagents());
			send_byjax(this.chassis.occupant, "msleeper.browser", "injectwith", this.get_available_reagents());
		}
		return 1;
	}
	return f.dot;
});

// medical_tools.dm:216
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.go_out();
	return f.dot;
}, true);

// medical_tools.dm:219
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/sleeper/proc/process", function* process(f: Frame) {
	let M: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.chassis.has_charge(this.energy_drain)) {
		yield* this.set_ready_state(1);
		yield* this.log_message("Deactivated.");
		yield* this.occupant_message(`${f.src} deactivated - no power.`);
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		return f.dot;
	}
	if (!(M = this.patient)) {
		return f.dot;
	}
	if (M.health > 0) {
		yield* M.adjustOxyLoss(-1);
	}
	yield* M.AdjustStun(-80);
	yield* M.AdjustKnockdown(-80);
	yield* M.AdjustUnconscious(-80);
	if (M.reagents.get_reagent_amount("epinephrine") < 5) {
		yield* M.reagents.add_reagent("epinephrine", 5);
	}
	yield* this.chassis.use_power(this.energy_drain);
	yield* this.update_equip_info();
	return f.dot;
}, true, { waitfor: false });

rt.type(9610, "/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun", "/obj/item/mecha_parts/mecha_equipment/medical", {
	syringes: null,
	known_reagents: null,
	processed_reagents: null,
	max_syringes: 10,
	max_volume: 75,
	synth_speed: 5,
	mode: 0,
	energy_drain: 10,
	range: 3,
	equip_cooldown: 10,
	name: "exosuit syringe gun",
	desc: "Equipment for medical exosuits. A chem synthesizer with syringe gun. Reagents inside are held in stasis, so no reactions will occur.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "syringegun",
	origin_tech: "materials=3;biotech=4;magnets=4",
});

// medical_tools.dm:264
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(this.max_volume);
	this.reagents.set_reacting(0);
	this.syringes = (yield* new_(T("/list")));
	this.known_reagents = rt.alist(f, ["epinephrine", "Epinephrine", "charcoal", "Charcoal"]);
	this.processed_reagents = (yield* new_(T("/list")));
	return f.dot;
}, true);

// medical_tools.dm:272
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/detach", function* detach(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

// medical_tools.dm:276
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/Destroy", function* Destroy(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	return (yield* parent_proc());
}, true);

// medical_tools.dm:280
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/critfail", function critfail(f: Frame) {
	parent_proc();
	if (!this.reagents) return f.dot;
	this.reagents.set_reacting(1);
	return f.dot;
});

// medical_tools.dm:285
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/medical"))) {
			return 1;
		}
	}
	return 0;
}, false);

// medical_tools.dm:291
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null;
	let $0: any, $1: any, $2: any;
	if (output = parent_proc()) {
		$0 = output;
		$1 = f.src;
		if (this.mode) {

			$2 = "Analyze";
		} else {
			$2 = "Launch";
		}
		return fmt("＀ [<a href=\"?src=＃;toggle_mode=1\">＀</a>]<br />[Syringes: ＀/＀ | Reagents: ＀/＀]<br /><a href='?src=＃;show_reagents=1'>Reagents list</a>", [$0, $1, $2, rt.len(f, this.syringes), this.max_syringes, this.reagents.total_volume, this.reagents.maximum_volume, f.src]);
	}
	return f.dot;
});

// medical_tools.dm:297
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action", function* action(f: Frame, target: Value) {
	let S: Value = null, mechsyringe: Value = null, i: Value = null, mobs: Value = null, M: Value = null, R: Value = null, A: Value = null;
	if (!(yield* this.action_checks(target))) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/item/weapon/reagent_containers/syringe"))) {
		return (yield* this.load_syringe(target));
	}
	if (rt.istype(target, T("/obj/item/weapon/storage"))) {
		for (S of each(target.contents, T("/obj/item/weapon/reagent_containers/syringe"))) {
			yield* this.load_syringe(S);
		}
		return f.dot;
	}
	if (this.mode) {
		return (yield* this.analyze_reagents(target));
	}
	if (!rt.len(f, this.syringes)) {
		yield* this.occupant_message("<span class=\"alert\">No syringes loaded.</span>");
		return f.dot;
	}
	if (this.reagents.total_volume <= 0) {
		yield* this.occupant_message("<span class=\"alert\">No available reagents to load syringe with.</span>");
		return f.dot;
	}
	let trg: Value = rt.getStep(f, target, 0);
	yield* (mechsyringe = rt.index(this.syringes, 1)).forceMove(rt.getStep(f, this.chassis, 0));
	yield* this.reagents.trans_to(mechsyringe, min(mechsyringe.volume, this.reagents.total_volume));
	(rt.modSrcVar(f, "syringes", mechsyringe, subtract));
	mechsyringe.icon = rt.rsc("icons/obj/chemical.dmi");
	mechsyringe.icon_state = "syringeproj";
	playsound(this.chassis, rt.rsc("sound/items/syringeproj.ogg"), 50, 1);
	yield* this.log_message(`Launched ${mechsyringe} from ${f.src}, targeting ${target}.`);
	let originaloccupant: Value = this.chassis.occupant;
	rt.spawnTail(f, 0, "/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action: spawn at game/mecha/equipment/tools/medical_tools.dm:323", target, S, trg, mechsyringe, originaloccupant, i, mobs, M, R, A);
	return 1;
}, true);

// a spawn(0) body of /obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/action: spawn at game/mecha/equipment/tools/medical_tools.dm:323", function* (f: Frame, target: Value, S: Value, trg: Value, mechsyringe: Value, originaloccupant: Value, i: Value, mobs: Value, M: Value, R: Value, A: Value) {
	f.src = null;
	i = null;
	i = 0;
	while (i < 6) {
		if (!mechsyringe) {
			break;
		}
		if (yield* step_towards(mechsyringe, trg)) {
			mobs = (yield* new_(T("/list")));
			M = null;
			for (M of each(mechsyringe.loc, T("/mob/living/carbon"))) {
				mobs += M;
			}
			if (M = safepick(mobs)) {
				R = null;
				mechsyringe.visible_message(`<span class="attack"> ${M} was hit by the syringe!</span>`);
				if (yield* M.can_inject(null, 1)) {
					if (mechsyringe.reagents) {
						A = null;
						for (A of each(mechsyringe.reagents.reagent_list, T("/datum/reagent"))) {
							R += A.id + " (";
							R += num2text(A.volume) + "),";
						}
					}
					mechsyringe.icon_state = rt.initial(f, mechsyringe, "icon_state");
					mechsyringe.icon = rt.initial(f, mechsyringe, "icon");
					yield* mechsyringe.reagents.reaction(M, 5);
					yield* mechsyringe.reagents.trans_to(M, mechsyringe.reagents.total_volume);
					yield* M.take_bodypart_damage(2);
					add_logs(originaloccupant, M, "shot", "syringegun");
				}
				break;
			} else if (mechsyringe.loc == trg) {
				mechsyringe.icon_state = rt.initial(f, mechsyringe, "icon_state");
				mechsyringe.icon = rt.initial(f, mechsyringe, "icon");
				yield* mechsyringe.update_icon();
				break;
			}
		} else {
			mechsyringe.icon_state = rt.initial(f, mechsyringe, "icon_state");
			mechsyringe.icon = rt.initial(f, mechsyringe, "icon");
			yield* mechsyringe.update_icon();
			break;
		}
		yield* sleep(1);
		i++;
	}
	return null;
});

// medical_tools.dm:363
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let filter: Value = null, m: Value = null, message: Value = null, i: Value = null, reagent: Value = null, reagent_1: Value = null;
	let $e: any;
	yield* parent_proc();
	if (yield* g.callName(f, (filter = (yield* new_(T("/datum/topic_input"), href, href_list))), "get", ["toggle_mode"])) {
		this.mode = (!this.mode ? 1 : 0);
		yield* this.update_equip_info();
		return f.dot;
	}
	if (yield* g.callName(f, filter, "get", ["select_reagents"])) {
		this.processed_reagents.len = 0;
		m = 0;
		rt.forRange(f, 0, 1, rt.len(f, this.known_reagents), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (m >= this.synth_speed) {
				break;
			}
			if ((reagent = (yield* g.callName(f, filter, "get", [`reagent_${i}`]))) && rt.isIn(f, reagent, this.known_reagents)) {
				message = `${m ? ", " : null}${rt.index(this.known_reagents, reagent)}`;
				rt.modSrcVar(f, "processed_reagents", reagent, add);
				m++;
			}
		}
		rt.endFor(f, 0);
		if (rt.len(f, this.processed_reagents)) {
			message += " added to production";
			if (!f.src.isprocessing) {
				f.src.isprocessing = 1;
				GLOB.SSobj.processing += f.src;
			}
			yield* this.occupant_message(message);
			yield* this.occupant_message("Reagent processing started.");
			yield* this.log_message("Reagent processing started.");
		}
		return f.dot;
	}
	if (yield* g.callName(f, filter, "get", ["show_reagents"])) {
		rt.op(f, "Browse", [], [this.chassis.occupant, (yield* this.get_reagents_page()), "window=msyringegun"], false);
	}
	if (yield* g.callName(f, filter, "get", ["purge_reagent"])) {
		if (reagent_1 = (yield* g.callName(f, filter, "get", ["purge_reagent"]))) {
			yield* this.reagents.del_reagent(reagent_1);
		}
		return f.dot;
	}
	if (yield* g.callName(f, filter, "get", ["purge_all"])) {
		yield* this.reagents.clear_reagents();
		return f.dot;
	}
	return f.dot;
}, true);

// medical_tools.dm:401
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_page", function get_reagents_page(f: Frame) {
	let output: Value = null;
	return (output = `<html>\n\t\t\t\t\t\t<head>\n\t\t\t\t\t\t<title>Reagent Synthesizer</title>\n\t\t\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t\t\t${"\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n"}\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\th3 {margin-bottom:2px;font-size:14px;}\n\t\t\t\t\t\t#reagents, #reagents_form {}\n\t\t\t\t\t\tform {width: 90%; margin:10px auto; border:1px dotted #999; padding:6px;}\n\t\t\t\t\t\t#submit {margin-top:5px;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<h3>Current reagents:</h3>\n\t\t\t\t\t\t<div id="reagents">\n\t\t\t\t\t\t${this.get_current_reagents()}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<h3>Reagents production:</h3>\n\t\t\t\t\t\t<div id="reagents_form">\n\t\t\t\t\t\t${this.get_reagents_form()}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>\n\t\t\t\t\t\t`);
});

// medical_tools.dm:429
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_form", function get_reagents_form(f: Frame) {
	let inputs: Value = null, output: Value = null;
	let $2: any;
	let r_list: Value = this.get_reagents_list();
	if (r_list) {
		inputs += fmt("<input type=\"hidden\" name=\"src\" value=\"＃\">", [f.src]);
		inputs += "<input type=\"hidden\" name=\"select_reagents\" value=\"1\">";
		inputs += "<input id=\"submit\" type=\"submit\" value=\"Apply settings\">";
	}
	let $0: any = (r_list || "No known reagents");
	let $1: any = inputs;
	if (r_list) {
		$2 = fmt("<span style=\"font-size:80%;\">Only the first ＀ selected reagent５ will be added to production</span>", [this.synth_speed]);
	} else {
		$2 = null;
	}
	return (output = fmt("<form action=\"byond://\" method=\"get\">\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</form>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t", [$0, $1, $2]));
});

// medical_tools.dm:445
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_reagents_list", function get_reagents_list(f: Frame) {
	let output: Value = null, i: Value = null, reagent_id: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	rt.forRange(f, 0, 1, rt.len(f, this.known_reagents), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = (reagent_id = rt.index(this.known_reagents, i));
		$1 = i;
		if (rt.isIn(f, reagent_id, this.processed_reagents)) {
			$2 = "checked=\"1\"";
		} else {
			$2 = null;
		}
		output += `<input type="checkbox" value="${$0}" name="reagent_${$1}" ${$2}> ${rt.index(this.known_reagents, reagent_id)}<br />`;
	}
	rt.endFor(f, 0);
	return output;
});

// medical_tools.dm:452
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/get_current_reagents", function get_current_reagents(f: Frame) {
	let output: Value = null, R: Value = null;
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		if (R.volume > 0) {
			output += fmt("＀: ＀ - <a href=\"?src=＃;purge_reagent=＀\">Purge Reagent</a><br />", [R, round(R.volume, 0.001), f.src, R.id]);
		}
	}
	if (output) {
		output += fmt("Total: ＀/＀ - <a href=\"?src=＃;purge_all=1\">Purge All</a>", [round(this.reagents.total_volume, 0.001), this.reagents.maximum_volume, f.src]);
	}
	return (output || "None");
});

// medical_tools.dm:460
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/load_syringe", function* load_syringe(f: Frame, S: Value) {
	let D: Value = null;
	if (rt.len(f, this.syringes) < this.max_syringes) {
		if (get_dist(f.src, S) >= 2) {
			yield* this.occupant_message("The syringe is too far away.");
			return 0;
		}
		for (D of each(S.loc, T("/obj/structure"))) {
			if (!(yield* D.CanPass(S, f.src.loc))) {
				yield* this.occupant_message("Unable to load syringe.");
				return 0;
			}
		}
		D = null;
		for (D of each(S.loc, T("/obj/machinery/door"))) {
			if (!(yield* D.CanPass(S, f.src.loc))) {
				yield* this.occupant_message("Unable to load syringe.");
				return 0;
			}
		}
		yield* S.reagents.trans_to(f.src, S.reagents.total_volume);
		yield* S.forceMove(f.src);
		rt.modSrcVar(f, "syringes", S, add);
		yield* this.occupant_message("Syringe loaded.");
		yield* this.update_equip_info();
		return 1;
	}
	yield* this.occupant_message(`The ${f.src} syringe chamber is full.`);
	return 0;
}, true);

// medical_tools.dm:482
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/analyze_reagents", function analyze_reagents(f: Frame, A: Value) {
	let R: Value = null;
	if (get_dist(f.src, A) >= 4) {
		this.occupant_message("The object is too far away.");
		return 0;
	}
	if (!A.reagents || ismob(A)) {
		this.occupant_message(`<span class="alert">No reagent info gained from ${A}.</span>`);
		return 0;
	}
	this.occupant_message("Analyzing reagents...");
	for (R of each(A.reagents.reagent_list, T("/datum/reagent"))) {
		if (R.can_synth && this.add_known_reagent(R.id, R.name)) {
			this.occupant_message(`Reagent analyzed, identified as ${R.name} and added to database.`);
			send_byjax(this.chassis.occupant, "msyringegun.browser", "reagents_form", this.get_reagents_form());
		}
	}
	this.occupant_message("Analyzis complete.");
	return 1;
});

// medical_tools.dm:497
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/add_known_reagent", function add_known_reagent(f: Frame, r_id: Value, r_name: Value) {
	if (!rt.isIn(f, r_id, this.known_reagents)) {
		rt.setAt((rt.modSrcVar(f, "known_reagents", r_id, add)), r_id, r_name);
		return 1;
	}
	return 0;
});

// medical_tools.dm:504
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/update_equip_info", function update_equip_info(f: Frame) {
	if (parent_proc()) {
		send_byjax(this.chassis.occupant, "msyringegun.browser", "reagents", this.get_current_reagents());
		send_byjax(this.chassis.occupant, "msyringegun.browser", "reagents_form", this.get_reagents_form());
		return 1;
	}
	return f.dot;
});

// medical_tools.dm:511
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	parent_proc();
	this.update_equip_info();
	return f.dot;
});

// medical_tools.dm:517
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/syringe_gun/proc/process", function* process(f: Frame) {
	let reagent: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.len(f, this.processed_reagents) || this.reagents.total_volume >= this.reagents.maximum_volume || !this.chassis.has_charge(this.energy_drain)) {
		yield* this.occupant_message("<span class=\"alert\">Reagent processing stopped.</a>");
		yield* this.log_message("Reagent processing stopped.");
		f.src.isprocessing = 0;
		GLOB.SSobj.processing -= f.src;
		return f.dot;
	}
	let amount: Value = this.synth_speed / rt.len(f, this.processed_reagents);
	for (reagent of each(this.processed_reagents)) {
		yield* this.reagents.add_reagent(reagent, amount);
		yield* this.chassis.use_power(this.energy_drain);
	}
	return f.dot;
}, true, { waitfor: false });

// medical_tools.dm:540
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 15000, "$glass", 8000, "$plasma", 3000, "$gold", 8000, "$diamond", 2000]);
	return f.dot;
});

// medical_tools.dm:543
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.medigun = (yield* new_(T("/obj/item/weapon/gun/medbeam/mech"), f.src));
	return f.dot;
}, true);

// medical_tools.dm:548
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.medigun);
	return (yield* parent_proc());
}, true);

// medical_tools.dm:552
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/process", function process(f: Frame) {
	if (parent_proc()) {
		return f.dot;
	}
	this.medigun.process();
	return f.dot;
}, false, { waitfor: false });

// medical_tools.dm:557
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/action", function* action(f: Frame, target: Value) {
	yield* this.medigun.process_fire(target, this.loc);
	return f.dot;
}, true);

// medical_tools.dm:561
rt.def("/obj/item/mecha_parts/mecha_equipment/medical/mechmedbeam/proc/detach", function* detach(f: Frame) {
	f.src.isprocessing = 0;
	GLOB.SSobj.processing -= f.src;
	yield* this.medigun.LoseTarget();
	return (yield* parent_proc());
}, true);
