// From code/modules/mining/mint.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10938, "/obj/machinery/mineral/mint", "/obj/machinery/mineral", {
	materials: null,
	newCoins: 0,
	processing: 0,
	chosen: "$metal",
	coinsToProduce: 10,
	anchored: 1,
	speed_process: 1,
	name: "coin press",
	icon: rt.rsc("icons/obj/economy.dmi"),
	icon_state: "coinpress0",
	density: 1,
});

// /obj/machinery/mineral/mint/proc/New  (code/modules/mining/mint.dm:19)  may sleep
rt.def("/obj/machinery/mineral/mint/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [null, live(f.src), null, rt.list("$metal", "$plasma", "$silver", "$gold", "$uranium", "$diamond", "$bananium"), "max_amt", 100000], rt.Args.Named)));
	return f.dot;
}, true);

// /obj/machinery/mineral/mint/proc/Destroy  (code/modules/mining/mint.dm:25)  may sleep
rt.def("/obj/machinery/mineral/mint/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "materials")]);
	rt.setSv(f, "materials", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/mineral/mint/proc/process  (code/modules/mining/mint.dm:31)  may sleep
rt.def("/obj/machinery/mineral/mint/proc/process", function* process(f: Frame) {
	let _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [_T, O, $e];
	if (!truthy((_T = rt.getStep(f, live(f.src), rt.sv(f, "input_dir"))))) {
		return live(f.dot);
	}
	O = null;
	rt.forList(f, 0, live(_T), T("/obj/item/stack/sheet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, rt.sv(f, "materials"), "insert_stack", [live(O), rt.fv(f, "amount", live(O))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/mineral/mint/proc/attack_hand  (code/modules/mining/mint.dm:39)
rt.def("/obj/machinery/mineral/mint/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let dat: Value = null, mat_id: Value = null, M: Value = null, M_1: Value = null;
	let $e: any;
	f.vars = () => [dat, mat_id, M, M_1, $e];
	dat = "<b>Coin Press</b><br>";
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		if ((!truthy(rt.gv(f, "amount", (M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id))))) && !isEqual(rt.sv(f, "chosen"), live(mat_id)))) {
			continue;
		}
		dat = rt.modify(live(dat), fmt("<br><b>＀ amount:</b> ＀ cm<sup>3</sup> ", [rt.fv(f, "name", live(M)), rt.fv(f, "amount", live(M))]), add);
		if (isEqual(rt.sv(f, "chosen"), live(mat_id))) {
			dat = rt.modify(live(dat), "<b>Chosen</b>", add);
		} else {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;choose=＀'>Choose</A>", [live(f.src), live(mat_id)]), add);
		}
	}
	rt.endFor(f, 0);
	M_1 = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), rt.sv(f, "chosen"));
	dat = rt.modify(live(dat), fmt("<br><br>Will produce ＀ ＀ coins if enough materials are available.<br>", [rt.sv(f, "coinsToProduce"), rt.call(f, P("/proc/lowertext"), null, [rt.fv(f, "name", live(M_1))])]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;chooseAmt=-10'>-10</A> ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;chooseAmt=-5'>-5</A> ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;chooseAmt=-1'>-1</A> ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;chooseAmt=1'>+1</A> ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;chooseAmt=5'>+5</A> ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;chooseAmt=10'>+10</A> ", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<br><br>In total this machine produced <font color='green'><b>＀</b></font> coins.", [rt.sv(f, "newCoins")]), add);
	dat = rt.modify(live(dat), fmt("<br><A href='?src=＃;makeCoins=＀'>Make coins</A>", [live(f.src), 1]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=mint"], false);
	return f.dot;
});

// /obj/machinery/mineral/mint/proc/Topic  (code/modules/mining/mint.dm:66)  may sleep
rt.def("/obj/machinery/mineral/mint/proc/Topic", function* Topic(f: Frame) {
	let temp_coins: Value = null, coin_mat: Value = null, M: Value = null;
	f.vars = () => [temp_coins, coin_mat, M];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (isEqual(rt.sv(f, "processing"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The machine is processing.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "choose"))) {
		if (truthy(rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), rt.at(live(f.args[1]), "choose")))) {
			rt.setSv(f, "chosen", rt.at(live(f.args[1]), "choose"));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "chooseAmt"))) {
		rt.setSv(f, "coinsToProduce", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "coinsToProduce"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "chooseAmt")]))), 1000]))])));
	}
	if (truthy(rt.at(live(f.args[1]), "makeCoins"))) {
		temp_coins = rt.sv(f, "coinsToProduce");
		rt.setSv(f, "processing", 1);
		rt.setSv(f, "icon_state", "coinpress1");
		coin_mat = 400;
		if ((!truthy((M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), rt.sv(f, "chosen")))) || !truthy(rt.fv(f, "coin_type", live(M))))) {
			yield* g.srcCall(f, "updateUsrDialog");
			return live(f.dot);
		}
		while (rt.gt(rt.sv(f, "coinsToProduce"), 0) && truthy((yield* g.callName(f, rt.sv(f, "materials"), "use_amount_type", [live(coin_mat), rt.sv(f, "chosen")])))) {
			yield* g.srcCall(f, "create_coins", rt.fv(f, "coin_type", live(M)));
			rt.incSrcVar(f, "coinsToProduce", -1, true);
			rt.incSrcVar(f, "newCoins", 1, true);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
			yield* g.call(f, P("/proc/sleep"), null, [5]);
		}
		rt.setSv(f, "icon_state", "coinpress0");
		rt.setSv(f, "processing", 0);
		rt.setSv(f, "coinsToProduce", live(temp_coins));
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/mineral/mint/proc/create_coins  (code/modules/mining/mint.dm:102)  may sleep
rt.def("/obj/machinery/mineral/mint/proc/create_coins", function* create_coins(f: Frame, _P: Value) {
	let _T: Value = null, O: Value = null, M: Value = null;
	f.vars = () => [_P, _T, O, M];
	if (!truthy((_T = rt.getStep(f, live(f.src), rt.sv(f, "output_dir"))))) return f.dot;
	O = (yield* g.new_(f, live(_P), [live(f.src)]));
	if (!truthy((M = rt.locateIn(f, T("/obj/item/weapon/storage/bag/money"), live(_T))))) {
		yield* g.srcCall(f, "unload_mineral", (M = (yield* g.new_(f, T("/obj/item/weapon/storage/bag/money"), [live(f.src)]))));
	}
	rt.setFv(f, "loc", live(O), live(M));
	return f.dot;
}, true);
