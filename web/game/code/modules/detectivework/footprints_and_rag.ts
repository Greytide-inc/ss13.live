// From code/modules/detectivework/footprints_and_rag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6391, "/obj/item/weapon/reagent_containers/glass/rag", "/obj/item/weapon/reagent_containers/glass", {
	flags: 4,
	container_type: 4096,
	name: "damp rag",
	desc: "For cleaning up messes, you suppose.",
	w_class: 1,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "rag",
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 5,
	spillable: 0,
});

// /obj/item/weapon/reagent_containers/glass/rag/proc/<init>  (code/modules/detectivework/footprints_and_rag.dm:18)
rt.def("/obj/item/weapon/reagent_containers/glass/rag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/rag/proc/suicide_act  (code/modules/detectivework/footprints_and_rag.dm:23)
rt.def("/obj/item/weapon/reagent_containers/glass/rag/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is smothering ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 8;
});

// /obj/item/weapon/reagent_containers/glass/rag/proc/afterattack  (code/modules/detectivework/footprints_and_rag.dm:27)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/rag/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let C: Value = null, reagentlist: Value = null;
	f.vars = () => [A, user, proximity, C, reagentlist];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(A), T("/mob/living/carbon")) ? 1 : 0)) && truthy(rt.fv(f, "reagents", live(A)))) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		C = live(A);
		reagentlist = (yield* g.call(f, P("/proc/pretty_string_from_reagent_list"), null, [rt.sv(f, "reagents")]));
		if ((isEqual(rt.fv(f, "a_intent", live(user)), "harm") && !truthy((yield* g.callName(f, live(C), "is_mouth_covered", []))))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(C), 2]);
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(C), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
			yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ has smothered ％！ with ％！!</span>", [live(user), live(C), live(f.src)]), fmt("<span class='userdanger'>＀ has smothered you with ％！!</span>", [live(user), live(f.src)]), "<span class='italics'>You hear some struggling and muffled cries of surprise.</span>"]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ smothered ＀ with a damp rag containing ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(A)])), live(reagentlist)])]);
			yield* g.call(f, P("/proc/log_attack"), null, [fmt("＀ smothered ＀ with a damp rag containing ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(A)])), live(reagentlist)])]);
		} else {
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(C), 1]);
			yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ touched ＀ with a damp rag containing ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(A)])), live(reagentlist)])]);
			yield* g.call(f, P("/proc/log_attack"), null, [fmt("＀ touched ＀ with a damp rag containing ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(A)])), live(reagentlist)])]);
			yield* g.callName(f, live(C), "visible_message", [fmt("<span class='notice'>＀ has touched ％！ with ％！.</span>", [live(user), live(C), live(f.src)])]);
		}
	} else {
		if (truthy((rt.isIn(f, ((rt.istype(live(A), T("/atom")) ? 1 : 0) && live(f.src)), live(user)) ? 1 : 0))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ starts to wipe down ＀ with ＀!", [live(user), live(A), live(f.src)]), fmt("<span class='notice'>You start to wipe down ＀ with ＀...</span>", [live(A), live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(A)], rt.Args.Named)))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ finishes wiping off the ＀!", [live(user), live(A)]), fmt("<span class='notice'>You finish wiping off the ＀.</span>", [live(A)])]);
				yield* g.callName(f, live(A), "clean_blood", []);
				yield* g.callName(f, live(A), "wash_cream", []);
			}
		}
	}
	return live(f.dot);
}, true);
