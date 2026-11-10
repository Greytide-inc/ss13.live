// Based on /tg/station's code/modules/food_and_drinks/pizzabox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(9978, "/obj/item/pizzabox", "/obj/item", {
	open: 0,
	boxtag: "",
	boxes: null,
	pizza: null,
	bomb: null,
	bomb_active: 0,
	bomb_defused: 1,
	bomb_timer: 1,
	BOMB_TIMER_MIN: 1,
	BOMB_TIMER_MAX: 10,
	item_state: "pizzabox",
	name: "pizza box",
	desc: "A box suited for pizzas.",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "pizzabox1",
}, { const: ["BOMB_TIMER_MIN","BOMB_TIMER_MAX"] });

// pizzabox.dm:18
rt.def("/obj/item/pizzabox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boxes = list();
	return f.dot;
});

// pizzabox.dm:30
rt.def("/obj/item/pizzabox/proc/New", function* New(f: Frame) {
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

// pizzabox.dm:34
rt.def("/obj/item/pizzabox/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.unprocess();
	return (yield* parent_proc());
}, true);

// pizzabox.dm:39
rt.def("/obj/item/pizzabox/proc/update_icon", function update_icon(f: Frame) {
	let box: Value = null, pizza_overlay: Value = null, bomb_overlay: Value = null, tag_overlay: Value = null;
	this.desc = rt.initial(f, this, "desc");
	if (this.open) {
		if (this.pizza) {
			this.desc = fmt("＀ It appears to have ＇！ inside. Use your other hand to take it out.", [this.desc, this.pizza]);
		}
		if (this.bomb) {
			this.desc = fmt("＀ Wait, what?! It has ＇！ inside!", [this.desc, this.bomb]);
			if (this.bomb_defused) {
				this.desc = `${this.desc} The bomb seems inert. Use your other hand to activate it.`;
			}
			if (this.bomb_active) {
				this.desc = `${this.desc} It looks like it's about to go off!`;
			}
		}
	} else {
		box = rt.len(f, this.boxes) ? rt.index(this.boxes, rt.len(f, this.boxes)) : this;
		if (rt.len(f, this.boxes)) {
			this.desc = `A pile of boxes suited for pizzas. There appears to be ${rt.len(f, this.boxes) + 1} boxes in the pile.`;
		}
		if (box.boxtag != "") {
			this.desc = `${this.desc} The ${rt.len(f, this.boxes) ? "top box" : "box"}'s tag reads: ${box.boxtag}`;
		}
	}
	this.cut_overlays();
	if (this.open) {
		this.icon_state = "pizzabox_open";
		if (this.pizza) {
			this.icon_state = "pizzabox_messy";
			(pizza_overlay = mutable_appearance(this.pizza.icon, this.pizza.icon_state)).pixel_y = -3;
			this.add_overlay(pizza_overlay);
		}
		if (this.bomb) {
			this.bomb.icon_state = `pizzabomb_${this.bomb_active ? "active" : "inactive"}`;
			(bomb_overlay = mutable_appearance(this.bomb.icon, this.bomb.icon_state)).pixel_y = 5;
			this.add_overlay(bomb_overlay);
		}
	} else {
		this.icon_state = `pizzabox${rt.len(f, this.boxes) + 1}`;
		if ((box = rt.len(f, this.boxes) ? rt.index(this.boxes, rt.len(f, this.boxes)) : this).boxtag == "") return f.dot;
		(tag_overlay = mutable_appearance(this.icon, "pizzabox_tag")).pixel_y = rt.len(f, this.boxes) * 3;
		this.add_overlay(tag_overlay);
	}
	return f.dot;
});

// pizzabox.dm:79
rt.def("/obj/item/pizzabox/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (rt.len(f, this.boxes) > 0) {
		return f.dot;
	}
	this.open = (!this.open ? 1 : 0);
	if (this.open && !this.bomb_defused) {
		this.audible_message(`<span class='warning'>${bicon(this)} *beep*</span>`);
		this.bomb_active = 1;
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	}
	this.update_icon();
	return f.dot;
});

