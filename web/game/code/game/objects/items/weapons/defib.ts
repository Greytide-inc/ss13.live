// Based on /tg/station's code/game/objects/items/weapons/defib.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7152, "/obj/item/weapon/defibrillator", "/obj/item/weapon", {
	on: 0,
	safety: 1,
	powered: 0,
	paddles: null,
	cell: null,
	combat: 0,
	grab_ghost: 0,
	name: "defibrillator",
	desc: "A device that delivers powerful shocks to detachable paddles that resuscitate incapacitated patients.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibunit",
	item_state: "defibunit",
	slot_flags: 1024,
	force: 5,
	throwforce: 6,
	w_class: 4,
	origin_tech: "biotech=4",
	actions_types: null,
	armor: null,
});

// defib.dm:15
rt.def("/obj/item/weapon/defibrillator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_paddles"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// defib.dm:30
rt.def("/obj/item/weapon/defibrillator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.paddles = (yield* this.make_paddles());
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(7153, "/obj/item/weapon/defibrillator/loaded", "/obj/item/weapon/defibrillator", {});

// defib.dm:36
rt.def("/obj/item/weapon/defibrillator/loaded/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.paddles = (yield* this.make_paddles());
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/high"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:43
rt.def("/obj/item/weapon/defibrillator/proc/update_icon", function update_icon(f: Frame) {
	this.update_power();
	this.update_overlays();
	this.update_charge();
	return f.dot;
});

// defib.dm:49
rt.def("/obj/item/weapon/defibrillator/proc/update_power", function update_power(f: Frame) {
	if (this.cell) {
		if (this.cell.charge < this.paddles.revivecost) {
			this.powered = 0;
		} else {
			this.powered = 1;
		}
	} else {
		this.powered = 0;
	}
	return f.dot;
});

// defib.dm:57
rt.def("/obj/item/weapon/defibrillator/proc/update_overlays", function update_overlays(f: Frame) {
	this.cut_overlays();
	if (!this.on) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}-paddles`);
	}
	if (this.powered) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}-powered`);
	}
	if (!this.cell) {
		this.add_overlay(`${rt.initial(f, this, "icon_state")}-nocell`);
	}
	if (this.safety) return f.dot;
	this.add_overlay(`${rt.initial(f, this, "icon_state")}-emagged`);
	return f.dot;
});

// defib.dm:70
rt.def("/obj/item/weapon/defibrillator/proc/update_charge", function update_charge(f: Frame) {
	let ratio: Value = null;
	if (!this.powered) return f.dot;
	if (!this.cell) return f.dot;
	ratio = Ceiling((ratio = this.cell.charge / this.cell.maxcharge) * 4) * 25;
	this.add_overlay(`${rt.initial(f, this, "icon_state")}-charge${ratio}`);
	return f.dot;
});

// defib.dm:75
rt.def("/obj/item/weapon/defibrillator/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	yield* parent_proc();
	this.cell = rt.locateIn(f, T("/obj/item/weapon/stock_parts/cell"), this.contents);
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:80
rt.def("/obj/item/weapon/defibrillator/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.toggle_paddles();
	return f.dot;
}, true);

// defib.dm:83
rt.def("/obj/item/weapon/defibrillator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user) {
		if (this.slot_flags == SLOT_BACK) {
			if (user.get_item_by_slot(slot_back) == this) {
				yield* this.ui_action_click();
			} else {
				to_chat(user, "<span class='warning'>Put the defibrillator on your back first!</span>");
			}
		} else if (this.slot_flags == SLOT_BELT) {
			if (user.get_item_by_slot(slot_belt) == this) {
				yield* this.ui_action_click();
			} else {
				to_chat(user, "<span class='warning'>Strap the defibrillator's belt on first!</span>");
			}
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// defib.dm:99
rt.def("/obj/item/weapon/defibrillator/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null;
	if (!ismob(this.loc)) return f.dot;
	if (!(!(M = this.loc).incapacitated() && rt.istype(over_object, T("/obj/screen/inventory/hand")))) return f.dot;
	let H: Value = over_object;
	yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	return f.dot;
}, true);

// defib.dm:106
rt.def("/obj/item/weapon/defibrillator/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	if (W == this.paddles) {
		yield* this.paddles.unwield();
		yield* this.toggle_paddles();
	} else if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) {
		C = W;
		if (this.cell) {
			to_chat(user, `<span class='notice'>${this} already has a cell.</span>`);
		} else {
			if (C.maxcharge < this.paddles.revivecost) {
				to_chat(user, `<span class='notice'>${this} requires a higher capacity cell.</span>`);
				return f.dot;
			}
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.cell = W;
			to_chat(user, `<span class='notice'>You install a cell in ${this}.</span>`);
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.cell) {
			yield* this.cell.update_icon();
			yield* this.cell.forceMove(rt.getStep(f, this, 0));
			this.cell = null;
			to_chat(user, `<span class='notice'>You remove the cell from ${this}.</span>`);
			yield* this.update_icon();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// defib.dm:136
rt.def("/obj/item/weapon/defibrillator/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.safety) {
		this.safety = 0;
		to_chat(user, `<span class='warning'>You silently disable ${this}'s safety protocols with the cryptographic sequencer.`);
	} else {
		this.safety = 1;
		to_chat(user, `<span class='notice'>You silently enable ${this}'s safety protocols with the cryptographic sequencer.`);
	}
	return f.dot;
});

