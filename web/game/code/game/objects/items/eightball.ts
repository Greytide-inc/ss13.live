// From code/game/objects/items/eightball.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/toy/eightball/proc/Initialize  (code/game/objects/items/eightball.dm:40)  may sleep
rt.def("/obj/item/toy/eightball/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	yield* g.new_(f, T("/obj/item/toy/eightball/haunted"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/toy/eightball/proc/attack_self  (code/game/objects/items/eightball.dm:50)  may sleep
rt.def("/obj/item/toy/eightball/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let answer: Value = null;
	f.vars = () => [user, answer];
	if (truthy(rt.sv(f, "shaking"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on_cooldown"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ was shaken recently, it needs time to settle.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ starts shaking ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You start shaking ＀.</span>", [live(f.src)]), "<span class='italics'>You hear shaking and sloshing.</span>"]);
	rt.setSv(f, "shaking", 1);
	yield* g.srcCall(f, "start_shaking", live(user));
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "shake_time"), "needhand", 1, "target", live(user), "progress", 1], rt.Args.Named)))) {
		yield* g.srcCall(f, "say", (answer = (yield* g.srcCall(f, "get_answer"))));
		rt.setSv(f, "on_cooldown", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/toy/eightball/proc/clear_cooldown")])), rt.sv(f, "cooldown_time")]);
	}
	rt.setSv(f, "shaking", 0);
	return f.dot;
}, true);

// /obj/item/toy/eightball/proc/get_answer  (code/game/objects/items/eightball.dm:71)
rt.def("/obj/item/toy/eightball/proc/get_answer", function get_answer(f: Frame) {
	return rt.op(f, "PickUnweighted", [1], [rt.gl("possible_answers")]);
});

rt.type(9682, "/obj/item/toy/eightball/broken", "/obj/item/toy/eightball", {
	fixed_answer: null,
	name: "broken magic eightball",
	desc: "A black ball with a stenciled number eight in white on the side. It is cracked and seems empty.",
});

// /obj/item/toy/eightball/broken/proc/Initialize  (code/game/objects/items/eightball.dm:84)  may sleep
rt.def("/obj/item/toy/eightball/broken/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "fixed_answer", rt.op(f, "PickUnweighted", [1], [rt.gl("possible_answers")]));
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9683, "/obj/item/toy/eightball/haunted", "/obj/item/toy/eightball", {
	last_message: null,
	selected_message: null,
	votes: null,
	flags: 16,
});

// /obj/item/toy/eightball/haunted/proc/Initialize  (code/game/objects/items/eightball.dm:100)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "votes", rt.list());
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/toy/eightball/haunted/proc/Destroy  (code/game/objects/items/eightball.dm:105)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/toy/eightball/haunted/proc/attack_ghost  (code/game/objects/items/eightball.dm:109)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "shaking"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is not currently being shaken.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/toy/eightball/haunted/proc/Hear  (code/game/objects/items/eightball.dm:115)
rt.def("/obj/item/toy/eightball/haunted/proc/Hear", function Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	rt.setSv(f, "last_message", live(raw_message));
	return f.dot;
});

// /obj/item/toy/eightball/haunted/proc/start_shaking  (code/game/objects/items/eightball.dm:120)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/start_shaking", function* start_shaking(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "selected_message", rt.sv(f, "last_message"));
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("＀ is shaking ＀, hoping to get an answer to \"＀\"", [live(user), live(f.src), rt.sv(f, "selected_message")]), "source", live(f.src), "enter_link", fmt("<a href=?src=＃;interact=1>(Click to help)</a>", [live(f.src)]), "action", "attack"], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/toy/eightball/haunted/proc/Topic  (code/game/objects/items/eightball.dm:124)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	f.vars = () => [href, href_list];
	if (!truthy(rt.at(live(href_list), "interact"))) return f.dot;
	if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "interact", live(f.usr));
	return f.dot;
}, true);

