// Based on /tg/station's code/modules/hydroponics/grown/replicapod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// replicapod.dm:26
rt.def("/obj/item/seeds/replicapod/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let bloodSample: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers/syringe"))) {
		if (!this.contains_sample) {
			for (bloodSample of each(W.reagents.reagent_list, T("/datum/reagent/blood"))) {
				if (rt.index(bloodSample.data, "mind") && rt.index(bloodSample.data, "cloneable") == 1) {
					this.mind = rt.index(bloodSample.data, "mind");
					this.ckey = rt.index(bloodSample.data, "ckey");
					this.realName = rt.index(bloodSample.data, "real_name");
					this.blood_gender = rt.index(bloodSample.data, "gender");
					this.blood_type = rt.index(bloodSample.data, "blood_type");
					this.features = rt.index(bloodSample.data, "features");
					this.factions = rt.index(bloodSample.data, "factions");
					yield* W.reagents.clear_reagents();
					to_chat(user, "<span class='notice'>You inject the contents of the syringe into the seeds.</span>");
					this.contains_sample = 1;
				} else {
					to_chat(user, "<span class='warning'>The seeds reject the sample!</span>");
				}
			}
		} else {
			to_chat(user, "<span class='warning'>The seeds already contain a genetic sample!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// replicapod.dm:48
rt.def("/obj/item/seeds/replicapod/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	let text: Value = parent_proc();
	if (this.contains_sample) {
		text += "\n It contains a blood sample!";
	}
	return text;
});

// replicapod.dm:55
rt.def("/obj/item/seeds/replicapod/proc/harvest", function* harvest(f: Frame, user: Value) {
	let ckey_holder: Value = null, M: Value = null, O: Value = null, L: Value = null, podman: Value = null, seed_count: Value = null, output_loc: Value = null, i: Value = null, harvestseeds: Value = null;
	let $e: any;
	user ??= f.usr;
	let parent: Value = this.loc;
	let make_podman: Value = 0;
	if (GLOB.config.revival_pod_plants) {
		if (this.ckey) {
			for (M of each(GLOB.player_list, T("/mob"))) {
				if (rt.istype(M, T("/mob/dead/observer"))) {
					if ((O = M).ckey == this.ckey && O.can_reenter_corpse) {
						make_podman = 1;
						break;
					}
				} else if (M.ckey == this.ckey && M.stat == 2 && !M.suiciding) {
					make_podman = 1;
					if (rt.istype(M, T("/mob/living"))) {
						make_podman = (!(L = M).hellbound ? 1 : 0);
					}
					break;
				}
			}
		} else {
			M = null;
			for (M of each(GLOB.player_list, T("/mob"))) {
				if (this.mind && M.mind && ckey(M.mind.key) == ckey(this.mind.key) && M.ckey && M.client && M.stat == 2 && !M.suiciding) {
					if (rt.istype(M, T("/mob/dead/observer"))) {
						if (!(O = M).can_reenter_corpse) {
							break;
						}
					}
					make_podman = 1;
					if (rt.istype(M, T("/mob/living"))) {
						make_podman = (!(L = M).hellbound ? 1 : 0);
					}
					ckey_holder = M.ckey;
					break;
				}
			}
		}
	}
	if (make_podman) {
		podman = (yield* new_(T("/mob/living/carbon/human"), parent.loc));
		if (this.realName) {
			podman.real_name = this.realName;
		} else {
			podman.real_name = `Pod Person ${rand(0, 999)}`;
		}
		yield* this.mind.transfer_to(podman);
		if (this.ckey) {
			podman.ckey = this.ckey;
		} else {
			podman.ckey = ckey_holder;
		}
		podman.gender = this.blood_gender;
		(rt.modField(f, podman, "faction", this.factions, rt.bitOr));
		if (!rt.at(this.features, "mcolor")) {
			rt.setAt(this.features, "mcolor", "#59CE00");
		}
		yield* podman.hardset_dna(null, null, podman.real_name, this.blood_type, T("/datum/species/pod"), this.features);
		yield* podman.set_cloned_appearance();
	} else {
		seed_count = 1;
		if (prob(this.getYield() * 20)) {
			seed_count++;
		}
		output_loc = parent.Adjacent(user) ? user.loc : parent.loc;
		i = 0;
		while (i < seed_count) {
			yield* (harvestseeds = (yield* this.Copy())).forceMove(output_loc);
			i++;
		}
	}
	yield* parent.update_tray();
	return f.dot;
}, true);
