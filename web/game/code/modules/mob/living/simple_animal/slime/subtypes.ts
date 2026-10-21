// From code/modules/mob/living/simple_animal/slime/subtypes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/slime/proc/mutation_table  (code/modules/mob/living/simple_animal/slime/subtypes.dm:2)
rt.def("/mob/living/simple_animal/slime/proc/mutation_table", function mutation_table(f: Frame, colour: Value) {
	let slime_mutation: Value = null;
	let $0: any;
	f.vars = () => [slime_mutation, $0];
	slime_mutation = rt.op(f, "CreateMultidimensionalList", [1], [4]);
	$0 = live(colour);
	if ($0 === "grey") {
		rt.setAt(live(slime_mutation), 1, "orange");
		rt.setAt(live(slime_mutation), 2, "metal");
		rt.setAt(live(slime_mutation), 3, "blue");
		rt.setAt(live(slime_mutation), 4, "purple");
	} else if ($0 === "purple") {
		rt.setAt(live(slime_mutation), 1, "dark purple");
		rt.setAt(live(slime_mutation), 2, "dark blue");
		rt.setAt(live(slime_mutation), 3, "green");
		rt.setAt(live(slime_mutation), 4, "green");
	} else if ($0 === "metal") {
		rt.setAt(live(slime_mutation), 1, "silver");
		rt.setAt(live(slime_mutation), 2, "yellow");
		rt.setAt(live(slime_mutation), 3, "gold");
		rt.setAt(live(slime_mutation), 4, "gold");
	} else if ($0 === "orange") {
		rt.setAt(live(slime_mutation), 1, "dark purple");
		rt.setAt(live(slime_mutation), 2, "yellow");
		rt.setAt(live(slime_mutation), 3, "red");
		rt.setAt(live(slime_mutation), 4, "red");
	} else if ($0 === "blue") {
		rt.setAt(live(slime_mutation), 1, "dark blue");
		rt.setAt(live(slime_mutation), 2, "silver");
		rt.setAt(live(slime_mutation), 3, "pink");
		rt.setAt(live(slime_mutation), 4, "pink");
	} else if ($0 === "dark blue") {
		rt.setAt(live(slime_mutation), 1, "purple");
		rt.setAt(live(slime_mutation), 2, "blue");
		rt.setAt(live(slime_mutation), 3, "cerulean");
		rt.setAt(live(slime_mutation), 4, "cerulean");
	} else if ($0 === "dark purple") {
		rt.setAt(live(slime_mutation), 1, "purple");
		rt.setAt(live(slime_mutation), 2, "orange");
		rt.setAt(live(slime_mutation), 3, "sepia");
		rt.setAt(live(slime_mutation), 4, "sepia");
	} else if ($0 === "yellow") {
		rt.setAt(live(slime_mutation), 1, "metal");
		rt.setAt(live(slime_mutation), 2, "orange");
		rt.setAt(live(slime_mutation), 3, "bluespace");
		rt.setAt(live(slime_mutation), 4, "bluespace");
	} else if ($0 === "silver") {
		rt.setAt(live(slime_mutation), 1, "metal");
		rt.setAt(live(slime_mutation), 2, "blue");
		rt.setAt(live(slime_mutation), 3, "pyrite");
		rt.setAt(live(slime_mutation), 4, "pyrite");
	} else if ($0 === "pink") {
		rt.setAt(live(slime_mutation), 1, "pink");
		rt.setAt(live(slime_mutation), 2, "pink");
		rt.setAt(live(slime_mutation), 3, "light pink");
		rt.setAt(live(slime_mutation), 4, "light pink");
	} else if ($0 === "red") {
		rt.setAt(live(slime_mutation), 1, "red");
		rt.setAt(live(slime_mutation), 2, "red");
		rt.setAt(live(slime_mutation), 3, "oil");
		rt.setAt(live(slime_mutation), 4, "oil");
	} else if ($0 === "gold") {
		rt.setAt(live(slime_mutation), 1, "gold");
		rt.setAt(live(slime_mutation), 2, "gold");
		rt.setAt(live(slime_mutation), 3, "adamantine");
		rt.setAt(live(slime_mutation), 4, "adamantine");
	} else if ($0 === "green") {
		rt.setAt(live(slime_mutation), 1, "green");
		rt.setAt(live(slime_mutation), 2, "green");
		rt.setAt(live(slime_mutation), 3, "black");
		rt.setAt(live(slime_mutation), 4, "black");
	} else {
		rt.setAt(live(slime_mutation), 1, live(colour));
		rt.setAt(live(slime_mutation), 2, live(colour));
		rt.setAt(live(slime_mutation), 3, live(colour));
		rt.setAt(live(slime_mutation), 4, live(colour));
	}
	return live(slime_mutation);
});
