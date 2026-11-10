// Based on /tg/station's code/modules/awaymissions/bluespaceartillery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10886, "/obj/machinery/artillerycontrol", "/obj/machinery", {
	reload: 60,
	reload_cooldown: 60,
	explosiondev: 3,
	explosionmed: 6,
	explosionlight: 12,
	anchored: 1,
	name: "bluespace artillery control",
	icon_state: "control_boxp1",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	density: 1,
});

// bluespaceartillery.dm:16
rt.def("/obj/machinery/artillerycontrol/proc/process", function process(f: Frame) {
	if (!(this.reload < this.reload_cooldown)) return f.dot;
	this.reload++;
	return f.dot;
}, false, { waitfor: false });

// bluespaceartillery.dm:29
rt.def("/obj/machinery/artillerycontrol/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	let dat: Value = "<B>Bluespace Artillery Control:</B><BR>";
	dat += "Locked on<BR>";
	dat += `<B>Charge progress: ${this.reload}/${this.reload_cooldown}:</B><BR>`;
	dat += fmt("<A href='byond://?src=＃;fire=1'>Open Fire</A><BR>", [this]);
	dat += "Deployment of weapon authorized by <br>Nanotrasen Naval Command<br><br>Remember, friendly fire is grounds for termination of your contract and life.<HR>";
	rt.op(f, "Browse", [], [user, dat, "window=scroll"], false);
	onclose(user, "scroll");
	return f.dot;
}, true);

// bluespaceartillery.dm:40
rt.def("/obj/machinery/artillerycontrol/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let A: Value = null, _T: Value = null, loc: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	A = (yield* g.op(f, "Prompt", [0], [null, A, "Open Fire", "Area to bombard", GLOB.teleportlocs]));
	let thearea: Value = rt.index(GLOB.teleportlocs, A);
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (this.reload < this.reload_cooldown) {
		return f.dot;
	}
	if (!(f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon")))) return f.dot;
	yield* priority_announce("Bluespace artillery fire detected. Brace for impact.");
	message_admins(`${key_name_admin(f.usr)} has launched an artillery strike.`);
	let L: Value = list();
	for (_T of each(get_area_turfs(thearea.type), T("/turf"))) {
		L += _T;
	}
	yield* explosion((loc = pick(L)), this.explosiondev, this.explosionmed, this.explosionlight);
	this.reload = 0;
	return f.dot;
}, true);