// pizzabox.dm:89
rt.def("/obj/item/pizzabox/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let message: Value = null, topbox: Value = null;
	if (user.get_inactive_held_item() != this) {
		yield* parent_proc();
		return f.dot;
	}
	if (this.open) {
		if (this.pizza) {
			yield* user.put_in_hands(this.pizza);
			to_chat(user, `<span class='notice'>You take ${this.pizza} out of ${this}.</span>`);
			this.pizza = null;
			yield* this.update_icon();
			return f.dot;
		} else if (this.bomb) {
			if (this.wires.is_all_cut() && this.bomb_defused) {
				yield* user.put_in_hands(this.bomb);
				to_chat(user, `<span class='notice'>You carefully remove the ${this.bomb} from ${this}.</span>`);
				this.bomb = null;
				yield* this.update_icon();
				return f.dot;
			} else {
				this.bomb_timer = (yield* g.op(f, "Prompt", [32], [this.bomb_timer, this.bomb, `Set the ${this.bomb} timer from ${1} to ${10}.`, user, null]));
				this.bomb_timer = max(1, min(Ceiling(this.bomb_timer / 2), 10));
				this.bomb_defused = 0;
				GLOB.bombers += (message = `${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} has trapped a ${this} with ${this.bomb} set to ${this.bomb_timer * 2} seconds.`);
				message_admins(message);
				log_game(`${key_name(user)} has trapped a ${this} with ${this.bomb} set to ${this.bomb_timer * 2} seconds.`);
				this.bomb.adminlog = `The ${this.bomb.name} in ${this.name} that ${key_name(user)} activated has detonated!`;
				to_chat(user, `<span class='warning'>You trap ${this} with ${this.bomb}.</span>`);
				yield* this.update_icon();
			}
			return f.dot;
		}
	} else if (rt.len(f, this.boxes)) {
		this.boxes -= (topbox = rt.index(this.boxes, rt.len(f, this.boxes)));
		yield* user.put_in_hands(topbox);
		to_chat(user, `<span class='notice'>You remove the topmost ${this.name} from the stack.</span>`);
		yield* topbox.update_icon();
		yield* this.update_icon();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// pizzabox.dm:131
rt.def("/obj/item/pizzabox/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let newbox: Value = null, _add: Value = null, box: Value = null;
	let $0: any;
	if (rt.istype(I, T("/obj/item/pizzabox"))) {
		newbox = I;
		if (!this.open && !newbox.open) {
			_add = list();
			_add += newbox;
			_add += newbox.boxes;
			if (rt.len(f, this.boxes) + 1 + rt.len(f, _add) <= 5) {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				this.boxes += _add;
				newbox.boxes.Cut();
				newbox.loc = this;
				to_chat(user, `<span class='notice'>You put ${newbox} on top of ${this}!</span>`);
				yield* newbox.update_icon();
				yield* this.update_icon();
				return f.dot;
			} else {
				to_chat(user, "<span class='notice'>The stack is dangerously high!</span>");
			}
		} else {
			$0 = user;
			to_chat($0, `<span class='notice'>Close ${this.open ? this : newbox} first!</span>`);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/pizza")) || rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/customizable/pizza"))) {
		if (this.open) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.pizza = I;
			I.loc = this;
			to_chat(user, `<span class='notice'>You put ${I} in ${this}.</span>`);
			yield* this.update_icon();
			return f.dot;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/bombcore/pizza"))) {
		if (this.open && !this.bomb) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.wires = (yield* new_(T("/datum/wires/explosive/pizza"), this));
			this.bomb = I;
			I.loc = this;
			to_chat(user, `<span class='notice'>You put ${I} in ${this}. Sneeki breeki...</span>`);
			yield* this.update_icon();
			return f.dot;
		} else if (this.bomb) {
			to_chat(user, `<span class='notice'>${this} already has a bomb in it!</span>`);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/pen"))) {
		if (!this.open) {
			if (rt.len(f, this.boxes)) {
				$0 = rt.index(this.boxes, rt.len(f, this.boxes));
			} else {
				$0 = this;
			}
			(box = $0).boxtag += (yield* stripped_input(user, `Write on ${box}'s tag:`, box, "", 30));
			to_chat(user, `<span class='notice'>You write with ${I} on ${this}.</span>`);
			yield* this.update_icon();
			return f.dot;
		}
	} else if (is_wire_tool(I)) {
		if (this.wires && this.bomb) {
			yield* this.wires.interact(user);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food"))) {
		to_chat(user, "<span class='notice'>That's not a pizza!</span>");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// pizzabox.dm:188
rt.def("/obj/item/pizzabox/proc/process", function* process(f: Frame) {
	if (this.bomb_active && !this.bomb_defused && this.bomb_timer > 0) {
		playsound(this.loc, rt.rsc("sound/items/timer.ogg"), 50, 0);
		this.bomb_timer--;
	}
	if (this.bomb_active && !this.bomb_defused && this.bomb_timer <= 0) {
		if (rt.isIn(f, this.bomb, this)) {
			yield* this.bomb.detonate();
			yield* this.unprocess();
			yield* qdel(this);
		}
	}
	if (!this.bomb_active || this.bomb_defused) {
		if (rt.isIn(f, (this.bomb_defused && this.bomb), this)) {
			yield* this.bomb.defuse();
			this.bomb_active = 0;
			yield* this.unprocess();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// pizzabox.dm:204
rt.def("/obj/item/pizzabox/proc/unprocess", function* unprocess(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* qdel(this.wires);
	this.wires = null;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(9979, "/obj/item/pizzabox/bomb", "/obj/item/pizzabox", {});

// pizzabox.dm:210
rt.def("/obj/item/pizzabox/bomb/proc/New", function* New(f: Frame) {
	let randompizza: Value = pick(typesof(T("/obj/item/weapon/reagent_containers/food/snacks/pizza")) - T("/obj/item/weapon/reagent_containers/food/snacks/pizza"));
	this.pizza = (yield* new_(randompizza, this));
	this.bomb = (yield* new_(T("/obj/item/weapon/bombcore/pizza"), this));
	this.wires = (yield* new_(T("/datum/wires/explosive/pizza"), this));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9980, "/obj/item/pizzabox/margherita", "/obj/item/pizzabox", {});

// pizzabox.dm:217
rt.def("/obj/item/pizzabox/margherita/proc/New", function* New(f: Frame) {
	this.pizza = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pizza/margherita"), this));
	this.boxtag = "Margherita Deluxe";
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9981, "/obj/item/pizzabox/vegetable", "/obj/item/pizzabox", {});

// pizzabox.dm:222
rt.def("/obj/item/pizzabox/vegetable/proc/New", function* New(f: Frame) {
	this.pizza = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pizza/vegetable"), this));
	this.boxtag = "Gourmet Vegatable";
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9982, "/obj/item/pizzabox/mushroom", "/obj/item/pizzabox", {});

// pizzabox.dm:227
rt.def("/obj/item/pizzabox/mushroom/proc/New", function* New(f: Frame) {
	this.pizza = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pizza/mushroom"), this));
	this.boxtag = "Mushroom Special";
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9983, "/obj/item/pizzabox/meat", "/obj/item/pizzabox", {});

// pizzabox.dm:232
rt.def("/obj/item/pizzabox/meat/proc/New", function* New(f: Frame) {
	this.pizza = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/pizza/meat"), this));
	this.boxtag = "Meatlover's Supreme";
	yield* parent_proc();
	return f.dot;
}, true);
