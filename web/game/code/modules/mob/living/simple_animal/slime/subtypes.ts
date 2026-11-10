// Based on /tg/station's code/modules/mob/living/simple_animal/slime/subtypes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// subtypes.dm:2
rt.def("/mob/living/simple_animal/slime/proc/mutation_table", function mutation_table(f: Frame, colour: Value) {
	let slime_mutation: Value = rt.op(f, "CreateMultidimensionalList", [1], [4]);
	if (colour === "grey") {
		rt.setAt(slime_mutation, 1, "orange");
		rt.setAt(slime_mutation, 2, "metal");
		rt.setAt(slime_mutation, 3, "blue");
		rt.setAt(slime_mutation, 4, "purple");
	} else if (colour === "purple") {
		rt.setAt(slime_mutation, 1, "dark purple");
		rt.setAt(slime_mutation, 2, "dark blue");
		rt.setAt(slime_mutation, 3, "green");
		rt.setAt(slime_mutation, 4, "green");
	} else if (colour === "metal") {
		rt.setAt(slime_mutation, 1, "silver");
		rt.setAt(slime_mutation, 2, "yellow");
		rt.setAt(slime_mutation, 3, "gold");
		rt.setAt(slime_mutation, 4, "gold");
	} else if (colour === "orange") {
		rt.setAt(slime_mutation, 1, "dark purple");
		rt.setAt(slime_mutation, 2, "yellow");
		rt.setAt(slime_mutation, 3, "red");
		rt.setAt(slime_mutation, 4, "red");
	} else if (colour === "blue") {
		rt.setAt(slime_mutation, 1, "dark blue");
		rt.setAt(slime_mutation, 2, "silver");
		rt.setAt(slime_mutation, 3, "pink");
		rt.setAt(slime_mutation, 4, "pink");
	} else if (colour === "dark blue") {
		rt.setAt(slime_mutation, 1, "purple");
		rt.setAt(slime_mutation, 2, "blue");
		rt.setAt(slime_mutation, 3, "cerulean");
		rt.setAt(slime_mutation, 4, "cerulean");
	} else if (colour === "dark purple") {
		rt.setAt(slime_mutation, 1, "purple");
		rt.setAt(slime_mutation, 2, "orange");
		rt.setAt(slime_mutation, 3, "sepia");
		rt.setAt(slime_mutation, 4, "sepia");
	} else if (colour === "yellow") {
		rt.setAt(slime_mutation, 1, "metal");
		rt.setAt(slime_mutation, 2, "orange");
		rt.setAt(slime_mutation, 3, "bluespace");
		rt.setAt(slime_mutation, 4, "bluespace");
	} else if (colour === "silver") {
		rt.setAt(slime_mutation, 1, "metal");
		rt.setAt(slime_mutation, 2, "blue");
		rt.setAt(slime_mutation, 3, "pyrite");
		rt.setAt(slime_mutation, 4, "pyrite");
	} else if (colour === "pink") {
		rt.setAt(slime_mutation, 1, "pink");
		rt.setAt(slime_mutation, 2, "pink");
		rt.setAt(slime_mutation, 3, "light pink");
		rt.setAt(slime_mutation, 4, "light pink");
	} else if (colour === "red") {
		rt.setAt(slime_mutation, 1, "red");
		rt.setAt(slime_mutation, 2, "red");
		rt.setAt(slime_mutation, 3, "oil");
		rt.setAt(slime_mutation, 4, "oil");
	} else if (colour === "gold") {
		rt.setAt(slime_mutation, 1, "gold");
		rt.setAt(slime_mutation, 2, "gold");
		rt.setAt(slime_mutation, 3, "adamantine");
		rt.setAt(slime_mutation, 4, "adamantine");
	} else if (colour === "green") {
		rt.setAt(slime_mutation, 1, "green");
		rt.setAt(slime_mutation, 2, "green");
		rt.setAt(slime_mutation, 3, "black");
		rt.setAt(slime_mutation, 4, "black");
	} else {
		rt.setAt(slime_mutation, 1, colour);
		rt.setAt(slime_mutation, 2, colour);
		rt.setAt(slime_mutation, 3, colour);
		rt.setAt(slime_mutation, 4, colour);
	}
	return slime_mutation;
});
