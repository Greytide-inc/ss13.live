// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/clockwork_obelisk.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12153, "/obj/structure/destructible/clockwork/powered/clockwork_obelisk", "/obj/structure/destructible/clockwork/powered", {
	hierophant_cost: 25,
	gateway_cost: 2000,
	clockwork_desc: "A powerful obelisk that can send a message to all servants or open a gateway to a target servant or clockwork obelisk.",
	active_icon: "obelisk",
	inactive_icon: "obelisk_inactive",
	unanchored_icon: "obelisk_unwrenched",
	construction_value: 20,
	name: "clockwork obelisk",
	desc: "A large brass obelisk hanging in midair.",
	icon_state: "obelisk_inactive",
	max_integrity: 150,
	obj_integrity: 150,
	break_message: "<span class='warning'>The obelisk falls to the ground, undamaged!</span>",
	debris: null,
});

// clockwork_obelisk.dm:14
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/small"), 4, T("/obj/item/clockwork/alloy_shards/medium"), 2, T("/obj/item/clockwork/component/hierophant_ansible/obelisk"), 1]);
	return f.dot;
});

// clockwork_obelisk.dm:21
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.toggle(1);
	return f.dot;
});

// clockwork_obelisk.dm:25
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, `<span class='nzcrentr_small'>It requires <b>${this.hierophant_cost}W</b> to broadcast over the Hierophant Network, and <b>${this.gateway_cost}W</b> to open a Spatial Gateway.</span>`);
	return f.dot;
}, false);

// clockwork_obelisk.dm:31
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.active) {
		if (!silent) {
			to_chat(user, `<span class='warning'>${this} is currently sustaining a gateway!</span>`);
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// clockwork_obelisk.dm:38
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/forced_disable", function* forced_disable(f: Frame, bad_effects: Value) {
	let SG: Value = null;
	let affected: Value = 0;
	for (SG of each(this.loc, T("/obj/effect/clockwork/spatial_gateway"))) {
		yield* SG.ex_act(1);
		affected++;
	}
	if (bad_effects) {
		affected += (yield* this.try_use_power(100));
	}
	return affected;
}, true);

// clockwork_obelisk.dm:46
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null, input: Value = null;
	if (!is_servant_of_ratvar(user) || this.total_accessable_power() < this.hierophant_cost || !this.anchored) {
		to_chat(user, `<span class='warning'>You place your hand on ${this}, but it doesn't react.</span>`);
		return f.dot;
	}
	const subject = (choice = (yield* alert(user, `You place your hand on ${this}...`, null, "Hierophant Broadcast", "Spatial Gateway", "Cancel")));
	if (subject === "Hierophant Broadcast") {
		if (this.active) {
			to_chat(user, `<span class='warning'>${this} is sustaining a gateway and cannot broadcast!</span>`);
			return f.dot;
		}
		if (!user.can_speak_vocal()) {
			to_chat(user, `<span class='warning'>You cannot speak through ${this}!</span>`);
			return f.dot;
		}
		input = (yield* stripped_input(f.usr, "Please choose a message to send over the Hierophant Network.", "Hierophant Broadcast", ""));
		if (!is_servant_of_ratvar(user) || !input || !user.canUseTopic(this, (!rt.istype(user, T("/mob/living/silicon")) ? 1 : 0))) {
			return f.dot;
		}
		if (!this.anchored) {
			to_chat(user, `<span class='warning'>${this} is no longer secured!</span>`);
			return 0;
		}
		if (this.active) {
			to_chat(user, `<span class='warning'>${this} is sustaining a gateway and cannot broadcast!</span>`);
			return f.dot;
		}
		if (!user.can_speak_vocal()) {
			to_chat(user, `<span class='warning'>You cannot speak through ${this}!</span>`);
			return f.dot;
		}
		if (!(yield* this.try_use_power(this.hierophant_cost))) {
			to_chat(user, `<span class='warning'>${this} lacks the power to broadcast!</span>`);
			return f.dot;
		}
		yield* clockwork_say(user, text2ratvar(`Hierophant Broadcast, activate! ${html_decode(input)}`));
		titled_hierophant_message(user, input, "big_brass", "large_brass");
	} else if (subject === "Spatial Gateway") {
		if (this.active) {
			to_chat(user, `<span class='warning'>${this} is already sustaining a gateway!</span>`);
			return f.dot;
		}
		if (!user.can_speak_vocal()) {
			to_chat(user, "<span class='warning'>You need to be able to speak to open a gateway!</span>");
			return f.dot;
		}
		if (!(yield* this.try_use_power(this.gateway_cost))) {
			to_chat(user, `<span class='warning'>${this} lacks the power to open a gateway!</span>`);
			return f.dot;
		}
		if (yield* this.procure_gateway(user, round(100 * this.get_efficiency_mod(), 1), round(5 * this.get_efficiency_mod(), 1), 1)) {
			yield* this.process();
			if (!this.active) {
				this.active = 1;
				yield* clockwork_say(user, text2ratvar("Spatial Gateway, activate!"));
				return f.dot;
			}
		}
		yield* this.return_power(this.gateway_cost);
	}
	return f.dot;
}, true);

// clockwork_obelisk.dm:94
rt.def("/obj/structure/destructible/clockwork/powered/clockwork_obelisk/proc/process", function process(f: Frame) {
	let SG: Value = null;
	if (!this.anchored) {
		return f.dot;
	}
	if ((SG = rt.locateIn(f, T("/obj/effect/clockwork/spatial_gateway"), this.loc)) && SG.timerid) {
		this.icon_state = this.active_icon;
		this.density = 0;
		this.active = 1;
	} else {
		this.icon_state = this.inactive_icon;
		this.density = 1;
		this.active = 0;
	}
	return f.dot;
}, false, { waitfor: false });
