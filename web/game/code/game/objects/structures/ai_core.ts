// Based on /tg/station's code/game/objects/structures/ai_core.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12708, "/obj/structure/AIcore", "/obj/structure", {
	state: 0,
	laws: null,
	circuit: null,
	brain: null,
	anchored: 0,
	density: 1,
	name: "１AI core",
	icon: rt.rsc("icons/mob/ai.dmi"),
	icon_state: "0",
	obj_integrity: 500,
	max_integrity: 500,
});

// ai_core.dm:10
rt.def("/obj/structure/AIcore/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = new_(T("/datum/ai_laws"));
	return f.dot;
});

// ai_core.dm:15
rt.def("/obj/structure/AIcore/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.laws.set_laws_config();
	return f.dot;
}, true);

// ai_core.dm:20
rt.def("/obj/structure/AIcore/proc/Destroy", function* Destroy(f: Frame) {
	if (this.circuit) {
		yield* qdel(this.circuit);
		this.circuit = null;
	}
	if (this.brain) {
		yield* qdel(this.brain);
		this.brain = null;
	}
	return (yield* parent_proc());
}, true);

// ai_core.dm:28
rt.def("/obj/structure/AIcore/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, C: Value = null, A: Value = null, G: Value = null, module: Value = null, M: Value = null;
	if (rt.istype(f.args[0], T("/obj/item/weapon/wrench"))) {
		return (yield* this.default_unfasten_wrench(f.args[1], f.args[0], 20));
	}
	if (!this.anchored) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/weldingtool"))) {
			if (this.state != EMPTY_CORE) {
				to_chat(f.args[1], "<span class='warning'>The core must be empty to deconstruct it!</span>");
				return f.dot;
			}
			if (!(WT = f.args[0]).isOn()) {
				to_chat(f.args[1], "<span class='warning'>The welder must be on for this task!</span>");
				return f.dot;
			}
			playsound(this.loc, WT.usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You start to deconstruct the frame...</span>");
			if ((yield* do_after(f.args[1], 20 * f.args[0].toolspeed, { target: this })) && this && this.state == EMPTY_CORE && WT && (yield* WT.remove_fuel(0, f.args[1]))) {
				to_chat(f.args[1], "<span class='notice'>You deconstruct the frame.</span>");
				yield* this.deconstruct(1);
			}
			return f.dot;
		}
	} else if (this.state === EMPTY_CORE) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard/aicore"))) {
			if (!(yield* f.args[1].drop_item())) {
				return f.dot;
			}
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			to_chat(f.args[1], "<span class='notice'>You place the circuit board inside the frame.</span>");
			yield* this.update_icon();
			this.state = CIRCUIT_CORE;
			this.circuit = f.args[0];
			yield* f.args[0].forceMove(this);
			return f.dot;
		}
	} else if (this.state === CIRCUIT_CORE) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You screw the circuit board into place.</span>");
			this.state = SCREWED_CORE;
			yield* this.update_icon();
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/crowbar"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the circuit board.</span>");
			this.state = EMPTY_CORE;
			yield* this.update_icon();
			yield* this.circuit.forceMove(this.loc);
			this.circuit = null;
			return f.dot;
		}
	} else if (this.state === SCREWED_CORE) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver")) && this.circuit) {
			playsound(this.loc, f.args[0].usesound, 50, CIRCUIT_CORE);
			to_chat(f.args[1], "<span class='notice'>You unfasten the circuit board.</span>");
			this.state = CIRCUIT_CORE;
			yield* this.update_icon();
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/stack/cable_coil"))) {
			if ((C = f.args[0]).get_amount() >= 5) {
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				to_chat(f.args[1], "<span class='notice'>You start to add cables to the frame...</span>");
				if ((yield* do_after(f.args[1], 20, { target: this })) && this.state == SCREWED_CORE && (yield* C.use(5))) {
					to_chat(f.args[1], "<span class='notice'>You add cables to the frame.</span>");
					this.state = CABLED_CORE;
					yield* this.update_icon();
				}
			} else {
				to_chat(f.args[1], "<span class='warning'>You need five lengths of cable to wire the AI core!</span>");
			}
			return f.dot;
		}
	} else if (this.state === CABLED_CORE) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/wirecutters"))) {
			if (this.brain) {
				to_chat(f.args[1], `<span class='warning'>Get that ${this.brain.name} out of there first!</span>`);
			} else {
				playsound(this.loc, f.args[0].usesound, 50, 1);
				to_chat(f.args[1], "<span class='notice'>You remove the cables.</span>");
				this.state = SCREWED_CORE;
				yield* this.update_icon();
				(A = (yield* new_(T("/obj/item/stack/cable_coil"), this.loc))).amount = 5;
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/stack/sheet/rglass"))) {
			if ((G = f.args[0]).get_amount() >= 2) {
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				to_chat(f.args[1], "<span class='notice'>You start to put in the glass panel...</span>");
				if ((yield* do_after(f.args[1], 20, { target: this })) && this.state == CABLED_CORE && (yield* G.use(2))) {
					to_chat(f.args[1], "<span class='notice'>You put in the glass panel.</span>");
					this.state = GLASS_CORE;
					yield* this.update_icon();
				}
			} else {
				to_chat(f.args[1], "<span class='warning'>You need two sheets of reinforced glass to insert them into the AI core!</span>");
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/aiModule"))) {
			if (this.brain && this.brain.laws.id != "default") {
				to_chat(f.args[1], `<span class='warning'>The installed ${this.brain.name} already has set laws!</span>`);
				return f.dot;
			}
			yield* (module = f.args[0]).install(this.laws, f.args[1]);
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/device/mmi")) && !this.brain) {
			if (!(M = f.args[0]).brainmob) {
				to_chat(f.args[1], `<span class='warning'>Sticking an empty ${M.name} into the frame would sort of defeat the purpose!</span>`);
				return f.dot;
			}
			if (M.brainmob.stat == 2) {
				to_chat(f.args[1], `<span class='warning'>Sticking a dead ${M.name} into the frame would sort of defeat the purpose!</span>`);
				return f.dot;
			}
			if (!M.brainmob.client) {
				to_chat(f.args[1], `<span class='warning'>Sticking an inactive ${M.name} into the frame would sort of defeat the purpose.</span>`);
				return f.dot;
			}
			if (GLOB.config && !GLOB.config.allow_ai || jobban_isbanned(M.brainmob, "AI")) {
				to_chat(f.args[1], `<span class='warning'>This ${M.name} does not seem to fit!</span>`);
				return f.dot;
			}
			if (!M.brainmob.mind) {
				to_chat(f.args[1], `<span class='warning'>This ${M.name} is mindless!</span>`);
				return f.dot;
			}
			if (!(yield* f.args[1].drop_item())) {
				return f.dot;
			}
			yield* M.forceMove(this);
			this.brain = M;
			to_chat(f.args[1], `<span class='notice'>You add ${M.name} to the frame.</span>`);
			yield* this.update_icon();
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/crowbar")) && this.brain) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the brain.</span>");
			yield* this.brain.forceMove(this.loc);
			this.brain = null;
			yield* this.update_icon();
			return f.dot;
		}
	} else if (this.state === GLASS_CORE) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/crowbar"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the glass panel.</span>");
			this.state = CABLED_CORE;
			yield* this.update_icon();
			yield* new_(T("/obj/item/stack/sheet/rglass"), this.loc, 2);
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You connect the monitor.</span>");
			if (this.brain) {
				yield* GLOB.SSticker.mode.remove_antag_for_borging(this.brain.brainmob.mind);
				if (!rt.istype(this.brain.laws, T("/datum/ai_laws/ratvar"))) {
					yield* remove_servant_of_ratvar(this.brain.brainmob, 1);
				}
				A = (yield* new_(T("/mob/living/silicon/ai"), this.loc, this.laws, this.brain.brainmob));
				if (this.brain.force_replace_ai_name) {
					yield* A.fully_replace_character_name(A.name, this.brain.replacement_ai_name());
				}
				yield* qdel(this);
			} else {
				this.state = AI_READY_CORE;
				yield* this.update_icon();
			}
			return f.dot;
		}
	} else if (this.state === AI_READY_CORE) {
		if (rt.istype(f.args[0], T("/obj/item/device/aicard"))) {
			yield* f.args[0].transfer_ai("INACTIVE", "AICARD", this, f.args[1]);
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You disconnect the monitor.</span>");
			this.state = GLASS_CORE;
			yield* this.update_icon();
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true, { args: ["P", "user", "params"] });

// ai_core.dm:204
rt.def("/obj/structure/AIcore/proc/update_icon", function update_icon(f: Frame) {
	if (this.state === EMPTY_CORE) {
		this.icon_state = "0";
	} else if (this.state === CIRCUIT_CORE) {
		this.icon_state = "1";
	} else if (this.state === SCREWED_CORE) {
		this.icon_state = "2";
	} else if (this.state === CABLED_CORE) {
		if (this.brain) {
			this.icon_state = "3b";
		} else {
			this.icon_state = "3";
		}
	} else if (this.state === GLASS_CORE) {
		this.icon_state = "4";
	} else if (this.state === AI_READY_CORE) {
		this.icon_state = "ai-empty";
	}
	return f.dot;
});

// ai_core.dm:222
rt.def("/obj/structure/AIcore/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (this.state == GLASS_CORE) {
		yield* new_(T("/obj/item/stack/sheet/rglass"), this.loc, 2);
	}
	if (this.state >= CABLED_CORE) {
		yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 5);
	}
	if (this.circuit) {
		yield* this.circuit.forceMove(this.loc);
		this.circuit = null;
	}
	yield* new_(T("/obj/item/stack/sheet/plasteel"), this.loc, 4);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12709, "/obj/structure/AIcore/deactivated", "/obj/structure/AIcore", {
	anchored: 1,
	state: 5,
	name: "inactive AI",
	icon_state: "ai-empty",
});