// defib.dm:143
rt.def("/obj/item/weapon/defibrillator/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.cell) {
		yield* this.deductcharge(1000 / severity);
	}
	if (this.safety) {
		this.safety = 0;
		this.visible_message(`<span class='notice'>${this} beeps: Safety protocols disabled!</span>`);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_saftyOff.ogg"), 50, 0);
	} else {
		this.safety = 1;
		this.visible_message(`<span class='notice'>${this} beeps: Safety protocols enabled!</span>`);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_SaftyOn.ogg"), 50, 0);
	}
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

// defib.dm:158
rt.def("/obj/item/weapon/defibrillator/proc/toggle_paddles", function* toggle_paddles(f: Frame) {
	let X: Value = null, A: Value = null;
	this.on = (!this.on ? 1 : 0);
	let user: Value = f.usr;
	if (this.on) {
		if (!(yield* f.usr.put_in_hands(this.paddles))) {
			this.on = 0;
			to_chat(user, "<span class='warning'>You need a free hand to hold the paddles!</span>");
			yield* this.update_icon();
			return f.dot;
		}
		this.paddles.loc = user;
	} else {
		yield* this.paddles.unwield();
		yield* this.remove_paddles(user);
	}
	yield* this.update_icon();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true, { verb: { name: "Toggle Paddles", category: "Object" } });

// defib.dm:180
rt.def("/obj/item/weapon/defibrillator/proc/make_paddles", function* make_paddles(f: Frame) {
	return (yield* new_(T("/obj/item/weapon/twohanded/shockpaddles"), this));
}, true);

// defib.dm:183
rt.def("/obj/item/weapon/defibrillator/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (!(this.slot_flags == SLOT_BACK && slot != slot_back || this.slot_flags == SLOT_BELT && slot != slot_belt)) return f.dot;
	yield* this.remove_paddles(user);
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:189
rt.def("/obj/item/weapon/defibrillator/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != user.getBackSlot()) return f.dot;
	return 1;
});

// defib.dm:193
rt.def("/obj/item/weapon/defibrillator/proc/remove_paddles", function* remove_paddles(f: Frame, user: Value) {
	let M: Value = null;
	if (ismob(this.paddles.loc)) {
		yield* (M = this.paddles.loc).dropItemToGround(this.paddles, 1);
	}
	return f.dot;
}, true);

// defib.dm:200
rt.def("/obj/item/weapon/defibrillator/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	if (this.on) {
		yield* this.remove_paddles((M = get(this.paddles, T("/mob"))));
	}
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:207
rt.def("/obj/item/weapon/defibrillator/proc/deductcharge", function* deductcharge(f: Frame, chrgdeductamt: Value) {
	if (!this.cell) return f.dot;
	if (this.cell.charge < this.paddles.revivecost + chrgdeductamt) {
		this.powered = 0;
		yield* this.update_icon();
	}
	if (yield* this.cell.use(chrgdeductamt)) {
		yield* this.update_icon();
		return 1;
	} else {
		yield* this.update_icon();
		return 0;
	}
}, true);

// defib.dm:218
rt.def("/obj/item/weapon/defibrillator/proc/cooldowncheck", function cooldowncheck(f: Frame, user: Value) {
	rt.spawnTail(f, 50, "/obj/item/weapon/defibrillator/proc/cooldowncheck: spawn at game/objects/items/weapons/defib.dm:218", user);
	return f.dot;
});

// a spawn(50) body of /obj/item/weapon/defibrillator/proc/cooldowncheck, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/defibrillator/proc/cooldowncheck: spawn at game/objects/items/weapons/defib.dm:218", function* (f: Frame, user: Value) {
	if (this.cell) {
		if (this.cell.charge >= this.paddles.revivecost) {
			user.visible_message(`<span class='notice'>${this} beeps: Unit ready.</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_ready.ogg"), 50, 0);
		} else {
			user.visible_message(`<span class='notice'>${this} beeps: Charge depleted.</span>`);
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
		}
	}
	this.paddles.cooldown = 0;
	yield* this.paddles.update_icon();
	yield* this.update_icon();
	return null;
});

rt.type(7154, "/obj/item/weapon/defibrillator/compact", "/obj/item/weapon/defibrillator", {
	name: "compact defibrillator",
	desc: "A belt-equipped defibrillator that can be rapidly deployed.",
	icon_state: "defibcompact",
	item_state: "defibcompact",
	w_class: 3,
	slot_flags: 512,
	origin_tech: "biotech=5",
});

// defib.dm:240
rt.def("/obj/item/weapon/defibrillator/compact/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != user.getBeltSlot()) return f.dot;
	return 1;
});

rt.type(7155, "/obj/item/weapon/defibrillator/compact/loaded", "/obj/item/weapon/defibrillator/compact", {});

// defib.dm:244
rt.def("/obj/item/weapon/defibrillator/compact/loaded/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.paddles = (yield* this.make_paddles());
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/high"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(7157, "/obj/item/weapon/defibrillator/compact/combat/loaded", "/obj/item/weapon/defibrillator/compact/combat", {});

// defib.dm:256
rt.def("/obj/item/weapon/defibrillator/compact/combat/loaded/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.paddles = (yield* this.make_paddles());
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/infinite"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:262
rt.def("/obj/item/weapon/defibrillator/compact/combat/loaded/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W != this.paddles) return f.dot;
	yield* this.paddles.unwield();
	yield* this.toggle_paddles();
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(5619, "/obj/item/weapon/twohanded/shockpaddles", "/obj/item/weapon/twohanded", {
	revivecost: 1000,
	cooldown: 0,
	busy: 0,
	defib: null,
	req_defib: 1,
	combat: 0,
	grab_ghost: 0,
	name: "defibrillator paddles",
	desc: "A pair of plastic-gripped paddles with flat metal surfaces that are used to deliver powerful electric shocks.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibpaddles",
	item_state: "defibpaddles",
	force: 0,
	throwforce: 6,
	w_class: 4,
});

// defib.dm:289
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/recharge", function* recharge(f: Frame, time: Value) {
	let _T: Value = null;
	if (this.req_defib || !time) {
		return f.dot;
	}
	this.cooldown = 1;
	yield* this.update_icon();
	yield* sleep(time);
	(_T = rt.getStep(f, this, 0)).audible_message(`<span class='notice'>${this} beeps: Unit is recharged.</span>`);
	playsound(_T, rt.rsc("sound/machines/defib_ready.ogg"), 50, 0);
	this.cooldown = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:301
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/New", function* New(f: Frame, mainunit: Value) {
	yield* parent_proc();
	if (!((yield* this.check_defib_exists(mainunit, this)) && this.req_defib)) return f.dot;
	this.defib = mainunit;
	this.loc = this.defib;
	this.busy = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:309
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `defibpaddles${this.wielded}`;
	this.item_state = `defibpaddles${this.wielded}`;
	if (!this.cooldown) return f.dot;
	this.icon_state = `defibpaddles${this.wielded}_cooldown`;
	return f.dot;
});

// defib.dm:315
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='danger'>${user} is putting the live paddles on ${user.p_their()} chest! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	if (this.req_defib) {
		yield* this.defib.deductcharge(this.revivecost);
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1);
	return 8;
}, true);

// defib.dm:322
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/dropped", function* dropped(f: Frame, user: Value) {
	let O: Value = null;
	if (!this.req_defib) {
		return (yield* parent_proc());
	}
	if (user) {
		if (rt.istype((O = user.get_inactive_held_item()), T("/obj/item/weapon/twohanded/offhand"))) {
			yield* O.unwield();
		}
		to_chat(user, "<span class='notice'>The paddles snap back into the main unit.</span>");
		this.defib.on = 0;
		this.loc = this.defib;
		yield* this.defib.update_icon();
	}
	return (yield* this.unwield(user));
}, true);

// defib.dm:335
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/check_defib_exists", function* check_defib_exists(f: Frame, mainunit: Value, M: Value, O: Value) {
	if (!this.req_defib) {
		return 1;
	}
	if (!mainunit || !rt.istype(mainunit, T("/obj/item/weapon/defibrillator"))) {
		yield* qdel(O);
		return 0;
	} else {
		return 1;
	}
}, true);

// defib.dm:347
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (this.busy) {
		return f.dot;
	}
	if (this.req_defib && !this.defib.powered) {
		user.visible_message(`<span class='notice'>${this.defib} beeps: Unit is unpowered.</span>`);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
		return f.dot;
	}
	if (!this.wielded) {
		if (rt.istype(user, T("/mob/living/silicon/robot"))) {
			to_chat(user, "<span class='warning'>You must activate the paddles in your active module before you can use them on someone!</span>");
		} else {
			to_chat(user, "<span class='warning'>You need to wield the paddles in both hands before you can use them on someone!</span>");
		}
		return f.dot;
	}
	if (this.cooldown) {
		if (this.req_defib) {
			to_chat(user, `<span class='warning'>${this.defib} is recharging!</span>`);
		} else {
			to_chat(user, `<span class='warning'>${this} are recharging!</span>`);
		}
		return f.dot;
	}
	if (user.a_intent == "disarm") {
		yield* this.do_disarm(M, user);
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		if (this.req_defib) {
			to_chat(user, `<span class='warning'>The instructions on ${this.defib} don't mention how to revive that...</span>`);
		} else {
			to_chat(user, "<span class='warning'>You aren't sure how to revive that...</span>");
		}
		return f.dot;
	}
	let H: Value = M;
	if (user.zone_selected != "chest") {
		to_chat(user, `<span class='warning'>You need to target your patient's chest with ${this}!</span>`);
		return f.dot;
	}
	if (user.a_intent == "harm") {
		yield* this.do_harm(H, user);
		return f.dot;
	}
	if (!this.req_defib && this.grab_ghost || this.req_defib && this.defib.grab_ghost) {
		yield* H.notify_ghost_cloning("Your heart is being defibrillated!");
		yield* H.grab_ghost();
	} else if (!H.suiciding && !rt.bitAnd(H.disabilities, 128) && !H.hellbound) {
		yield* H.notify_ghost_cloning("Your heart is being defibrillated. Re-enter your corpse if you want to be revived!", { source: this });
	}
	yield* this.do_help(H, user);
	return f.dot;
}, true);

