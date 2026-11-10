// Based on /tg/station's code/game/gamemodes/changeling/powers/digitalcamo.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11228, "/obj/effect/proc_holder/changeling/digitalcamo", "/obj/effect/proc_holder/changeling", {
	helptext: "We cannot be tracked by camera or seen by AI units while using this skill. However, humans looking at us will find us... uncanny.",
	dna_cost: 1,
	name: "Digital Camouflage",
	desc: "By evolving the ability to distort our form and proprotions, we defeat common altgorithms used to detect lifeforms on cameras.",
});

// digitalcamo.dm:10
rt.def("/obj/effect/proc_holder/changeling/digitalcamo/proc/sting_action", function sting_action(f: Frame, user: Value) {
	if (user.digitalcamo) {
		to_chat(user, "<span class='notice'>We return to normal.</span>");
		user.digitalinvis = 0;
		user.digitalcamo = 0;
	} else {
		to_chat(user, "<span class='notice'>We distort our form to hide from the AI</span>");
		user.digitalcamo = 1;
		user.digitalinvis = 1;
	}
	return 1;
});

// digitalcamo.dm:21
rt.def("/obj/effect/proc_holder/changeling/digitalcamo/proc/on_refund", function on_refund(f: Frame, user: Value) {
	user.digitalcamo = 0;
	user.digitalinvis = 0;
	return f.dot;
});
