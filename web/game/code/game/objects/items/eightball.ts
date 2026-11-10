// Based on /tg/station's code/game/objects/items/eightball.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, fmt } = rt;


rt.type(9681, "/obj/item/toy/eightball", "/obj/item/toy", {
	shaking: 0,
	on_cooldown: 0,
	shake_time: 150,
	cooldown_time: 1800,
	w_class: 1,
	verb_say: "rattles",
	name: "magic eightball",
	desc: "A black ball with a stenciled number eight in white on the side. It seems full of dark liquid.\nThe instructions state that you should ask your question aloud, and then shake.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "eightball",
}, { global: { possible_answers: 740 } });

// eightball.dm:40
rt.def("/obj/item/toy/eightball/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!prob(1)) return f.dot;
	yield* new_(T("/obj/item/toy/eightball/haunted"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

// eightball.dm:50
rt.def("/obj/item/toy/eightball/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let answer: Value = null;
	if (this.shaking) {
		return f.dot;
	}
	if (this.on_cooldown) {
		to_chat(user, `<span class='warning'>${this} was shaken recently, it needs time to settle.</span>`);
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} starts shaking ${this}.</span>`, `<span class='notice'>You start shaking ${this}.</span>`, "<span class='italics'>You hear shaking and sloshing.</span>");
	this.shaking = 1;
	yield* this.start_shaking(user);
	if (yield* do_after(user, this.shake_time, { needhand: 1, target: user, progress: 1 })) {
		yield* this.say((answer = this.get_answer()));
		this.on_cooldown = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/toy/eightball/proc/clear_cooldown"))), this.cooldown_time);
	}
	this.shaking = 0;
	return f.dot;
}, true);

// eightball.dm:71
rt.def("/obj/item/toy/eightball/proc/get_answer", function get_answer(f: Frame) {
	return pick(GLOB.possible_answers);
});

rt.type(9682, "/obj/item/toy/eightball/broken", "/obj/item/toy/eightball", {
	fixed_answer: null,
	name: "broken magic eightball",
	desc: "A black ball with a stenciled number eight in white on the side. It is cracked and seems empty.",
});

// eightball.dm:84
rt.def("/obj/item/toy/eightball/broken/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	this.fixed_answer = pick(GLOB.possible_answers);
	return f.dot;
}, true);

rt.type(9683, "/obj/item/toy/eightball/haunted", "/obj/item/toy/eightball", {
	last_message: null,
	selected_message: null,
	votes: null,
	flags: 16,
});

// eightball.dm:100
rt.def("/obj/item/toy/eightball/haunted/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	this.votes = list();
	(rt.modGl("poi_list", this, rt.bitOr));
	return f.dot;
}, true);

// eightball.dm:105
rt.def("/obj/item/toy/eightball/haunted/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// eightball.dm:109
rt.def("/obj/item/toy/eightball/haunted/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!this.shaking) {
		to_chat(user, `<span class='warning'>${this} is not currently being shaken.</span>`);
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// eightball.dm:115
rt.def("/obj/item/toy/eightball/haunted/proc/Hear", function Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	this.last_message = raw_message;
	return f.dot;
});

// eightball.dm:120
rt.def("/obj/item/toy/eightball/haunted/proc/start_shaking", function* start_shaking(f: Frame, user: Value) {
	this.selected_message = this.last_message;
	yield* notify_ghosts(`${user} is shaking ${this}, hoping to get an answer to "${this.selected_message}"`, { source: this, enter_link: fmt("<a href=?src=＃;interact=1>(Click to help)</a>", [this]), action: "attack" });
	return f.dot;
}, true);

// eightball.dm:124
rt.def("/obj/item/toy/eightball/haunted/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (!rt.at(href_list, "interact")) return f.dot;
	if (!rt.istype(f.usr, T("/mob/dead/observer"))) return f.dot;
	yield* this.interact(f.usr);
	return f.dot;
}, true);

// eightball.dm:129
rt.def("/obj/item/toy/eightball/haunted/proc/get_vote_tallies", function get_vote_tallies(f: Frame) {
	let ckey: Value = null, selected: Value = null;
	let answers: Value = list();
	for (ckey of each(this.votes)) {
		if (rt.isIn(f, (selected = rt.index(this.votes, ckey)), answers)) {
			rt.incAt(answers, selected, 1, true);
		} else {
			rt.setAt(answers, selected, 1);
		}
	}
	return answers;
});

// eightball.dm:141
rt.def("/obj/item/toy/eightball/haunted/proc/get_answer", function get_answer(f: Frame) {
	let most_popular_answer: Value = null, A: Value = null, amount: Value = null;
	if (!rt.len(f, this.votes)) {
		return pick(GLOB.possible_answers);
	}
	let tallied_votes: Value = this.get_vote_tallies();
	let most_amount: Value = 0;
	for (A of each(tallied_votes)) {
		if ((amount = rt.index(tallied_votes, A)) > most_amount) {
			most_popular_answer = A;
		}
	}
	return most_popular_answer;
});

// eightball.dm:161
rt.def("/obj/item/toy/eightball/haunted/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.observer_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "eightball", this.name, 400, 600, master_ui, state))).open();
	return f.dot;
}, true);

// eightball.dm:167
rt.def("/obj/item/toy/eightball/haunted/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, pa: Value = null, L: Value = null, amount: Value = null, selected: Value = null;
	rt.setAt((data = list()), "shaking", this.shaking);
	rt.setAt(data, "question", this.selected_message);
	let tallied_votes: Value = this.get_vote_tallies();
	rt.setAt(data, "answers", list());
	for (pa of each(GLOB.possible_answers)) {
		rt.setAt((L = list()), "answer", pa);
		amount = 0;
		if (rt.isIn(f, pa, tallied_votes)) {
			amount = rt.index(tallied_votes, pa);
		}
		rt.setAt(L, "amount", amount);
		selected = 0;
		if (rt.index(this.votes, user.ckey) == pa) {
			selected = 1;
		}
		rt.setAt(L, "selected", selected);
		rt.modAt(data, "answers", list(L), add);
	}
	return data;
});

// eightball.dm:190
rt.def("/obj/item/toy/eightball/haunted/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let selected_answer: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let user: Value = f.usr;
	if (action === "vote") {
		if (rt.isIn(f, (!(selected_answer = rt.at(params, "answer")) ? 1 : 0), GLOB.possible_answers)) {
			return f.dot;
		} else {
			rt.setAt(this.votes, user.ckey, selected_answer);
			f.dot = 1;
		}
	}
	return f.dot;
}, true);
