// Based on /tg/station's code/game/gamemodes/devil/game_mode.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// game_mode.dm:7
rt.def("/datum/game_mode/proc/auto_declare_completion_sintouched", function auto_declare_completion_sintouched(f: Frame) {
	let sintouchedUnique: Value = null, S: Value = null, sintouched_mind: Value = null;
	let text: Value = "";
	if (rt.len(f, this.sintouched)) {
		text += "<br><span class='big'><b>The sintouched were:</b></span>";
		sintouchedUnique = uniqueList(this.sintouched);
		for (S of each(sintouchedUnique)) {
			text += this.printplayer((sintouched_mind = S));
			text += this.printobjectives(sintouched_mind);
			text += "<br>";
		}
		text += "<br>";
	}
	to_chat(rt.world(), text);
	return f.dot;
});

// game_mode.dm:20
rt.def("/datum/game_mode/proc/auto_declare_completion_devils", function auto_declare_completion_devils(f: Frame) {
	let D: Value = null, devil: Value = null;
	let text: Value = "";
	if (rt.len(f, this.devils)) {
		text += "<br><span class='big'><b>The devils were:</b></span>";
		for (D of each(this.devils)) {
			text += this.printplayer((devil = D));
			text += this.printdevilinfo(devil);
			text += this.printobjectives(devil);
			text += "<br>";
		}
		text += "<br>";
	}
	to_chat(rt.world(), text);
	return f.dot;
});

// game_mode.dm:33
rt.def("/datum/game_mode/proc/add_devil_objectives", function* add_devil_objectives(f: Frame, devil_mind: Value, quantity: Value) {
	let i: Value = null, type: Value = null, objective: Value = null;
	let $e: any;
	let validtypes: Value = list(T("/datum/objective/devil/soulquantity"), T("/datum/objective/devil/soulquality"), T("/datum/objective/devil/sintouch"), T("/datum/objective/devil/buy_target"));
	rt.forRange(f, 0, 1, quantity, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		type = pick(validtypes);
		(objective = (yield* new_(type, null))).owner = devil_mind;
		devil_mind.objectives += objective;
		if (!rt.istype(objective, T("/datum/objective/devil/buy_target"))) {
			validtypes -= type;
		} else {
			yield* objective.find_target();
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// game_mode.dm:45
rt.def("/datum/game_mode/proc/printdevilinfo", function printdevilinfo(f: Frame, ply: Value) {
	let devilinfo: Value = null;
	if (!(devilinfo = is_devil(ply))) {
		return "Target is not a devil.";
	}
	let text: Value = `</br>The devil's true name is: ${devilinfo.truename}</br>`;
	text += "The devil's bans were:</br>";
	text += `\t${rt.index(rt.index(GLOB.lawlorify, LORE), devilinfo.ban)}</br>`;
	text += `\t${rt.index(rt.index(GLOB.lawlorify, LORE), devilinfo.bane)}</br>`;
	text += `\t${rt.index(rt.index(GLOB.lawlorify, LORE), devilinfo.obligation)}</br>`;
	return (text += `\t${rt.index(rt.index(GLOB.lawlorify, LORE), devilinfo.banish)}</br></br>`);
});
