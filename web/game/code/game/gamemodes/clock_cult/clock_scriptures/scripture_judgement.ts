// From code/game/gamemodes/clock_cult/clock_scriptures/scripture_judgement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_judgement.dm:15)
rt.def("/datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("ARMORER! FRIGHT! AMPERAGE! VANGUARD! I CALL UPON YOU!!", "THE TIME HAS COME FOR OUR MASTER TO BREAK THE CHAINS OF EXILE!!", "LEND US YOUR AID! ENGINE COMES!!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 5, "vanguard_cogwheel", 5, "geis_capacitor", 5, "replicant_alloy", 5, "hierophant_ansible", 5]));
	return f.dot;
});

// /datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_judgement.dm:26)
rt.def("/datum/clockwork_scripture/create_object/ark_of_the_clockwork_justiciar/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let G: Value = null, gate_area: Value = null, A: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [G, gate_area, A, _T, $e];
	if (!truthy(rt.fv(f, "no_cost", rt.sv(f, "slab")))) {
		if (truthy(rt.gl("ratvar_awakens"))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='big_brass'>\"I am already here, idiot.\"</span>"]);
			return 0;
		}
		G = null;
		rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/structure/destructible/clockwork/massive/celestial_gateway"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			gate_area = rt.call(f, P("/proc/get_area"), null, [live(G)]);
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), fmt("<span class='userdanger'>There is already an Ark at ＀!</span>", [rt.fv(f, "map_name", live(gate_area))])]);
			return 0;
		}
		rt.endFor(f, 0);
		A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "invoker")]);
		if ((((!truthy((_T = rt.getStep(f, rt.sv(f, "invoker"), 0))) || !isEqual(rt.fv(f, "z", live(_T)), 2)) || truthy((rt.istype(live(A), T("/area/shuttle")) ? 1 : 0))) || !truthy(rt.fv(f, "blob_allowed", live(A))))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You must be on the station to activate the Ark!</span>"]);
			return 0;
		}
		if (truthy(rt.gl("clockwork_gateway_activated"))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>Ratvar's recent banishment renders him too weak to be wrung forth from Reebe!</span>"]);
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
});
