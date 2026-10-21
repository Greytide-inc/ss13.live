// From code/modules/hydroponics/grown/replicapod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10070, "/obj/item/seeds/replicapod", "/obj/item/seeds", {
	ckey: null,
	realName: null,
	mind: null,
	blood_gender: null,
	blood_type: null,
	features: null,
	factions: null,
	contains_sample: 0,
	species: "replicapod",
	plantname: "Replica Pod",
	product: rt.typePath("/mob/living/carbon/human"),
	lifespan: 50,
	endurance: 8,
	maturation: 10,
	production: 1,
	yield: 1,
	potency: 30,
	name: "pack of replica pod seeds",
	desc: "These seeds grow into replica pods. They say these are used to harvest humans.",
	icon_state: "seed-replicapod",
});

// /obj/item/seeds/replicapod/proc/attackby  (code/modules/hydroponics/grown/replicapod.dm:26)  may sleep
rt.def("/obj/item/seeds/replicapod/proc/attackby", function* attackby(f: Frame) {
	let bloodSample: Value = null;
	let $e: any;
	f.vars = () => [bloodSample, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "contains_sample"))) {
			bloodSample = null;
			rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent/blood"));
			while (($e = rt.next(f, 0)) !== undefined) {
				bloodSample = $e;
				if ((truthy(rt.index(rt.fv(f, "data", live(bloodSample)), "mind")) && isEqual(rt.index(rt.fv(f, "data", live(bloodSample)), "cloneable"), 1))) {
					rt.setSv(f, "mind", rt.index(rt.fv(f, "data", live(bloodSample)), "mind"));
					rt.setSv(f, "ckey", rt.index(rt.fv(f, "data", live(bloodSample)), "ckey"));
					rt.setSv(f, "realName", rt.index(rt.fv(f, "data", live(bloodSample)), "real_name"));
					rt.setSv(f, "blood_gender", rt.index(rt.fv(f, "data", live(bloodSample)), "gender"));
					rt.setSv(f, "blood_type", rt.index(rt.fv(f, "data", live(bloodSample)), "blood_type"));
					rt.setSv(f, "features", rt.index(rt.fv(f, "data", live(bloodSample)), "features"));
					rt.setSv(f, "factions", rt.index(rt.fv(f, "data", live(bloodSample)), "factions"));
					yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "clear_reagents", []);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You inject the contents of the syringe into the seeds.</span>"]);
					rt.setSv(f, "contains_sample", 1);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The seeds reject the sample!</span>"]);
				}
			}
			rt.endFor(f, 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The seeds already contain a genetic sample!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/seeds/replicapod/proc/get_analyzer_text  (code/modules/hydroponics/grown/replicapod.dm:48)
rt.def("/obj/item/seeds/replicapod/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	let text: Value = null;
	f.vars = () => [text];
	text = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "contains_sample"))) {
		text = rt.modify(live(text), "\n It contains a blood sample!", add);
	}
	return live(text);
});

// /obj/item/seeds/replicapod/proc/harvest  (code/modules/hydroponics/grown/replicapod.dm:55)  may sleep
rt.def("/obj/item/seeds/replicapod/proc/harvest", function* harvest(f: Frame, user: Value) {
	let parent: Value = null, make_podman: Value = null, ckey_holder: Value = null, M: Value = null, O: Value = null, L: Value = null, podman: Value = null, seed_count: Value = null, output_loc: Value = null, i: Value = null, harvestseeds: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, parent, make_podman, ckey_holder, M, O, L, podman, seed_count, output_loc, i, harvestseeds, $0, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	parent = rt.sv(f, "loc");
	make_podman = 0;
	ckey_holder = null;
	if (truthy(rt.fv(f, "revival_pod_plants", rt.gl("config")))) {
		if (truthy(rt.sv(f, "ckey"))) {
			M = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
					if ((isEqual(rt.gv(f, "ckey", (O = live(M))), rt.sv(f, "ckey")) && truthy(rt.fv(f, "can_reenter_corpse", live(O))))) {
						make_podman = 1;
						break;
					}
				} else {
					if (((isEqual(rt.fv(f, "ckey", live(M)), rt.sv(f, "ckey")) && isEqual(rt.fv(f, "stat", live(M)), 2)) && !truthy(rt.fv(f, "suiciding", live(M))))) {
						make_podman = 1;
						if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
							make_podman = (!truthy(rt.gv(f, "hellbound", (L = live(M)))) ? 1 : 0);
						}
						break;
					}
				}
			}
			rt.endFor(f, 0);
		} else {
			M = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (((((((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "mind", live(M)))) && isEqual((yield* g.call(f, P("/proc/ckey"), null, [rt.gv(f, "key", rt.fv(f, "mind", live(M)))])), (yield* g.call(f, P("/proc/ckey"), null, [rt.fv(f, "key", rt.sv(f, "mind"))])))) && truthy(rt.fv(f, "ckey", live(M)))) && truthy(rt.fv(f, "client", live(M)))) && isEqual(rt.fv(f, "stat", live(M)), 2)) && !truthy(rt.fv(f, "suiciding", live(M))))) {
					if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
						if (!truthy(rt.gv(f, "can_reenter_corpse", (O = live(M))))) {
							break;
						}
					}
					make_podman = 1;
					if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
						make_podman = (!truthy(rt.gv(f, "hellbound", (L = live(M)))) ? 1 : 0);
					}
					ckey_holder = rt.fv(f, "ckey", live(M));
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy(live(make_podman))) {
		podman = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.fv(f, "loc", live(parent))]));
		if (truthy(rt.sv(f, "realName"))) {
			rt.setFv(f, "real_name", live(podman), rt.sv(f, "realName"));
		} else {
			rt.setFv(f, "real_name", live(podman), fmt("Pod Person ＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 999]))]));
		}
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(podman)]);
		if (truthy(rt.sv(f, "ckey"))) {
			rt.setFv(f, "ckey", live(podman), rt.sv(f, "ckey"));
		} else {
			rt.setFv(f, "ckey", live(podman), live(ckey_holder));
		}
		rt.setFv(f, "gender", live(podman), rt.sv(f, "blood_gender"));
		(rt.modField(f, live(podman), "faction", rt.sv(f, "factions"), rt.bitOr));
		if (!truthy(rt.at(rt.sv(f, "features"), "mcolor"))) {
			rt.setAt(rt.sv(f, "features"), "mcolor", "#59CE00");
		}
		yield* g.callName(f, live(podman), "hardset_dna", [null, null, rt.fv(f, "real_name", live(podman)), rt.sv(f, "blood_type"), T("/datum/species/pod"), rt.sv(f, "features")]);
		yield* g.callName(f, live(podman), "set_cloned_appearance", []);
	} else {
		seed_count = 1;
		if (truthy(rt.op(f, "Prob", [], [multiply((yield* g.srcCall(f, "getYield")), 20)]))) {
			seed_count = rt.inc(live(seed_count), 1);
		}
		if (truthy((yield* g.callName(f, live(parent), "Adjacent", [live(user)])))) {
			$0 = rt.fv(f, "loc", live(user));
		} else {
			$0 = rt.fv(f, "loc", live(parent));
		}
		output_loc = $0;
		i = null;
		i = 0;
		while (rt.lt(live(i), live(seed_count))) {
			yield* g.callName(f, (harvestseeds = (yield* g.callName(f, live(f.src), "Copy", []))), "forceMove", [live(output_loc)]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.callName(f, live(parent), "update_tray", []);
	return f.dot;
}, true);
