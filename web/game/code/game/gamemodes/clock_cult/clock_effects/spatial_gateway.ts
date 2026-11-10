// Based on /tg/station's code/game/gamemodes/clock_cult/clock_effects/spatial_gateway.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(11422, "/obj/effect/clockwork/spatial_gateway", "/obj/effect/clockwork", {
	sender: 1,
	both_ways: 0,
	lifetime: 25,
	uses: 1,
	linked_gateway: null,
	timerid: null,
	clockwork_desc: "A gateway in reality.",
	light_range: 2,
	light_power: 3,
	light_color: "#6A4D2F",
	name: "spatial gateway",
	desc: "A gently thrumming tear in reality.",
	icon_state: "spatial_gateway",
	density: 1,
});

// spatial_gateway.dm:19
rt.def("/obj/effect/clockwork/spatial_gateway/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/clockwork/spatial_gateway/proc/check_setup"))), 1);
	return f.dot;
}, true);

// spatial_gateway.dm:23
rt.def("/obj/effect/clockwork/spatial_gateway/proc/Destroy", function* Destroy(f: Frame) {
	yield* deltimer(this.timerid);
	return (yield* parent_proc());
}, true);

// spatial_gateway.dm:27
rt.def("/obj/effect/clockwork/spatial_gateway/proc/check_setup", function* check_setup(f: Frame) {
	if (!this.linked_gateway) {
		yield* qdel(this);
		return f.dot;
	}
	if (this.both_ways) {
		this.clockwork_desc = "A gateway in reality. It can both send and receive objects.";
	} else {
		this.clockwork_desc = `A gateway in reality. It can only ${this.sender ? "send" : "receive"} objects.`;
	}
	this.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), this.lifetime, 8));
	return f.dot;
}, true);

// spatial_gateway.dm:38
rt.def("/obj/effect/clockwork/spatial_gateway/proc/setup_gateway", function setup_gateway(f: Frame, gatewayB: Value, set_duration: Value, set_uses: Value, two_way: Value) {
	if (!gatewayB || !set_duration || !this.uses) {
		return 0;
	}
	this.linked_gateway = gatewayB;
	gatewayB.linked_gateway = this;
	if (two_way) {
		this.both_ways = 1;
		gatewayB.both_ways = 1;
	} else {
		this.sender = 1;
		gatewayB.sender = 0;
		gatewayB.density = 0;
	}
	this.lifetime = set_duration;
	gatewayB.lifetime = set_duration;
	this.uses = set_uses;
	gatewayB.uses = set_uses;
	return 1;
});

// spatial_gateway.dm:56
rt.def("/obj/effect/clockwork/spatial_gateway/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, `<span class='brass'>It has ${this.uses} uses remaining.</span>`);
	return f.dot;
}, false);

// spatial_gateway.dm:62
rt.def("/obj/effect/clockwork/spatial_gateway/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (this.linked_gateway) {
		yield* user.forceMove(rt.getStep(f, this.linked_gateway, 0));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// spatial_gateway.dm:66
rt.def("/obj/effect/clockwork/spatial_gateway/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null;
	if (!this.uses) {
		return 0;
	}
	if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		if ((L = user.pulling).buckled || L.anchored || L.has_buckled_mobs()) {
			return 0;
		}
		user.visible_message(`<span class='warning'>${user} shoves ${L} into ${this}!</span>`, `<span class='danger'>You shove ${L} into ${this}!</span>`);
		yield* user.stop_pulling();
		yield* this.pass_through_gateway(L);
		return 1;
	}
	if (!user.canUseTopic(this)) {
		return 0;
	}
	user.visible_message(`<span class='warning'>${user} climbs through ${this}!</span>`, `<span class='danger'>You brace yourself and step through ${this}...</span>`);
	yield* this.pass_through_gateway(user);
	return 1;
}, true);

// spatial_gateway.dm:83
rt.def("/obj/effect/clockwork/spatial_gateway/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/nullrod"))) {
		user.visible_message(`<span class='warning'>${user} dispels ${this} with ${I}!</span>`, `<span class='danger'>You close ${this} with ${I}!</span>`);
		yield* qdel(this.linked_gateway);
		yield* qdel(this);
		return 1;
	}
	if (rt.istype(I, T("/obj/item/clockwork/slab"))) {
		to_chat(user, "<span class='heavy_brass'>\"I don't think you want to drop your slab into that.\"\n\"If you really want to, try throwing it.\"</span>");
		return 1;
	}
	if ((yield* user.drop_item()) && this.uses) {
		user.visible_message(`<span class='warning'>${user} drops ${I} into ${this}!</span>`, `<span class='danger'>You drop ${I} into ${this}!</span>`);
		yield* this.pass_through_gateway(I, 1);
		return 1;
	}
	return (yield* parent_proc());
}, true);