// ai_core.dm:239
rt.def("/obj/structure/AIcore/deactivated/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.circuit = (yield* new_(T("/obj/item/weapon/circuitboard"), this));
	return f.dot;
}, true);

// ai_core.dm:252
rt.def("/atom/proc/transfer_ai", function transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	if (rt.istype(card, T("/obj/item/device/aicard"))) {
		if (card.flush) {
			to_chat(user, "<span class='boldannounce'>ERROR</span>: AI flush is in progress, cannot execute transfer protocol.");
			return 0;
		}
	}
	return 1;
});

// ai_core.dm:260
rt.def("/obj/structure/AIcore/proc/transfer_ai", function* transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	if (this.state != AI_READY_CORE || !(yield* parent_proc())) {
		return f.dot;
	}
	if (interaction == AI_TRANS_FROM_CARD) {
		AI.control_disabled = 0;
		AI.radio_enabled = 1;
		yield* AI.forceMove(this.loc);
		to_chat(AI, "You have been uploaded to a stationary terminal. Remote device connection restored.");
		to_chat(user, `<span class='boldnotice'>Transfer successful</span>: ${AI.name} (${rand(1000, 9999)}.exe) installed and executed successfully. Local copy has been removed.`);
		card.AI = null;
		yield* qdel(this);
	} else {
		to_chat(user, "There is no AI loaded on this terminal!");
	}
	return f.dot;
}, true);
