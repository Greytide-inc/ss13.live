// From code/modules/mob/living/simple_animal/guardian/guardiannaming.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4123, "/datum/guardianname/carp", "/datum/guardianname", {
	bubbleicon: "guardian",
	theme: "carp",
	parasiteicon: "holocarp",
	stainself: 1,
});

// /datum/guardianname/carp/proc/New  (code/modules/mob/living/simple_animal/guardian/guardiannaming.dm:18)
rt.def("/datum/guardianname/carp/proc/New", function New(f: Frame) {
	rt.setSv(f, "prefixname", rt.op(f, "PickUnweighted", [1], [rt.gl("carp_names")]));
	return f.dot;
});

rt.type(4136, "/datum/guardianname/magic", "/datum/guardianname", {
	bubbleicon: "guardian",
	theme: "magic",
});

// /datum/guardianname/magic/proc/New  (code/modules/mob/living/simple_animal/guardian/guardiannaming.dm:73)
rt.def("/datum/guardianname/magic/proc/New", function New(f: Frame) {
	rt.setSv(f, "prefixname", rt.op(f, "PickUnweighted", [13], ["Aries", "Leo", "Sagittarius", "Taurus", "Virgo", "Capricorn", "Gemini", "Libra", "Aquarius", "Cancer", "Scorpio", "Pisces", "Ophiuchus"]));
	return f.dot;
});

rt.type(4142, "/datum/guardianname/tech", "/datum/guardianname", {});

// /datum/guardianname/tech/proc/New  (code/modules/mob/living/simple_animal/guardian/guardiannaming.dm:101)
rt.def("/datum/guardianname/tech/proc/New", function New(f: Frame) {
	rt.setSv(f, "prefixname", rt.op(f, "PickUnweighted", [20], ["Gallium", "Indium", "Thallium", "Bismuth", "Aluminium", "Mercury", "Iron", "Silver", "Zinc", "Titanium", "Chromium", "Nickel", "Platinum", "Tellurium", "Palladium", "Rhodium", "Cobalt", "Osmium", "Tungsten", "Iridium"]));
	return f.dot;
});
