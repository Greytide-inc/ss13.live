// Based on /tg/station's code/modules/hydroponics/grown/kudzu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// kudzu.dm:10
rt.def("/obj/item/seeds/kudzu/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"), T("/datum/plant_gene/trait/plant_type/weed_hardy"));

	this.mutations = list();
	this.reagents_add = rt.alist(f, ["charcoal", 0.04, "nutriment", 0.02]);
	return f.dot;
});

// kudzu.dm:20
rt.def("/obj/item/seeds/kudzu/proc/Copy", function* Copy(f: Frame) {
	let S: Value = null;
	(S = (yield* parent_proc())).mutations = (yield* this.mutations.Copy());
	return S;
}, true);

// kudzu.dm:25
rt.def("/obj/item/seeds/kudzu/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} swallows the pack of kudzu seeds! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	yield* this.plant(user);
	return 1;
}, true);

// kudzu.dm:30
rt.def("/obj/item/seeds/kudzu/proc/plant", function* plant(f: Frame, user: Value) {
	let $1: any;
	if (rt.istype(user.loc, T("/turf/open/space"))) {
		return f.dot;
	}
	if (!isturf(user.loc)) {
		to_chat(user, `<span class='warning'>You need more space to plant ${this}.</span>`);
		return 0;
	}
	if (rt.locateIn(f, T("/obj/structure/spacevine"), user.loc)) {
		to_chat(user, `<span class='warning'>There is too much kudzu here to plant ${this}.</span>`);
		return 0;
	}
	to_chat(user, `<span class='notice'>You plant ${this}.</span>`);
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	if (user) {
		$1 = `${`(${user.x},${user.y},${user.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${user.x};Y=${user.y};Z=${user.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`Kudzu planted by ${$0} at ${`${$1}`}`, 0, 1);
	this.investigate_log(`was planted by ${key_name(user)} at ${`(${user.x},${user.y},${user.z})`}`, "botany");
	yield* new_(T("/datum/spacevine_controller"), rt.getStep(f, user, 0), this.mutations, this.potency, this.production);
	yield* qdel(this);
	return f.dot;
}, true);

// kudzu.dm:45
rt.def("/obj/item/seeds/kudzu/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.plant(user);
	to_chat(user, "<span class='notice'>You plant the kudzu. You monster.</span>");
	return f.dot;
}, true);

// kudzu.dm:49
rt.def("/obj/item/seeds/kudzu/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	let SM: Value = null;
	let $e: any;
	let text: Value = parent_proc();
	let text_string: Value = "";
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		text_string += `${text_string == "" ? "" : ", "}${SM.name}`;
	}
	return (text += `\n- Plant Mutations: ${text_string == "" ? "None" : text_string}`);
});

// kudzu.dm:57
rt.def("/obj/item/seeds/kudzu/proc/on_chem_reaction", function on_chem_reaction(f: Frame, S: Value) {
	let SM: Value = null;
	let temp_mut_list: Value = list();
	if (S.has_reagent("sterilizine", 5)) {
		for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
			if (SM.quality == NEGATIVE) {
				temp_mut_list += SM;
			}
		}
		if (prob(20) && rt.len(f, temp_mut_list)) {
			this.mutations.Remove(pick(temp_mut_list));
		}
		temp_mut_list.Cut();
	}
	if (S.has_reagent("welding_fuel", 5)) {
		SM = null;
		for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
			if (SM.quality == POSITIVE) {
				temp_mut_list += SM;
			}
		}
		if (prob(20) && rt.len(f, temp_mut_list)) {
			this.mutations.Remove(pick(temp_mut_list));
		}
		temp_mut_list.Cut();
	}
	if (S.has_reagent("phenol", 5)) {
		SM = null;
		for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
			if (SM.quality == MINOR_NEGATIVE) {
				temp_mut_list += SM;
			}
		}
		if (prob(20) && rt.len(f, temp_mut_list)) {
			this.mutations.Remove(pick(temp_mut_list));
		}
		temp_mut_list.Cut();
	}
	if (S.has_reagent("blood", 15)) {
		this.adjust_production(rand(15, -5));
	}
	if (S.has_reagent("amatoxin", 5)) {
		this.adjust_production(rand(5, -15));
	}
	if (S.has_reagent("plasma", 5)) {
		this.adjust_potency(rand(5, -15));
	}
	if (!S.has_reagent("holywater", 10)) return f.dot;
	this.adjust_potency(rand(15, -5));
	return f.dot;
});
