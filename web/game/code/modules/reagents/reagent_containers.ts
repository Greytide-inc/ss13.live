// Based on /tg/station's code/modules/reagents/reagent_containers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5799, "/obj/item/weapon/reagent_containers", "/obj/item/weapon", {
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 30,
	list_reagents: null,
	spawned_disease: null,
	disease_amount: 20,
	spillable: 0,
	name: "Container",
	desc: "...",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: null,
	w_class: 1,
});

// reagent_containers.dm:16
rt.def("/obj/item/weapon/reagent_containers/proc/Initialize", function* Initialize(f: Frame, mapload: Value, vol: Value) {
	let F: Value = null, data: Value = null;
	f.dot = (yield* parent_proc());
	if (isnum(vol) && vol > 0) {
		this.volume = vol;
	}
	yield* this.create_reagents(this.volume);
	if (this.spawned_disease) {
		F = (yield* new_(this.spawned_disease, 0));
		data = rt.alist(f, ["viruses", list(F)]);
		yield* this.reagents.add_reagent("blood", this.disease_amount, data);
	}
	yield* this.add_initial_reagents();
	return f.dot;
}, true);

// reagent_containers.dm:29
rt.def("/obj/item/weapon/reagent_containers/proc/add_initial_reagents", function* add_initial_reagents(f: Frame) {
	if (!this.list_reagents) return f.dot;
	yield* this.reagents.add_reagent_list(this.list_reagents);
	return f.dot;
}, true);

// reagent_containers.dm:32
rt.def("/obj/item/weapon/reagent_containers/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let A: Value = null;
	if (!rt.len(f, this.possible_transfer_amounts)) return f.dot;
	let i: Value = 0;
	for (A of each(this.possible_transfer_amounts)) {
		i++;
		if (A == this.amount_per_transfer_from_this) {
			if (i < rt.len(f, this.possible_transfer_amounts)) {
				this.amount_per_transfer_from_this = rt.index(this.possible_transfer_amounts, i + 1);
			} else {
				this.amount_per_transfer_from_this = rt.index(this.possible_transfer_amounts, 1);
			}
			to_chat(user, `<span class='notice'>${this}'s transfer amount is now ${this.amount_per_transfer_from_this} units.</span>`);
			return f.dot;
		}
	}
	return f.dot;
});

// reagent_containers.dm:45
rt.def("/obj/item/weapon/reagent_containers/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	if (user.a_intent != "harm") return f.dot;
	return (yield* parent_proc());
}, true);

// reagent_containers.dm:53
rt.def("/obj/item/weapon/reagent_containers/proc/reagentlist", function reagentlist(f: Frame, snack: Value) {
	let data: Value = null, R: Value = null;
	if (snack.reagents.reagent_list && rt.len(f, snack.reagents.reagent_list)) {
		for (R of each(snack.reagents.reagent_list, T("/datum/reagent"))) {
			data += `${R.id}(${R.volume} units); `;
		}
		return data;
	} else {
		return "No reagents";
	}
});

// reagent_containers.dm:60
rt.def("/obj/item/weapon/reagent_containers/proc/canconsume", function canconsume(f: Frame, eater: Value, user: Value) {
	let who: Value = null;
	if (!rt.istype(eater, T("/mob/living/carbon"))) {
		return 0;
	}
	let C: Value = eater;
	let covered: Value = "";
	if (C.is_mouth_covered({ head_only: 1 })) {
		covered = "headgear";
	} else if (C.is_mouth_covered({ mask_only: 1 })) {
		covered = "mask";
	}
	if (covered) {
		who = user === null || eater == user ? "your" : `${eater.p_their()}`;
		to_chat(user, `<span class='warning'>You have to remove ${who} ${covered} first!</span>`);
		return 0;
	}
	return 1;
});

// reagent_containers.dm:76
rt.def("/obj/item/weapon/reagent_containers/proc/ex_act", function* ex_act(f: Frame) {
	let R: Value = null;
	if (this.reagents) {
		for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
			yield* R.on_ex_act();
		}
	}
	if (!this || this.gc_destroyed) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// reagent_containers.dm:82
rt.def("/obj/item/weapon/reagent_containers/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	this.reagents.chem_temp += 30;
	yield* this.reagents.handle_reactions();
	yield* parent_proc();
	return f.dot;
}, true);

// reagent_containers.dm:87
rt.def("/obj/item/weapon/reagent_containers/proc/throw_impact", function* throw_impact(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	yield* this.SplashReagents(target, 1);
	return f.dot;
}, true, { waitfor: false });

// reagent_containers.dm:91
rt.def("/obj/item/weapon/reagent_containers/proc/SplashReagents", function* SplashReagents(f: Frame, target: Value, thrown: Value) {
	let M: Value = null, R: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	thrown ??= 0;
	if (!this.reagents || !this.reagents.total_volume || !this.spillable) {
		return f.dot;
	}
	if (ismob(target) && target.reagents) {
		if (thrown) {
			this.reagents.total_volume *= rand(5, 10) * 0.1;
		}
		M = target;
		target.visible_message(`<span class='danger'>${M} has been splashed with something!</span>`, `<span class='userdanger'>${M} has been splashed with something!</span>`);
		for (A of each(this.reagents.reagent_list, T("/datum/reagent"))) {
			R += A.id + " (";
			R += num2text(A.volume) + "),";
		}
		if (this.thrownby) {
			add_logs(this.thrownby, M, "splashed", R);
		}
		yield* this.reagents.reaction(target, TOUCH);
	} else if ((yield* target.CanPass(this, rt.getStep(f, this, 0))) && thrown && this.thrownby && this.thrownby.mind && this.thrownby.mind.assigned_role == "Bartender") {
		this.visible_message(`<span class='notice'>${this} lands onto the ${target.name} without spilling a single drop.</span>`);
		return f.dot;
	} else {
		if (isturf(target) && rt.len(f, this.reagents.reagent_list) && this.thrownby) {
			add_logs(this.thrownby, target, `splashed (thrown) ${english_list(this.reagents.reagent_list)}`, `at ${target}${`(${target.x},${target.y},${target.z})`}`);
			log_game(`${key_name(this.thrownby)} splashed (thrown) ${english_list(this.reagents.reagent_list)} at ${`(${target.x},${target.y},${target.z})`}.`);
			$0 = key_name_admin(this.thrownby);
			$1 = english_list(this.reagents.reagent_list);
			if (target) {
				$2 = `${`(${target.x},${target.y},${target.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${target.x};Y=${target.y};Z=${target.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			message_admins(`${$0} splashed (thrown) ${$1} at ${`${$2}`}.`);
		}
		this.visible_message(`<span class='notice'>${this} spills its contents all over ${target}.</span>`);
		yield* this.reagents.reaction(target, TOUCH);
		if (!this || this.gc_destroyed) {
			return f.dot;
		}
	}
	yield* this.reagents.clear_reagents();
	return f.dot;
}, true);

// reagent_containers.dm:126
rt.def("/obj/item/weapon/reagent_containers/proc/microwave_act", function* microwave_act(f: Frame, M: Value) {
	if (this.is_open_container()) {
		this.reagents.chem_temp = max(this.reagents.chem_temp, 1000);
		yield* this.reagents.handle_reactions();
	}
	yield* parent_proc();
	return f.dot;
}, true);
