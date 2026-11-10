// Based on /tg/station's code/modules/hydroponics/seed_extractor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// seed_extractor.dm:3
rt.def("/proc/seedify", function* seedify(f: Frame, O: Value, t_max: Value, extractor: Value, user: Value) {
	let F: Value = null, t_prod: Value = null;
	let t_amount: Value = 0;
	if (t_max == -1) {
		if (extractor) {
			t_max = rand(1, 4) * extractor.seed_multiplier;
		} else {
			t_max = rand(1, 4);
		}
	}
	let seedloc: Value = O.loc;
	if (extractor) {
		seedloc = extractor.loc;
	}
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
		if ((F = O).seed) {
			if (user && !(yield* user.drop_item())) {
				return f.dot;
			}
			while (t_amount < t_max) {
				(t_prod = (yield* F.seed.Copy())).loc = seedloc;
				t_amount++;
			}
			yield* qdel(O);
			return 1;
		}
	} else if (rt.istype(O, T("/obj/item/weapon/grown"))) {
		if ((F = O).seed) {
			if (user && !(yield* user.drop_item())) {
				return f.dot;
			}
			while (t_amount < t_max) {
				(t_prod = (yield* F.seed.Copy())).loc = seedloc;
				t_amount++;
			}
			yield* qdel(O);
		}
		return 1;
	}
	return 0;
}, true);

rt.type(10923, "/obj/machinery/seed_extractor", "/obj/machinery", {
	piles: null,
	max_seeds: 1000,
	seed_multiplier: 1,
	anchored: 1,
	name: "seed extractor",
	desc: "Extracts and bags seeds from produce.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "sextractor",
	density: 1,
});

// seed_extractor.dm:47
rt.def("/obj/machinery/seed_extractor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.piles = list();
	return f.dot;
});

// seed_extractor.dm:52
rt.def("/obj/machinery/seed_extractor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/seed_extractor"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6759, "/obj/item/weapon/circuitboard/machine/seed_extractor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Seed Extractor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/seed_extractor"),
	origin_tech: "programming=1",
});

// seed_extractor.dm:60
rt.def("/obj/item/weapon/circuitboard/machine/seed_extractor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);
	return f.dot;
});

// seed_extractor.dm:65
rt.def("/obj/machinery/seed_extractor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		this.max_seeds = 1000 * B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		this.seed_multiplier = M.rating;
	}
	return f.dot;
});