// spatial_gateway.dm:98
rt.def("/obj/effect/clockwork/spatial_gateway/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	if (severity == 1 && this.uses) {
		this.uses = 0;
		this.visible_message(`<span class='warning'>${this} is disrupted!</span>`);
		rt.op(f, "Animate", [2, 10], [null, this, "alpha", 0, "transform", matrix() * 2, "time", 10, "flags", 1]);
		yield* deltimer(this.timerid);
		this.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8));
		this.linked_gateway.uses = 0;
		this.linked_gateway.visible_message(`<span class='warning'>${this.linked_gateway} is disrupted!</span>`);
		rt.op(f, "Animate", [2, 10], [null, this.linked_gateway, "alpha", 0, "transform", matrix() * 2, "time", 10, "flags", 1]);
		yield* deltimer(this.linked_gateway.timerid);
		this.linked_gateway.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this.linked_gateway)), 10, 8));
		return 1;
	}
	return 0;
}, true, { waitfor: false });

// spatial_gateway.dm:113
rt.def("/obj/effect/clockwork/spatial_gateway/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	yield* parent_proc();
	if (!(A && !(!A || A.gc_destroyed))) return f.dot;
	yield* this.pass_through_gateway(A);
	return f.dot;
}, true);

// spatial_gateway.dm:118
rt.def("/obj/effect/clockwork/spatial_gateway/proc/pass_through_gateway", function* pass_through_gateway(f: Frame, A: Value, no_cost: Value) {
	let user: Value = null;
	if (!this.linked_gateway) {
		yield* qdel(this);
		return 0;
	}
	if (!this.sender) {
		this.visible_message(`<span class='warning'>${A} bounces off ${this}!</span>`);
		return 0;
	}
	if (!this.uses) {
		return 0;
	}
	if (rt.istype(A, T("/mob/living"))) {
		to_chat((user = A), `<span class='warning'><b>You pass through ${this} and appear elsewhere!</b></span>`);
	}
	this.linked_gateway.visible_message(`<span class='warning'>A shape appears in ${this.linked_gateway} before emerging!</span>`);
	playsound(this, rt.rsc("sound/effects/empulse.ogg"), 50, 1);
	playsound(this.linked_gateway, rt.rsc("sound/effects/empulse.ogg"), 50, 1);
	this.transform = matrix() * 1.5;
	rt.op(f, "Animate", [2, 8], [null, this, "transform", matrix() / 1.5, "time", 10, "flags", 1]);
	this.linked_gateway.transform = matrix() * 1.5;
	rt.op(f, "Animate", [2, 8], [null, this.linked_gateway, "transform", matrix() / 1.5, "time", 10, "flags", 1]);
	yield* A.forceMove(rt.getStep(f, this.linked_gateway, 0));
	if (!no_cost) {
		this.uses = max(0, this.uses - 1);
		this.linked_gateway.uses = max(0, this.linked_gateway.uses - 1);
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/clockwork/spatial_gateway/proc/check_uses"))), 10);
	return 1;
}, true);

// spatial_gateway.dm:144
rt.def("/obj/effect/clockwork/spatial_gateway/proc/check_uses", function* check_uses(f: Frame) {
	if (this.uses) return f.dot;
	yield* qdel(this);
	yield* qdel(this.linked_gateway);
	return f.dot;
}, true);

// spatial_gateway.dm:150
rt.def("/atom/movable/proc/procure_gateway", function* procure_gateway(f: Frame, invoker: Value, time_duration: Value, gateway_uses: Value, two_way: Value) {
	let O: Value = null, A: Value = null, locname: Value = null, L: Value = null, L_4: Value = null, issrcobelisk: Value = null, CO: Value = null, efficiency: Value = null;
	let $2: any, $6: any, $e: any;
	let possible_targets: Value = list();
	let teleportnames: Value = list();
	for (O of each(GLOB.all_clockwork_objects, T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"))) {
		if (!O.Adjacent(invoker) && O != this && O.z <= ZLEVEL_SPACEMAX && O.anchored) {
			A = get_area(O);
			locname = rt.initial(f, A, "name");
			rt.setAt(possible_targets, avoid_assoc_duplicate_keys(`${locname} ${O.name}`, teleportnames), O);
		}
	}
	for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (!L.stat && is_servant_of_ratvar(L) && !L.Adjacent(invoker) && L.z <= ZLEVEL_SPACEMAX) {
			rt.setAt(possible_targets, avoid_assoc_duplicate_keys(`${L.name} (${L.real_name})`, teleportnames), L);
		}
	}
	if (!rt.len(f, possible_targets)) {
		to_chat(invoker, "<span class='warning'>There are no other eligible targets for a Spatial Gateway!</span>");
		return 0;
	}
	let input_target_key: Value = (yield* g.op(f, "Prompt", [1], [null, "Spatial Gateway", "Choose a target to form a rift to.", invoker, possible_targets]));
	let target: Value = rt.index(possible_targets, input_target_key);
	if (!this || !input_target_key || !invoker || !invoker.canUseTopic(this, (!rt.istype(invoker, T("/mob/living/silicon")) ? 1 : 0)) || !is_servant_of_ratvar(invoker) || rt.istype(this, T("/obj/item")) && invoker.get_active_held_item() != this || !invoker.can_speak_vocal()) {
		return 0;
	}
	if (!target) {
		to_chat(invoker, "<span class='warning'>That target no longer exists!</span>");
		return (yield* this.procure_gateway(invoker, time_duration, gateway_uses, two_way));
	}
	if (rt.istype(target, T("/mob/living"))) {
		if (!is_servant_of_ratvar((L_4 = target))) {
			to_chat(invoker, "<span class='warning'>That target is no longer a Servant!</span>");
			return (yield* this.procure_gateway(invoker, time_duration, gateway_uses, two_way));
		}
		if (L_4.stat != 0) {
			to_chat(invoker, "<span class='warning'>That Servant is no longer conscious!</span>");
			return (yield* this.procure_gateway(invoker, time_duration, gateway_uses, two_way));
		}
	}
	let istargetobelisk: Value = (rt.istype(target, T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk")) ? 1 : 0);
	if (issrcobelisk = (rt.istype(this, T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk")) ? 1 : 0)) {
		if (!this.anchored) {
			to_chat(invoker, `<span class='warning'>${this} is no longer secured!</span>`);
			return 0;
		}
		if ((CO = this).active) {
			to_chat(invoker, `<span class='warning'>${this} is now sustaining a gateway!</span>`);
			return 0;
		}
	}
	if (istargetobelisk) {
		if (!target.anchored) {
			to_chat(invoker, `<span class='warning'>That ${target.name} is no longer secured!</span>`);
			return (yield* this.procure_gateway(invoker, time_duration, gateway_uses, two_way));
		}
		if ((CO = target).active) {
			to_chat(invoker, `<span class='warning'>That ${target.name} is sustaining a gateway, and cannot receive another!</span>`);
			return (yield* this.procure_gateway(invoker, time_duration, gateway_uses, two_way));
		}
		efficiency = CO.get_efficiency_mod();
		gateway_uses = round(gateway_uses * (2 * efficiency), 1);
		time_duration = round(time_duration * (2 * efficiency), 1);
		CO.active = 1;
	}
	let $0: any = invoker;
	let $1: any = `<span class='warning'>The air in front of ${invoker} ripples before suddenly tearing open!</span>`;
	if (two_way) {
		$2 = "two-way";
	} else {
		$2 = "one-way";
	}
	let $3: any = input_target_key;
	let $4: any = time_duration / 10;
	let $5: any = gateway_uses;
	if (gateway_uses > 1) {
		$6 = "s";
	} else {
		$6 = "";
	}
	$0.visible_message($1, `<span class='brass'>With a word, you rip open a ${$2} rift to ${$3}. It will last for ${$4} seconds and has ${$5} use${$6}.</span>`);
	if (issrcobelisk) {
		$0 = rt.getStep(f, this, 0);
	} else {
		$0 = rt.getStep(f, rt.getStep(f, invoker, 0), invoker.dir);
	}
	let S1: Value = (yield* new_(T("/obj/effect/clockwork/spatial_gateway"), $0));
	if (istargetobelisk) {
		$0 = rt.getStep(f, target, 0);
	} else {
		$0 = rt.getStep(f, rt.getStep(f, target, 0), target.dir);
	}
	let S2: Value = (yield* new_(T("/obj/effect/clockwork/spatial_gateway"), $0));
	S1.setup_gateway(S2, time_duration, gateway_uses, two_way);
	S2.visible_message(`<span class='warning'>The air in front of ${target} ripples before suddenly tearing open!</span>`);
	return 1;
}, true);
