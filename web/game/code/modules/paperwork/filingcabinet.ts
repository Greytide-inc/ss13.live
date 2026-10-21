// From code/modules/paperwork/filingcabinet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12968, "/obj/structure/filingcabinet", "/obj/structure", {
	anchored: 1,
	name: "filing cabinet",
	desc: "A large cabinet with drawers.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "filingcabinet",
	density: 1,
});

// /obj/structure/filingcabinet/proc/Initialize  (code/modules/paperwork/filingcabinet.dm:35)
rt.def("/obj/structure/filingcabinet/proc/Initialize", function Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (((truthy((rt.istype(live(I), T("/obj/item/weapon/paper")) ? 1 : 0)) || truthy((rt.istype(live(I), T("/obj/item/weapon/folder")) ? 1 : 0))) || truthy((rt.istype(live(I), T("/obj/item/weapon/photo")) ? 1 : 0)))) {
			rt.setFv(f, "loc", live(I), live(f.src));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/filingcabinet/proc/deconstruct  (code/modules/paperwork/filingcabinet.dm:42)  may sleep
rt.def("/obj/structure/filingcabinet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [disassembled, I, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
		I = null;
		rt.forList(f, 0, live(f.src), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(I), "forceMove", [rt.sv(f, "loc")]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/proc/attackby  (code/modules/paperwork/filingcabinet.dm:49)  may sleep
rt.def("/obj/structure/filingcabinet/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if ((((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/folder")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/obj/item/documents")) ? 1 : 0)))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "icon_state", fmt("＀-open", [rt.initial(f, live(f.src), "icon_state")]));
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "anchored"))) {
				$1 = "unwrench";
			} else {
				$1 = "wrench";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin to ＀ ＀.</span>", [$1, live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "anchored"))) {
					$1 = "unwrench";
				} else {
					$1 = "wrench";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You successfully ＀ ＀.</span>", [$1, live(f.src)])]);
				rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
			}
		} else {
			if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't put ＀ in ＀!</span>", [live(f.args[0]), live(f.src)])]);
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/structure/filingcabinet/proc/attack_hand  (code/modules/paperwork/filingcabinet.dm:71)  may sleep
rt.def("/obj/structure/filingcabinet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, i: Value = null, _P: Value = null;
	f.vars = () => [user, dat, i, _P];
	if (rt.le(rt.len(f, rt.sv(f, "contents")), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is empty.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<center><table>";
	i = null;
	i = rt.len(f, rt.sv(f, "contents"));
	while (rt.ge(live(i), 1)) {
		_P = rt.index(rt.sv(f, "contents"), live(i));
		dat = rt.modify(live(dat), fmt("<tr><td><a href='?src=＃;retrieve=＃'>＀</a></td></tr>", [live(f.src), live(_P), rt.fv(f, "name", live(_P))]), add);
		i = rt.inc(live(i), -1);
	}
	dat = rt.modify(live(dat), "</table></center>", add);
	rt.op(f, "Browse", [], [live(user), fmt("<html><head><title>＀</title></head><body>＀</body></html>", [rt.sv(f, "name"), live(dat)]), "window=filingcabinet;size=350x300"], false);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/proc/attack_tk  (code/modules/paperwork/filingcabinet.dm:86)  may sleep
rt.def("/obj/structure/filingcabinet/proc/attack_tk", function* attack_tk(f: Frame) {
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.srcCall(f, "attack_self_tk", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/filingcabinet/proc/attack_self_tk  (code/modules/paperwork/filingcabinet.dm:91)  may sleep
rt.def("/obj/structure/filingcabinet/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	let I: Value = null;
	f.vars = () => [user, I];
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		if (truthy(rt.op(f, "Prob", [], [add(40, multiply(rt.len(f, rt.sv(f, "contents")), 5))]))) {
			rt.setFv(f, "loc", (I = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "contents")])), rt.sv(f, "loc"));
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				yield* g.call(f, P("/proc/step_rand"), null, [live(I)]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You pull ＇！ out of ＀ at random.</span>", [live(I), live(f.src)])]);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You find nothing in ＀.</span>", [live(f.src)])]);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/proc/Topic  (code/modules/paperwork/filingcabinet.dm:102)  may sleep
rt.def("/obj/structure/filingcabinet/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _P: Value = null;
	f.vars = () => [href, href_list, _P];
	if (!truthy(rt.at(live(href_list), "retrieve"))) return f.dot;
	rt.op(f, "Browse", [], [live(f.usr), "", "window=filingcabinet"], false);
	if (!((truthy((rt.istype((_P = rt.locateIn(f, rt.at(live(href_list), "retrieve"), rt.world())), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(_P)), live(f.src))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1))) return f.dot;
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(_P)]);
	yield* g.srcCall(f, "updateUsrDialog");
	rt.setSv(f, "icon_state", fmt("＀-open", [rt.initial(f, live(f.src), "icon_state")]));
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	return f.dot;
}, true);

rt.type(12972, "/obj/structure/filingcabinet/security", "/obj/structure/filingcabinet", {
	virgin: 1,
});

// /obj/structure/filingcabinet/security/proc/populate  (code/modules/paperwork/filingcabinet.dm:123)  may sleep
rt.def("/obj/structure/filingcabinet/security/proc/populate", function* populate(f: Frame) {
	let G: Value = null, S: Value = null, _P: Value = null, counter: Value = null;
	let $e: any;
	f.vars = () => [G, S, _P, counter, $e];
	if (!truthy(rt.sv(f, "virgin"))) return f.dot;
	G = null;
	rt.forList(f, 0, rt.fv(f, "general", rt.gl("data_core")), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (!truthy((S = (yield* g.call(f, P("/proc/find_record"), null, ["name", rt.index(rt.fv(f, "fields", live(G)), "name"), rt.fv(f, "security", rt.gl("data_core"))]))))) {
			continue;
		}
		rt.setFv(f, "info", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [live(f.src)]))), "<CENTER><B>Security Record</B></CENTER><BR>");
		rt.modField(f, live(_P), "info", fmt("Name: ＀ ID: ＀<BR>\nSex: ＀<BR>\nAge: ＀<BR>\nFingerprint: ＀<BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [rt.index(rt.fv(f, "fields", live(G)), "name"), rt.index(rt.fv(f, "fields", live(G)), "id"), rt.index(rt.fv(f, "fields", live(G)), "sex"), rt.index(rt.fv(f, "fields", live(G)), "age"), rt.index(rt.fv(f, "fields", live(G)), "fingerprint"), rt.index(rt.fv(f, "fields", live(G)), "p_stat"), rt.index(rt.fv(f, "fields", live(G)), "m_stat")]), add);
		rt.modField(f, live(_P), "info", fmt("<BR>\n<CENTER><B>Security Data</B></CENTER><BR>\nCriminal Status: ＀<BR>\n<BR>\nMinor Crimes: ＀<BR>\nDetails: ＀<BR>\n<BR>\nMajor Crimes: ＀<BR>\nDetails: ＀<BR>\n<BR>\nImportant Notes:<BR>\n\t＀<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [rt.index(rt.fv(f, "fields", live(S)), "criminal"), rt.index(rt.fv(f, "fields", live(S)), "mi_crim"), rt.index(rt.fv(f, "fields", live(S)), "mi_crim_d"), rt.index(rt.fv(f, "fields", live(S)), "ma_crim"), rt.index(rt.fv(f, "fields", live(S)), "ma_crim_d"), rt.index(rt.fv(f, "fields", live(S)), "notes")]), add);
		counter = 1;
		while (truthy(rt.index(rt.fv(f, "fields", live(S)), fmt("com_＀", [live(counter)])))) {
			rt.modField(f, live(_P), "info", fmt("＀<BR>", [rt.index(rt.fv(f, "fields", live(S)), fmt("com_＀", [live(counter)]))]), add);
			counter = rt.inc(live(counter), 1);
		}
		rt.modField(f, live(_P), "info", "</TT>", add);
		rt.setFv(f, "name", live(_P), fmt("paper - '＀'", [rt.index(rt.fv(f, "fields", live(G)), "name")]));
		rt.setSv(f, "virgin", 0);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/security/proc/attack_hand  (code/modules/paperwork/filingcabinet.dm:141)  may sleep
rt.def("/obj/structure/filingcabinet/security/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "populate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/security/proc/attack_tk  (code/modules/paperwork/filingcabinet.dm:144)  may sleep
rt.def("/obj/structure/filingcabinet/security/proc/attack_tk", function* attack_tk(f: Frame) {
	yield* g.srcCall(f, "populate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(12973, "/obj/structure/filingcabinet/medical", "/obj/structure/filingcabinet", {
	virgin: 1,
});

// /obj/structure/filingcabinet/medical/proc/populate  (code/modules/paperwork/filingcabinet.dm:155)  may sleep
rt.def("/obj/structure/filingcabinet/medical/proc/populate", function* populate(f: Frame) {
	let G: Value = null, M: Value = null, _P: Value = null, counter: Value = null;
	let $e: any;
	f.vars = () => [G, M, _P, counter, $e];
	if (!truthy(rt.sv(f, "virgin"))) return f.dot;
	G = null;
	rt.forList(f, 0, rt.fv(f, "general", rt.gl("data_core")), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (!truthy((M = (yield* g.call(f, P("/proc/find_record"), null, ["name", rt.index(rt.fv(f, "fields", live(G)), "name"), rt.fv(f, "medical", rt.gl("data_core"))]))))) {
			continue;
		}
		rt.setFv(f, "info", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [live(f.src)]))), "<CENTER><B>Medical Record</B></CENTER><BR>");
		rt.modField(f, live(_P), "info", fmt("Name: ＀ ID: ＀<BR>\nSex: ＀<BR>\nAge: ＀<BR>\nFingerprint: ＀<BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [rt.index(rt.fv(f, "fields", live(G)), "name"), rt.index(rt.fv(f, "fields", live(G)), "id"), rt.index(rt.fv(f, "fields", live(G)), "sex"), rt.index(rt.fv(f, "fields", live(G)), "age"), rt.index(rt.fv(f, "fields", live(G)), "fingerprint"), rt.index(rt.fv(f, "fields", live(G)), "p_stat"), rt.index(rt.fv(f, "fields", live(G)), "m_stat")]), add);
		rt.modField(f, live(_P), "info", fmt("<BR>\n<CENTER><B>Medical Data</B></CENTER><BR>\nBlood Type: ＀<BR>\nDNA: ＀<BR>\n<BR>\nMinor Disabilities: ＀<BR>\nDetails: ＀<BR>\n<BR>\nMajor Disabilities: ＀<BR>\nDetails: ＀<BR>\n<BR>\nAllergies: ＀<BR>\nDetails: ＀<BR>\n<BR>\nCurrent Diseases: ＀ (per disease info placed in log/comment section)<BR>\nDetails: ＀<BR>\n<BR>\nImportant Notes:<BR>\n\t＀<BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [rt.index(rt.fv(f, "fields", live(M)), "blood_type"), rt.index(rt.fv(f, "fields", live(M)), "b_dna"), rt.index(rt.fv(f, "fields", live(M)), "mi_dis"), rt.index(rt.fv(f, "fields", live(M)), "mi_dis_d"), rt.index(rt.fv(f, "fields", live(M)), "ma_dis"), rt.index(rt.fv(f, "fields", live(M)), "ma_dis_d"), rt.index(rt.fv(f, "fields", live(M)), "alg"), rt.index(rt.fv(f, "fields", live(M)), "alg_d"), rt.index(rt.fv(f, "fields", live(M)), "cdi"), rt.index(rt.fv(f, "fields", live(M)), "cdi_d"), rt.index(rt.fv(f, "fields", live(M)), "notes")]), add);
		counter = 1;
		while (truthy(rt.index(rt.fv(f, "fields", live(M)), fmt("com_＀", [live(counter)])))) {
			rt.modField(f, live(_P), "info", fmt("＀<BR>", [rt.index(rt.fv(f, "fields", live(M)), fmt("com_＀", [live(counter)]))]), add);
			counter = rt.inc(live(counter), 1);
		}
		rt.modField(f, live(_P), "info", "</TT>", add);
		rt.setFv(f, "name", live(_P), fmt("paper - '＀'", [rt.index(rt.fv(f, "fields", live(G)), "name")]));
		rt.setSv(f, "virgin", 0);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/medical/proc/attack_hand  (code/modules/paperwork/filingcabinet.dm:172)  may sleep
rt.def("/obj/structure/filingcabinet/medical/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "populate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/medical/proc/attack_tk  (code/modules/paperwork/filingcabinet.dm:175)  may sleep
rt.def("/obj/structure/filingcabinet/medical/proc/attack_tk", function* attack_tk(f: Frame) {
	yield* g.srcCall(f, "populate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalemploymentCabinets  (code/modules/paperwork/filingcabinet.dm:182)
rt.def("/datum/controller/global_vars/proc/InitGlobalemploymentCabinets", function InitGlobalemploymentCabinets(f: Frame) {
	rt.setGl("employmentCabinets", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "employmentCabinets", add);
	return f.dot;
});

rt.type(12974, "/obj/structure/filingcabinet/employment", "/obj/structure/filingcabinet", {
	cooldown: 0,
	virgin: 1,
	icon_state: "employmentcabinet",
});

// /obj/structure/filingcabinet/employment/proc/New  (code/modules/paperwork/filingcabinet.dm:190)  may sleep
rt.def("/obj/structure/filingcabinet/employment/proc/New", function* New(f: Frame) {
	rt.modGl("employmentCabinets", live(f.src), add);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/filingcabinet/employment/proc/Destroy  (code/modules/paperwork/filingcabinet.dm:194)  may sleep
rt.def("/obj/structure/filingcabinet/employment/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("employmentCabinets", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/filingcabinet/employment/proc/fillCurrent  (code/modules/paperwork/filingcabinet.dm:199)  may sleep
rt.def("/obj/structure/filingcabinet/employment/proc/fillCurrent", function* fillCurrent(f: Frame) {
	let record: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [record, G, $e];
	record = null;
	rt.forList(f, 0, rt.fv(f, "locked", rt.gl("data_core")));
	while (($e = rt.next(f, 0)) !== undefined) {
		record = $e;
		if (!truthy((G = live(record)))) {
			continue;
		}
		if (truthy(rt.index(rt.fv(f, "fields", live(G)), "reference"))) {
			yield* g.srcCall(f, "addFile", rt.index(rt.fv(f, "fields", live(G)), "reference"));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/employment/proc/addFile  (code/modules/paperwork/filingcabinet.dm:208)  may sleep
rt.def("/obj/structure/filingcabinet/employment/proc/addFile", function* addFile(f: Frame, employee: Value) {
	f.vars = () => [employee];
	yield* g.new_(f, T("/obj/item/weapon/paper/contract/employment"), [live(f.src), live(employee)]);
	return f.dot;
}, true);

// /obj/structure/filingcabinet/employment/proc/attack_hand  (code/modules/paperwork/filingcabinet.dm:211)  may sleep
rt.def("/obj/structure/filingcabinet/employment/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!truthy(rt.sv(f, "cooldown"))) {
		if (truthy(rt.sv(f, "virgin"))) {
			yield* g.srcCall(f, "fillCurrent");
			rt.setSv(f, "virgin", 0);
		}
		rt.setSv(f, "cooldown", 1);
		yield* g.callSuper(f, [], rt.Args.Same);
		yield* g.call(f, P("/proc/sleep"), null, [100]);
		rt.setSv(f, "cooldown", 0);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>The ＀ is jammed, give it a few seconds.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true, { args: ["user"] });
