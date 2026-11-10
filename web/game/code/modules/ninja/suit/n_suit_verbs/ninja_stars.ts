// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_stars.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// ninja_stars.dm:5
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjastar", function* ninjastar(f: Frame) {
	if (this.ninjacost(10)) return f.dot;
	let H: Value = this.affecting;
	let N: Value = (yield* new_(T("/obj/item/weapon/throwing_star/ninja"), H));
	if (yield* H.put_in_hands(N)) {
		to_chat(H, "<span class='notice'>A throwing star has been created in your hand!</span>");
	} else {
		yield* qdel(N);
	}
	H.throw_mode_on();
	return f.dot;
}, true);
