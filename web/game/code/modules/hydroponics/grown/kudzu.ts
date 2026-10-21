// From code/modules/hydroponics/grown/kudzu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10038, "/obj/item/seeds/kudzu", "/obj/item/seeds", {
	mutations: null,
	species: "kudzu",
	plantname: "Kudzu",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/kudzupod"),
	genes: null,
	lifespan: 20,
	endurance: 10,
	yield: 4,
	growthstages: 4,
	rarity: 30,
	reagents_add: null,
	name: "pack of kudzu seeds",
	desc: "These seeds grow into a weed that grows incredibly fast.",
	icon_state: "seed-kudzu",
});

// /obj/item/seeds/kudzu/proc/<init>  (code/modules/hydroponics/grown/kudzu.dm:10)
rt.def("/obj/item/seeds/kudzu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/repeated_harvest"), T("/datum/plant_gene/trait/plant_type/weed_hardy")));
	$0 = $0;
	rt.setSv(f, "mutations", rt.list());
	rt.setSv(f, "reagents_add", rt.alist(f, ["charcoal", 0.03999999910593033, "nutriment", 0.019999999552965164]));
	return f.dot;
});

// /obj/item/seeds/kudzu/proc/Copy  (code/modules/hydroponics/grown/kudzu.dm:20)  may sleep
rt.def("/obj/item/seeds/kudzu/proc/Copy", function* Copy(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setFv(f, "mutations", (S = (yield* g.callSuper(f, [], rt.Args.Same))), (yield* g.callName(f, rt.sv(f, "mutations"), "Copy", [])));
	return live(S);
}, true);

// /obj/item/seeds/kudzu/proc/suicide_act  (code/modules/hydroponics/grown/kudzu.dm:25)  may sleep
rt.def("/obj/item/seeds/kudzu/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ swallows the pack of kudzu seeds! It looks like ＀ trying to commit suicide!</span>", [live(user), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.srcCall(f, "plant", live(user));
	return 1;
}, true);

// /obj/item/seeds/kudzu/proc/plant  (code/modules/hydroponics/grown/kudzu.dm:30)  may sleep
rt.def("/obj/item/seeds/kudzu/proc/plant", function* plant(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open/space")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need more space to plant ＀.</span>", [live(f.src)])]);
		return 0;
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/spacevine"), rt.fv(f, "loc", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is too much kudzu here to plant ＀.</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You plant ＀.</span>", [live(f.src)])]);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	if (truthy(live(user))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]);
	} else {
		$1 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Kudzu planted by ＀ at ＀", [$0, fmt("＀", [$1])]), 0, 1]);
	yield* g.srcCall(f, "investigate_log", fmt("was planted by ＀ at ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]), "botany");
	yield* g.new_(f, T("/datum/spacevine_controller"), [rt.getStep(f, live(user), 0), rt.sv(f, "mutations"), rt.sv(f, "potency"), rt.sv(f, "production")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/seeds/kudzu/proc/attack_self  (code/modules/hydroponics/grown/kudzu.dm:45)  may sleep
rt.def("/obj/item/seeds/kudzu/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "plant", live(user));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You plant the kudzu. You monster.</span>"]);
	return f.dot;
}, true);

// /obj/item/seeds/kudzu/proc/get_analyzer_text  (code/modules/hydroponics/grown/kudzu.dm:49)
rt.def("/obj/item/seeds/kudzu/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	let text: Value = null, text_string: Value = null, SM: Value = null;
	let $0: any, $e: any;
	f.vars = () => [text, text_string, SM, $0, $e];
	text = rt.callSuper(f, [], rt.Args.Same);
	text_string = "";
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		if (isEqual(live(text_string), "")) {
			$0 = "";
		} else {
			$0 = ", ";
		}
		text_string = rt.modify(live(text_string), fmt("＀＀", [$0, rt.fv(f, "name", live(SM))]), add);
	}
	rt.endFor(f, 0);
	if (isEqual(live(text_string), "")) {
		$0 = "None";
	} else {
		$0 = live(text_string);
	}
	return (text = rt.modify(live(text), fmt("\n- Plant Mutations: ＀", [$0]), add));
});

// /obj/item/seeds/kudzu/proc/on_chem_reaction  (code/modules/hydroponics/grown/kudzu.dm:57)
rt.def("/obj/item/seeds/kudzu/proc/on_chem_reaction", function on_chem_reaction(f: Frame, S: Value) {
	let temp_mut_list: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [temp_mut_list, SM, $e];
	temp_mut_list = rt.list();
	if (truthy(rt.callName(f, live(S), "has_reagent", ["sterilizine", 5]))) {
		SM = null;
		rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SM = $e;
			if (isEqual(rt.fv(f, "quality", live(SM)), 2)) {
				temp_mut_list = rt.modify(live(temp_mut_list), live(SM), add);
			}
		}
		rt.endFor(f, 0);
		if ((truthy(rt.op(f, "Prob", [], [20])) && truthy(rt.len(f, live(temp_mut_list))))) {
			rt.callName(f, rt.sv(f, "mutations"), "Remove", [rt.op(f, "PickUnweighted", [1], [live(temp_mut_list)])]);
		}
		rt.callName(f, live(temp_mut_list), "Cut", []);
	}
	if (truthy(rt.callName(f, live(S), "has_reagent", ["welding_fuel", 5]))) {
		SM = null;
		rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SM = $e;
			if (isEqual(rt.fv(f, "quality", live(SM)), 1)) {
				temp_mut_list = rt.modify(live(temp_mut_list), live(SM), add);
			}
		}
		rt.endFor(f, 0);
		if ((truthy(rt.op(f, "Prob", [], [20])) && truthy(rt.len(f, live(temp_mut_list))))) {
			rt.callName(f, rt.sv(f, "mutations"), "Remove", [rt.op(f, "PickUnweighted", [1], [live(temp_mut_list)])]);
		}
		rt.callName(f, live(temp_mut_list), "Cut", []);
	}
	if (truthy(rt.callName(f, live(S), "has_reagent", ["phenol", 5]))) {
		SM = null;
		rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SM = $e;
			if (isEqual(rt.fv(f, "quality", live(SM)), 3)) {
				temp_mut_list = rt.modify(live(temp_mut_list), live(SM), add);
			}
		}
		rt.endFor(f, 0);
		if ((truthy(rt.op(f, "Prob", [], [20])) && truthy(rt.len(f, live(temp_mut_list))))) {
			rt.callName(f, rt.sv(f, "mutations"), "Remove", [rt.op(f, "PickUnweighted", [1], [live(temp_mut_list)])]);
		}
		rt.callName(f, live(temp_mut_list), "Cut", []);
	}
	if (truthy(rt.callName(f, live(S), "has_reagent", ["blood", 15]))) {
		rt.callSrc(f, "adjust_production", [rt.call(f, P("/proc/rand"), null, [15, -5])]);
	}
	if (truthy(rt.callName(f, live(S), "has_reagent", ["amatoxin", 5]))) {
		rt.callSrc(f, "adjust_production", [rt.call(f, P("/proc/rand"), null, [5, -15])]);
	}
	if (truthy(rt.callName(f, live(S), "has_reagent", ["plasma", 5]))) {
		rt.callSrc(f, "adjust_potency", [rt.call(f, P("/proc/rand"), null, [5, -15])]);
	}
	if (!truthy(rt.callName(f, live(S), "has_reagent", ["holywater", 10]))) return f.dot;
	rt.callSrc(f, "adjust_potency", [rt.call(f, P("/proc/rand"), null, [15, -5])]);
	return f.dot;
});