// seed_extractor.dm:72
rt.def("/obj/machinery/seed_extractor/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let _P: Value = null, loaded: Value = null, G: Value = null;
	if (this.default_deconstruction_screwdriver(user, "sextractor_open", "sextractor", O)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(O)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, O)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/storage/bag/plants"))) {
		_P = O;
		loaded = 0;
		for (G of each(_P.contents, T("/obj/item/seeds"))) {
			if (rt.len(f, this.contents) >= this.max_seeds) {
				break;
			}
			loaded++;
			yield* this.add_seed(G);
		}
		if (loaded) {
			to_chat(user, fmt("<span class='notice'>You put the seeds from ％！ into ＀.</span>", [O.name, this]));
		} else {
			to_chat(user, fmt("<span class='notice'>There are no seeds in ％！.</span>", [O.name]));
		}
		return f.dot;
	} else if (yield* seedify(O, -1, this, user)) {
		to_chat(user, "<span class='notice'>You extract some seeds.</span>");
		return f.dot;
	} else if (rt.istype(O, T("/obj/item/seeds"))) {
		if (yield* this.add_seed(O)) {
			to_chat(user, `<span class='notice'>You add ${O} to ${this.name}.</span>`);
			yield* this.updateUsrDialog();
		}
		return f.dot;
	} else if (user.a_intent != "harm") {
		to_chat(user, fmt("<span class='warning'>You can't extract any seeds from ％！!</span>", [O.name]));
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// seed_extractor.dm:135
rt.def("/obj/machinery/seed_extractor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// seed_extractor.dm:142
rt.def("/obj/machinery/seed_extractor/proc/interact", function* interact(f: Frame, user: Value) {
	let O: Value = null, popup: Value = null;
	if (this.stat) {
		return 0;
	}
	let dat: Value = "<b>Stored seeds:</b><br>";
	if (rt.len(f, this.contents) == 0) {
		dat += "<font color='red'>No seeds</font>";
	} else {
		dat += "<table cellpadding='3' style='text-align:center;'><tr><td>Name</td><td>Lifespan</td><td>Endurance</td><td>Maturation</td><td>Production</td><td>Yield</td><td>Potency</td><td>Stock</td></tr>";
		for (O of each(this.piles, T("/datum/seed_pile"))) {
			dat += `<tr><td>${O.name}</td><td>${O.lifespan}</td><td>${O.endurance}</td><td>${O.maturation}</td>`;
			dat += `<td>${O.production}</td><td>${O.yield}</td><td>${O.potency}</td><td>`;
			dat += fmt("<a href='byond://?src=＃;name=＀;li=＀;en=＀;ma=＀;pr=＀;yi=＀;pot=＀'>Vend</a> (＀ left)</td></tr>", [this, O.name, O.lifespan, O.endurance, O.maturation, O.production, O.yield, O.potency, O.amount]);
		}
		dat += "</table>";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "seed_ext", this.name, 700, 400))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// seed_extractor.dm:159
rt.def("/obj/machinery/seed_extractor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let N: Value = null, _T: Value = null, O: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	rt.setAt(href_list, "li", text2num(rt.at(href_list, "li")));
	rt.setAt(href_list, "en", text2num(rt.at(href_list, "en")));
	rt.setAt(href_list, "ma", text2num(rt.at(href_list, "ma")));
	rt.setAt(href_list, "pr", text2num(rt.at(href_list, "pr")));
	rt.setAt(href_list, "yi", text2num(rt.at(href_list, "yi")));
	rt.setAt(href_list, "pot", text2num(rt.at(href_list, "pot")));
	for (N of each(this.piles, T("/datum/seed_pile"))) {
		if (rt.at(href_list, "name") == N.name && rt.at(href_list, "li") == N.lifespan && rt.at(href_list, "en") == N.endurance && rt.at(href_list, "ma") == N.maturation && rt.at(href_list, "pr") == N.production && rt.at(href_list, "yi") == N.yield && rt.at(href_list, "pot") == N.potency) {
			if (N.amount <= 0) {
				return f.dot;
			}
			N.amount = max(N.amount - 1, 0);
			if (N.amount <= 0) {
				this.piles -= N;
				yield* qdel(N);
			}
			break;
		}
	}
	for (_T of each(this.contents, T("/obj"))) {
		if ((O = _T).plantname == rt.at(href_list, "name") && O.lifespan == rt.at(href_list, "li") && O.endurance == rt.at(href_list, "en") && O.maturation == rt.at(href_list, "ma") && O.production == rt.at(href_list, "pr") && O.yield == rt.at(href_list, "yi") && O.potency == rt.at(href_list, "pot")) {
			O.loc = this.loc;
			break;
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// seed_extractor.dm:190
rt.def("/obj/machinery/seed_extractor/proc/add_seed", function* add_seed(f: Frame, O: Value) {
	let M: Value = null, S: Value = null, N: Value = null;
	if (rt.len(f, this.contents) >= 999) {
		to_chat(f.usr, fmt("<span class='notice'>＄！ is full.</span>", [this]));
		return 0;
	}
	if (ismob(O.loc)) {
		if (!(yield* (M = O.loc).drop_item())) {
			return 0;
		}
	} else if (rt.istype(O.loc, T("/obj/item/weapon/storage"))) {
		yield* (S = O.loc).remove_from_storage(O, this);
	}
	O.loc = this;
	f.dot = 1;
	for (N of each(this.piles, T("/datum/seed_pile"))) {
		if (O.plantname == N.name && O.lifespan == N.lifespan && O.endurance == N.endurance && O.maturation == N.maturation && O.production == N.production && O.yield == N.yield && O.potency == N.potency) {
			++N.amount;
			return f.dot;
		}
	}
	this.piles += (yield* new_(T("/datum/seed_pile"), O.plantname, O.lifespan, O.endurance, O.maturation, O.production, O.yield, O.potency));
	return f.dot;
}, true);
