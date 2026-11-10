// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/guardiannaming.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4123, "/datum/guardianname/carp", "/datum/guardianname", {
	bubbleicon: "guardian",
	theme: "carp",
	parasiteicon: "holocarp",
	stainself: 1,
});

// guardiannaming.dm:18
rt.def("/datum/guardianname/carp/proc/New", function New(f: Frame) {
	this.prefixname = pick(GLOB.carp_names);
	return f.dot;
});

rt.type(4136, "/datum/guardianname/magic", "/datum/guardianname", {
	bubbleicon: "guardian",
	theme: "magic",
});

// guardiannaming.dm:73
rt.def("/datum/guardianname/magic/proc/New", function New(f: Frame) {
	this.prefixname = pick("Aries", "Leo", "Sagittarius", "Taurus", "Virgo", "Capricorn", "Gemini", "Libra", "Aquarius", "Cancer", "Scorpio", "Pisces", "Ophiuchus");
	return f.dot;
});

rt.type(4142, "/datum/guardianname/tech", "/datum/guardianname", {});

// guardiannaming.dm:101
rt.def("/datum/guardianname/tech/proc/New", function New(f: Frame) {
	this.prefixname = pick("Gallium", "Indium", "Thallium", "Bismuth", "Aluminium", "Mercury", "Iron", "Silver", "Zinc", "Titanium", "Chromium", "Nickel", "Platinum", "Tellurium", "Palladium", "Rhodium", "Cobalt", "Osmium", "Tungsten", "Iridium");
	return f.dot;
});
