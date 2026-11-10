// Based on /tg/station's code/game/gamemodes/clock_cult/clock_scriptures/scripture_judgement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1217, "/datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar", "/datum/clockwork_scripture/create_object", {
	descname: "Structure, Win Condition",
	name: "Ark of the Clockwork Justiciar",
	desc: "Tears apart a rift in spacetime to Reebe, the Celestial Derelict, using a massive amount of components.\nThis gateway will, after some time, call forth Ratvar from his exile and massively empower all scriptures and tools.",
	invocations: null,
	channel_time: 150,
	consumed_components: null,
	invokers_required: 6,
	multiple_invokers_used: 1,
	creator_message: null,
	usage_tip: "The gateway is completely vulnerable to attack during its five-minute duration. It will periodically give indication of its general position to everyone on the station as well as being loud enough to be heard throughout the entire sector. Defend it with your life!",
	tier: "Judgement",
	sort_priority: 1,
	object_path: rt.typePath("/obj/structure/destructible/clockwork/massive/celestial_gateway"),
});

// scripture_judgement.dm:15
rt.def("/datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("ARMORER! FRIGHT! AMPERAGE! VANGUARD! I CALL UPON YOU!!", "THE TIME HAS COME FOR OUR MASTER TO BREAK THE CHAINS OF EXILE!!", "LEND US YOUR AID! ENGINE COMES!!");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 5, "vanguard_cogwheel", 5, "geis_capacitor", 5, "replicant_alloy", 5, "hierophant_ansible", 5]);
	return f.dot;
});

// scripture_judgement.dm:26
rt.def("/datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let G: Value = null, gate_area: Value = null, A: Value = null, _T: Value = null;
	if (!this.slab.no_cost) {
		if (GLOB.ratvar_awakens) {
			to_chat(this.invoker, "<span class='big_brass'>\"I am already here, idiot.\"</span>");
			return 0;
		}
		for (G of each(GLOB.all_clockwork_objects, T("/obj/structure/destructible/clockwork/massive/celestial_gateway"))) {
			gate_area = get_area(G);
			to_chat(this.invoker, `<span class='userdanger'>There is already an Ark at ${gate_area.map_name}!</span>`);
			return 0;
		}
		A = get_area(this.invoker);
		if (!(_T = rt.getStep(f, this.invoker, 0)) || _T.z != ZLEVEL_STATION || rt.istype(A, T("/area/shuttle")) || !A.blob_allowed) {
			to_chat(this.invoker, "<span class='warning'>You must be on the station to activate the Ark!</span>");
			return 0;
		}
		if (GLOB.clockwork_gateway_activated) {
			to_chat(this.invoker, "<span class='warning'>Ratvar's recent banishment renders him too weak to be wrung forth from Reebe!</span>");
			return 0;
		}
	}
	return parent_proc();
});