// defib.dm:395
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/do_disarm", function* do_disarm(f: Frame, M: Value, user: Value) {
	if (this.req_defib && this.defib.safety) {
		return f.dot;
	}
	if (!this.req_defib && !this.combat) {
		return f.dot;
	}
	this.busy = 1;
	M.visible_message(`<span class='danger'>${user} has touched ${M} with ${this}!</span>`, `<span class='userdanger'>${user} has touched ${M} with ${this}!</span>`);
	yield* M.adjustStaminaLoss(50);
	yield* M.Knockdown(100);
	yield* M.updatehealth();
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1);
	yield* M.emote("gasp");
	add_logs(user, M, "stunned", this);
	if (this.req_defib) {
		yield* this.defib.deductcharge(this.revivecost);
		this.cooldown = 1;
	}
	this.busy = 0;
	yield* this.update_icon();
	if (this.req_defib) {
		this.defib.cooldowncheck(user);
	} else {
		yield* this.recharge(60);
	}
	return f.dot;
}, true);

// defib.dm:419
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/do_harm", function* do_harm(f: Frame, H: Value, user: Value) {
	let _T: Value = null;
	if (this.req_defib && this.defib.safety) {
		return f.dot;
	}
	if (!this.req_defib && !this.combat) {
		return f.dot;
	}
	user.visible_message(`<span class='warning'>${user} begins to place ${this} on ${H}'s chest.</span>`, `<span class='warning'>You overcharge the paddles and begin to place them onto ${H}'s chest...</span>`);
	this.busy = 1;
	yield* this.update_icon();
	if (yield* do_after(user, 30, { target: H })) {
		user.visible_message(`<span class='notice'>${user} places ${this} on ${H}'s chest.</span>`, `<span class='warning'>You place ${this} on ${H}'s chest and begin to charge them.</span>`);
		_T = rt.getStep(f, this.defib, 0);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_charge.ogg"), 50, 0);
		if (this.req_defib) {
			_T.audible_message(fmt("<span class='warning'>＄！ lets out an urgent beep and lets out a steadily rising hum...</span>", [this.defib]));
		} else {
			user.audible_message(`<span class='warning'>${this} let out an urgent beep.</span>`);
		}
		if (yield* do_after(user, 30, { target: H })) {
			if (!H) {
				this.busy = 0;
				yield* this.update_icon();
				return f.dot;
			}
			if (H && H.stat == 2) {
				to_chat(user, `<span class='warning'>${H} is dead.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
				this.busy = 0;
				yield* this.update_icon();
				return f.dot;
			}
			user.visible_message(fmt("<span class='boldannounce'><i>＀ shocks ＀ with ％！!</span>", [user, H, this]), fmt("<span class='warning'>You shock ＀ with ％！!</span>", [H, this]));
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_zap.ogg"), 100, 1, -1);
			playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 100, 1, -1);
			yield* H.emote("scream");
			if (H.can_heartattack() && !H.undergoing_cardiac_arrest()) {
				if (!H.stat) {
					H.visible_message(`<span class='warning'>${H} thrashes wildly, clutching at their chest!</span>`, "<span class='userdanger'>You feel a horrible agony in your chest!</span>");
				}
				H.set_heartattack(1);
			}
			yield* H.apply_damage(50, "fire", "chest");
			add_logs(user, H, "overloaded the heart of", this.defib);
			yield* H.Knockdown(100);
			H.Jitter(100);
			if (this.req_defib) {
				yield* this.defib.deductcharge(this.revivecost);
				this.cooldown = 1;
			}
			this.busy = 0;
			yield* this.update_icon();
			if (!this.req_defib) {
				yield* this.recharge(60);
			}
			if (this.req_defib && this.defib.cooldowncheck(user)) {
				return f.dot;
			}
		}
	}
	this.busy = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

// defib.dm:473
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/do_help", function* do_help(f: Frame, H: Value, user: Value) {
	let tplus: Value = null, tlimit: Value = null, tloss: Value = null, total_burn: Value = null, total_brute: Value = null, carried_item: Value = null, failed: Value = null, BR: Value = null, overall_damage: Value = null, mobhealth: Value = null;
	let $0: any, $1: any, $e: any;
	user.visible_message(`<span class='warning'>${user} begins to place ${this} on ${H}'s chest.</span>`, `<span class='warning'>You begin to place ${this} on ${H}'s chest...</span>`);
	this.busy = 1;
	yield* this.update_icon();
	if (yield* do_after(user, 30, { target: H })) {
		user.visible_message(`<span class='notice'>${user} places ${this} on ${H}'s chest.</span>`, `<span class='warning'>You place ${this} on ${H}'s chest.</span>`);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_charge.ogg"), 50, 0);
		tplus = rt.worldTime(f) - H.timeofdeath;
		tlimit = 1200;
		tloss = 600;
		total_burn = 0;
		total_brute = 0;
		if (yield* do_after(user, 20, { target: H })) {
			for (carried_item of each(H.contents, T("/obj/item"))) {
				if (rt.istype(carried_item, T("/obj/item/clothing/suit/space"))) {
					if (!this.combat && !this.req_defib || this.req_defib && !this.defib.combat) {
						$0 = user;
						if (this.req_defib) {
							$1 = `${this.defib}`;
						} else {
							$1 = `${this}`;
						}
						$0.audible_message(`<span class='warning'>${$1} buzzes: Patient's chest is obscured. Operation aborted.</span>`);
						playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
						this.busy = 0;
						yield* this.update_icon();
						return f.dot;
					}
				}
			}
			if (H.stat == 2) {
				H.visible_message(`<span class='warning'>${H}'s body convulses a bit.`);
				playsound(rt.getStep(f, this, 0), "bodyfall", 50, 1);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1);
				total_brute = H.getBruteLoss();
				total_burn = H.getFireLoss();
				if (H.suiciding || rt.bitAnd(H.disabilities, 128)) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - Recovery of patient impossible. Further attempts futile.</span>`;
				} else if (H.hellbound) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - Patient's soul appears to be on another plane of existence.  Further attempts futile.</span>`;
				} else if (tplus > tlimit) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - Body has decayed for too long. Further attempts futile.</span>`;
				} else if (!H.getorgan(T("/obj/item/organ/heart"))) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - Patient's heart is missing.</span>`;
				} else if (total_burn >= 180 || total_brute >= 180) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - Severe tissue damage makes recovery of patient impossible via defibrillator. Further attempts futile.</span>`;
				} else if (H.get_ghost()) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - No activity in patient's brain. Further attempts may be successful.</span>`;
				} else if (!(BR = H.getorgan(T("/obj/item/organ/brain"))) || BR.damaged_brain) {
					if (this.req_defib) {
						$0 = `${this.defib}`;
					} else {
						$0 = `${this}`;
					}
					failed = `<span class='warning'>${$0} buzzes: Resuscitation failed - Patient's brain is missing or damaged beyond point of no return. Further attempts futile.</span>`;
				}
				if (failed) {
					user.visible_message(failed);
					playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
				} else {
					if (H.health > -50) {
						yield* H.adjustOxyLoss(H.health - -50, 0);
					} else {
						overall_damage = total_brute + total_burn + H.getToxLoss() + H.getOxyLoss();
						mobhealth = H.health;
						yield* H.adjustOxyLoss((mobhealth - -50) * (H.getOxyLoss() / overall_damage), 0);
						yield* H.adjustToxLoss((mobhealth - -50) * (H.getToxLoss() / overall_damage), 0);
						yield* H.adjustFireLoss((mobhealth - -50) * (total_burn / overall_damage), 0);
						yield* H.adjustBruteLoss((mobhealth - -50) * (total_brute / overall_damage), 0);
					}
					yield* H.updatehealth();
					$0 = user;
					if (this.req_defib) {
						$1 = `${this.defib}`;
					} else {
						$1 = `${this}`;
					}
					$0.visible_message(`<span class='notice'>${$1} pings: Resuscitation successful.</span>`);
					playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_success.ogg"), 50, 0);
					H.set_heartattack(0);
					yield* H.revive();
					yield* H.emote("gasp");
					if (tplus > tloss) {
						H.setBrainLoss(max(0, min(99, (tlimit - tplus) / tlimit * 100)));
					}
					add_logs(user, H, "revived", this.defib);
				}
				if (this.req_defib) {
					yield* this.defib.deductcharge(this.revivecost);
					this.cooldown = 1;
				}
				yield* this.update_icon();
				if (this.req_defib) {
					this.defib.cooldowncheck(user);
				} else {
					yield* this.recharge(60);
				}
			} else if (!H.getorgan(T("/obj/item/organ/heart"))) {
				$0 = user;
				if (this.req_defib) {
					$1 = `${this.defib}`;
				} else {
					$1 = `${this}`;
				}
				$0.visible_message(`<span class='warning'>${$1} buzzes: Patient's heart is missing. Operation aborted.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
			} else if (H.undergoing_cardiac_arrest()) {
				H.set_heartattack(0);
				$0 = user;
				if (this.req_defib) {
					$1 = `${this.defib}`;
				} else {
					$1 = `${this}`;
				}
				$0.visible_message(`<span class='notice'>${$1} pings: Patient's heart is now beating again.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1);
			} else {
				$0 = user;
				if (this.req_defib) {
					$1 = `${this.defib}`;
				} else {
					$1 = `${this}`;
				}
				$0.visible_message(`<span class='warning'>${$1} buzzes: Patient is not in a valid state. Operation aborted.</span>`);
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0);
			}
		}
	}
	this.busy = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(5620, "/obj/item/weapon/twohanded/shockpaddles/cyborg", "/obj/item/weapon/twohanded/shockpaddles", {
	req_defib: 0,
	name: "cyborg defibrillator paddles",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibpaddles0",
	item_state: "defibpaddles0",
});

// defib.dm:577
rt.def("/obj/item/weapon/twohanded/shockpaddles/cyborg/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if ((R = user).emagged) {
			this.combat = 1;
		} else {
			this.combat = 0;
		}
	} else {
		this.combat = 0;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
