// Based on /tg/station's code/game/objects/items/weapons/implants/implant_abductor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7400, "/obj/item/weapon/implant/abductor", "/obj/item/weapon/implant", {
	home: null,
	cooldown: 30,
	activated: 1,
	name: "recall implant",
	desc: "Returns you to the mothership.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "implant",
	origin_tech: "materials=2;biotech=7;magnets=4;bluespace=4;abductor=5",
});

// implant_abductor.dm:12
rt.def("/obj/item/weapon/implant/abductor/proc/activate", function* activate(f: Frame) {
	if (this.cooldown == rt.initial(f, this, "cooldown")) {
		yield* this.home.Retrieve(this.imp_in, 1);
		this.cooldown = 0;
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		to_chat(this.imp_in, `<span class='warning'>You must wait ${30 - this.cooldown} seconds to use ${this} again!</span>`);
	}
	return f.dot;
}, true);

// implant_abductor.dm:20
rt.def("/obj/item/weapon/implant/abductor/proc/process", function process(f: Frame) {
	if (!(this.cooldown < rt.initial(f, this, "cooldown"))) return f.dot;
	this.cooldown++;
	if (this.cooldown != rt.initial(f, this, "cooldown")) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, false, { waitfor: false });

// implant_abductor.dm:26
rt.def("/obj/item/weapon/implant/abductor/proc/implant", function* implant(f: Frame, target: Value, user: Value) {
	let console: Value = null, H: Value = null, S: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		if ((H = target).dna.species.id == "abductor") {
			this.home = (console = this.get_team_console((S = H.dna.species).team)).pad;
		}
	}
	if (!this.home) {
		this.home = (console = this.get_team_console(pick(1, 2, 3, 4))).pad;
	}
	return 1;
}, true);

// implant_abductor.dm:42
rt.def("/obj/item/weapon/implant/abductor/proc/get_team_console", function get_team_console(f: Frame, team: Value) {
	let console: Value = null, c: Value = null;
	for (c of each(GLOB.machines, T("/obj/machinery/abductor/console"))) {
		if (c.team == team) {
			console = c;
			break;
		}
	}
	return console;
});
