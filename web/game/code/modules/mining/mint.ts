// Based on /tg/station's code/modules/mining/mint.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// mint.dm:19
rt.def("/obj/machinery/mineral/mint/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$plasma", "$silver", "$gold", "$uranium", "$diamond", "$bananium"), { max_amt: 100000 }));
	return f.dot;
}, true);

// mint.dm:25
rt.def("/obj/machinery/mineral/mint/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.materials);
	this.materials = null;
	return (yield* parent_proc());
}, true);

// mint.dm:31
rt.def("/obj/machinery/mineral/mint/proc/process", function* process(f: Frame) {
	let _T: Value = null, O: Value = null;
	if (!(_T = rt.getStep(f, this, this.input_dir))) {
		return f.dot;
	}
	for (O of each(_T, T("/obj/item/stack/sheet"))) {
		yield* this.materials.insert_stack(O, O.amount);
	}
	return f.dot;
}, true, { waitfor: false });

// mint.dm:39
rt.def("/obj/machinery/mineral/mint/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let mat_id: Value = null, M: Value = null;
	let dat: Value = "<b>Coin Press</b><br>";
	for (mat_id of each(this.materials.materials)) {
		if (!(M = rt.index(this.materials.materials, mat_id)).amount && this.chosen != mat_id) {
			continue;
		}
		dat += `<br><b>${M.name} amount:</b> ${M.amount} cm<sup>3</sup> `;
		if (this.chosen == mat_id) {
			dat += "<b>Chosen</b>";
		} else {
			dat += fmt("<A href='?src=＃;choose=＀'>Choose</A>", [this, mat_id]);
		}
	}
	let M_1: Value = rt.index(this.materials.materials, this.chosen);
	dat += `<br><br>Will produce ${this.coinsToProduce} ${lowertext(M_1.name)} coins if enough materials are available.<br>`;
	dat += fmt("<A href='?src=＃;chooseAmt=-10'>-10</A> ", [this]);
	dat += fmt("<A href='?src=＃;chooseAmt=-5'>-5</A> ", [this]);
	dat += fmt("<A href='?src=＃;chooseAmt=-1'>-1</A> ", [this]);
	dat += fmt("<A href='?src=＃;chooseAmt=1'>+1</A> ", [this]);
	dat += fmt("<A href='?src=＃;chooseAmt=5'>+5</A> ", [this]);
	dat += fmt("<A href='?src=＃;chooseAmt=10'>+10</A> ", [this]);
	dat += `<br><br>In total this machine produced <font color='green'><b>${this.newCoins}</b></font> coins.`;
	dat += fmt("<br><A href='?src=＃;makeCoins=＀'>Make coins</A>", [this, 1]);
	rt.op(f, "Browse", [], [user, dat, "window=mint"], false);
	return f.dot;
});

// mint.dm:66
rt.def("/obj/machinery/mineral/mint/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let temp_coins: Value = null, coin_mat: Value = null, M: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (this.processing == 1) {
		to_chat(f.usr, "<span class='notice'>The machine is processing.</span>");
		return f.dot;
	}
	if (rt.at(href_list, "choose")) {
		if (rt.index(this.materials.materials, rt.at(href_list, "choose"))) {
			this.chosen = rt.at(href_list, "choose");
		}
	}
	if (rt.at(href_list, "chooseAmt")) {
		this.coinsToProduce = max(0, min(this.coinsToProduce + text2num(rt.at(href_list, "chooseAmt")), 1000));
	}
	if (rt.at(href_list, "makeCoins")) {
		temp_coins = this.coinsToProduce;
		this.processing = 1;
		this.icon_state = "coinpress1";
		coin_mat = 400;
		if (!(M = rt.index(this.materials.materials, this.chosen)) || !M.coin_type) {
			yield* this.updateUsrDialog();
			return f.dot;
		}
		while (this.coinsToProduce > 0 && this.materials.use_amount_type(coin_mat, this.chosen)) {
			yield* this.create_coins(M.coin_type);
			this.coinsToProduce--;
			this.newCoins++;
			yield* this.updateUsrDialog();
			yield* sleep(5);
		}
		this.icon_state = "coinpress0";
		this.processing = 0;
		this.coinsToProduce = temp_coins;
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// mint.dm:102
rt.def("/obj/machinery/mineral/mint/proc/create_coins", function* create_coins(f: Frame, _P: Value) {
	let _T: Value = null, M: Value = null;
	if (!(_T = rt.getStep(f, this, this.output_dir))) return f.dot;
	let O: Value = (yield* new_(_P, this));
	if (!(M = rt.locateIn(f, T("/obj/item/weapon/storage/bag/money"), _T))) {
		yield* this.unload_mineral((M = (yield* new_(T("/obj/item/weapon/storage/bag/money"), this))));
	}
	O.loc = M;
	return f.dot;
}, true);
