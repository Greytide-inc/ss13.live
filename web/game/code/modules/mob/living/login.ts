// Based on /tg/station's code/modules/mob/living/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// login.dm:2
rt.def("/mob/living/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	this.sync_mind();
	this.mind.show_memory(this, 0);
	if (GLOB.SSticker.mode) {
		if (GLOB.SSticker.mode.name === "sandbox") {
			yield* this.CanBuild();
		}
	}
	yield* this.update_damage_hud();
	this.update_health_hud();
	if (this.ventcrawler) {
		to_chat(this, "<span class='notice'>You can ventcrawl! Use alt+click on vents to quickly travel about the station.</span>");
	}
	if (!this.ranged_ability) return f.dot;
	yield* this.ranged_ability.add_ranged_ability(this, `<span class='notice'>You currently have <b>${this.ranged_ability}</b> active!</span>`);
	return f.dot;
}, true);
