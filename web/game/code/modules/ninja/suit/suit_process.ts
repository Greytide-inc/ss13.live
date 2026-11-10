// Based on /tg/station's code/modules/ninja/suit/suit_process.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// suit_process.dm:6
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ntick", function ntick(f: Frame, U: Value) {
	U ??= this.affecting;
	rt.spawnTail(f, 0, "/obj/item/clothing/suit/space/space_ninja/proc/ntick: spawn at modules/ninja/suit/suit_process.dm:6", U);
	return f.dot;
});

// a spawn(0) body of /obj/item/clothing/suit/space/space_ninja/proc/ntick, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ntick: spawn at modules/ninja/suit/suit_process.dm:6", function* (f: Frame, U: Value) {
	while (this.s_initialized) {
		if (!this.affecting) {
			yield* this.terminate();
		} else if (this.cell.charge > 0) {
			if (this.s_coold) {
				this.s_coold--;
			}
			this.cell.charge -= this.s_cost;
			if (this.s_active) {
				this.cell.charge -= this.s_acost;
			}
		} else {
			this.cell.charge = 0;
			this.cancel_stealth();
		}
		yield* sleep(10);
	}
	return null;
});