// /obj/item/toy/eightball/haunted/proc/get_vote_tallies  (code/game/objects/items/eightball.dm:129)
rt.def("/obj/item/toy/eightball/haunted/proc/get_vote_tallies", function get_vote_tallies(f: Frame) {
	let answers: Value = null, ckey: Value = null, selected: Value = null;
	let $e: any;
	f.vars = () => [answers, ckey, selected, $e];
	answers = rt.list();
	ckey = null;
	rt.forList(f, 0, rt.sv(f, "votes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ckey = $e;
		if (truthy((rt.isIn(f, (selected = rt.index(rt.sv(f, "votes"), live(ckey))), live(answers)) ? 1 : 0))) {
			rt.incAt(live(answers), live(selected), 1, true);
		} else {
			rt.setAt(live(answers), live(selected), 1);
		}
	}
	rt.endFor(f, 0);
	return live(answers);
});

// /obj/item/toy/eightball/haunted/proc/get_answer  (code/game/objects/items/eightball.dm:141)
rt.def("/obj/item/toy/eightball/haunted/proc/get_answer", function get_answer(f: Frame) {
	let tallied_votes: Value = null, most_popular_answer: Value = null, most_amount: Value = null, A: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [tallied_votes, most_popular_answer, most_amount, A, amount, $e];
	if (!truthy(rt.len(f, rt.sv(f, "votes")))) {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("possible_answers")]);
	}
	tallied_votes = rt.callSrc(f, "get_vote_tallies", []);
	most_popular_answer = null;
	most_amount = 0;
	A = null;
	rt.forList(f, 0, live(tallied_votes));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (rt.gt((amount = rt.index(live(tallied_votes), live(A))), live(most_amount))) {
			most_popular_answer = live(A);
		}
	}
	rt.endFor(f, 0);
	return live(most_popular_answer);
});

// /obj/item/toy/eightball/haunted/proc/ui_interact  (code/game/objects/items/eightball.dm:161)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("observer_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "eightball", rt.sv(f, "name"), 400, 600, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/toy/eightball/haunted/proc/ui_data  (code/game/objects/items/eightball.dm:167)
rt.def("/obj/item/toy/eightball/haunted/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, tallied_votes: Value = null, pa: Value = null, L: Value = null, amount: Value = null, selected: Value = null;
	let $e: any;
	f.vars = () => [data, tallied_votes, pa, L, amount, selected, $e];
	rt.setAt((data = rt.list()), "shaking", rt.sv(f, "shaking"));
	rt.setAt(live(data), "question", rt.sv(f, "selected_message"));
	tallied_votes = rt.callSrc(f, "get_vote_tallies", []);
	rt.setAt(live(data), "answers", rt.list());
	pa = null;
	rt.forList(f, 0, rt.gl("possible_answers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pa = $e;
		rt.setAt((L = rt.list()), "answer", live(pa));
		amount = 0;
		if (truthy((rt.isIn(f, live(pa), live(tallied_votes)) ? 1 : 0))) {
			amount = rt.index(live(tallied_votes), live(pa));
		}
		rt.setAt(live(L), "amount", live(amount));
		selected = 0;
		if (isEqual(rt.index(rt.sv(f, "votes"), rt.fv(f, "ckey", live(user))), live(pa))) {
			selected = 1;
		}
		rt.setAt(live(L), "selected", live(selected));
		rt.modAt(live(data), "answers", rt.list(live(L)), add);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /obj/item/toy/eightball/haunted/proc/ui_act  (code/game/objects/items/eightball.dm:190)  may sleep
rt.def("/obj/item/toy/eightball/haunted/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, selected_answer: Value = null;
	let $0: any;
	f.vars = () => [user, selected_answer, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	user = live(f.usr);
	$0 = live(f.args[0]);
	if ($0 === "vote") {
		if (truthy((rt.isIn(f, (!truthy((selected_answer = rt.at(live(f.args[1]), "answer"))) ? 1 : 0), rt.gl("possible_answers")) ? 1 : 0))) {
			return live(f.dot);
		} else {
			rt.setAt(rt.sv(f, "votes"), rt.fv(f, "ckey", live(user)), live(selected_answer));
			f.dot = 1;
		}
	}
	return f.dot;
}, true, { args: ["action", "params"] });
