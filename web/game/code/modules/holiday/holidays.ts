// From code/modules/holiday/holidays.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2661, "/datum/holiday", "/datum", {
	name: "Bugsgiving",
	begin_day: 1,
	begin_month: 0,
	end_day: 0,
	end_month: 0,
	begin_week: 0,
	begin_weekday: 0,
	always_celebrate: 0,
});

// /datum/holiday/proc/greet  (code/modules/holiday/holidays.dm:18)
rt.def("/datum/holiday/proc/greet", function greet(f: Frame) {
	return fmt("Have a happy ＀!", [rt.sv(f, "name")]);
});

// /datum/holiday/proc/getStationPrefix  (code/modules/holiday/holidays.dm:23)
rt.def("/datum/holiday/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	i = rt.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), " ", 1, 0]);
	return rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "name"), 1, live(i)]);
});

// /datum/holiday/proc/shouldCelebrate  (code/modules/holiday/holidays.dm:31)
rt.def("/datum/holiday/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (truthy(rt.sv(f, "always_celebrate"))) {
		return 1;
	}
	if (!truthy(rt.sv(f, "end_day"))) {
		rt.setSv(f, "end_day", rt.sv(f, "begin_day"));
	}
	if (!truthy(rt.sv(f, "end_month"))) {
		rt.setSv(f, "end_month", rt.sv(f, "begin_month"));
	}
	if ((truthy(rt.sv(f, "begin_week")) && truthy(rt.sv(f, "begin_weekday")))) {
		if ((isEqual(rt.sv(f, "begin_week"), live(ww)) && isEqual(rt.sv(f, "begin_weekday"), live(ddd)))) {
			return 1;
		}
	}
	if (rt.gt(rt.sv(f, "end_month"), rt.sv(f, "begin_month"))) {
		if (isEqual(live(mm), rt.sv(f, "end_month"))) {
			if (rt.le(live(dd), rt.sv(f, "end_day"))) {
				return 1;
			}
		} else {
			if (isEqual(live(mm), rt.sv(f, "begin_month"))) {
				if (rt.ge(live(dd), rt.sv(f, "begin_day"))) {
					return 1;
				}
			} else {
				if (truthy(rt.op(f, "IsInRange", [], [live(mm), rt.sv(f, "begin_month"), rt.sv(f, "end_month")]))) {
					return 1;
				}
			}
		}
	} else {
		if (isEqual(rt.sv(f, "end_month"), rt.sv(f, "begin_month"))) {
			if ((isEqual(live(mm), rt.sv(f, "begin_month")) && truthy(rt.op(f, "IsInRange", [], [live(dd), rt.sv(f, "begin_day"), rt.sv(f, "end_day")])))) {
				return 1;
			}
		} else {
			if ((rt.ge(live(mm), rt.sv(f, "begin_month")) && rt.ge(live(dd), rt.sv(f, "begin_day")))) {
				return 1;
			}
			if ((rt.le(live(mm), rt.sv(f, "end_month")) && rt.le(live(dd), rt.sv(f, "end_day")))) {
				return 1;
			}
		}
	}
	return 0;
});

rt.type(2663, "/datum/holiday/new_year", "/datum/holiday", {
	name: "New Year",
	begin_day: 30,
	begin_month: 12,
	end_day: 2,
	end_month: 1,
});

// /datum/holiday/new_year/proc/getStationPrefix  (code/modules/holiday/holidays.dm:72)
rt.def("/datum/holiday/new_year/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [4], ["Party", "New", "Hangover", "Resolution"]);
});

rt.type(2665, "/datum/holiday/valentines", "/datum/holiday", {
	name: "Valentine's Day",
	begin_day: 13,
	end_day: 15,
	begin_month: 2,
});

// /datum/holiday/valentines/proc/getStationPrefix  (code/modules/holiday/holidays.dm:86)
rt.def("/datum/holiday/valentines/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [5], ["Love", "Amore", "Single", "Smootch", "Hug"]);
});

rt.type(2666, "/datum/holiday/birthday", "/datum/holiday", {
	name: "Birthday of Space Station 13",
	begin_day: 16,
	begin_month: 2,
});

// /datum/holiday/birthday/proc/greet  (code/modules/holiday/holidays.dm:94)
rt.def("/datum/holiday/birthday/proc/greet", function greet(f: Frame) {
	let game_age: Value = null, Fact: Value = null;
	let $0: any;
	f.vars = () => [game_age, Fact, $0];
	game_age = subtract(rt.call(f, P("/proc/text2num"), null, [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "YY"])]), 3);
	Fact = null;
	$0 = live(game_age);
	if ($0 === 16) {
		Fact = " SS13 is now old enough to drive!";
	} else if ($0 === 18) {
		Fact = " SS13 is now legal!";
	} else if ($0 === 21) {
		Fact = " SS13 can now drink!";
	} else if ($0 === 26) {
		Fact = " SS13 can now rent a car!";
	} else if ($0 === 30) {
		Fact = " SS13 can now go home and be a family man!";
	} else if ($0 === 40) {
		Fact = " SS13 can now suffer a midlife crisis!";
	} else if ($0 === 50) {
		Fact = " Happy golden anniversary!";
	} else if ($0 === 65) {
		Fact = " SS13 can now start thinking about retirement!";
	} else if ($0 === 96) {
		Fact = " Please send a time machine back to pick me up, I need to update the time formatting for this feature!";
	}
	if (!truthy(live(Fact))) {
		Fact = fmt(" SS13 is now ＀ years old!", [live(game_age)]);
	}
	return fmt("Say 'Happy Birthday' to Space Station 13, first publicly playable on February 16th, 2003!＀", [live(Fact)]);
});

rt.type(2667, "/datum/holiday/random_kindness", "/datum/holiday", {
	name: "Random Acts of Kindness Day",
	begin_day: 17,
	begin_month: 2,
});

// /datum/holiday/random_kindness/proc/greet  (code/modules/holiday/holidays.dm:126)
rt.def("/datum/holiday/random_kindness/proc/greet", function greet(f: Frame) {
	return "Go do some random acts of kindness for a stranger!";
});

rt.type(2670, "/datum/holiday/no_this_is_patrick", "/datum/holiday", {
	name: "St. Patrick's Day",
	begin_day: 17,
	begin_month: 3,
});

// /datum/holiday/no_this_is_patrick/proc/getStationPrefix  (code/modules/holiday/holidays.dm:144)
rt.def("/datum/holiday/no_this_is_patrick/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [4], ["Blarney", "Green", "Leprechaun", "Booze"]);
});

rt.type(2671, "/datum/holiday/april_fools", "/datum/holiday", {
	name: "April Fool's Day",
	begin_day: 1,
	end_day: 2,
	begin_month: 4,
});

// /datum/holiday/april_fools/proc/celebrate  (code/modules/holiday/holidays.dm:154)  may sleep
rt.def("/datum/holiday/april_fools/proc/celebrate", function* celebrate(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	if (!truthy(rt.gl("SSticker"))) return f.dot;
	rt.setFv(f, "login_music", rt.gl("SSticker"), rt.rsc("sound/ambience/clown.ogg"));
	_P = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (truthy(rt.fv(f, "client", live(_P)))) {
			yield* g.callName(f, rt.fv(f, "client", live(_P)), "playtitlemusic", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2672, "/datum/holiday/fourtwenty", "/datum/holiday", {
	name: "Four-Twenty",
	begin_day: 20,
	begin_month: 4,
});

// /datum/holiday/fourtwenty/proc/getStationPrefix  (code/modules/holiday/holidays.dm:165)
rt.def("/datum/holiday/fourtwenty/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [4], ["Snoop", "Blunt", "Toke", "Dank"]);
});

rt.type(2675, "/datum/holiday/firefighter", "/datum/holiday", {
	name: "Firefighter's Day",
	begin_day: 4,
	begin_month: 5,
});

// /datum/holiday/firefighter/proc/getStationPrefix  (code/modules/holiday/holidays.dm:183)
rt.def("/datum/holiday/firefighter/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [4], ["Burning", "Blazing", "Plasma", "Fire"]);
});

rt.type(2678, "/datum/holiday/UFO", "/datum/holiday", {
	name: "UFO Day",
	begin_day: 2,
	begin_month: 7,
});

// /datum/holiday/UFO/proc/getStationPrefix  (code/modules/holiday/holidays.dm:201)
rt.def("/datum/holiday/UFO/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [4], ["Ayy", "Truth", "Tsoukalos", "Mulder"]);
});

rt.type(2680, "/datum/holiday/friendship", "/datum/holiday", {
	name: "Friendship Day",
	begin_day: 30,
	begin_month: 7,
});

// /datum/holiday/friendship/proc/greet  (code/modules/holiday/holidays.dm:214)
rt.def("/datum/holiday/friendship/proc/greet", function greet(f: Frame) {
	return fmt("Have a magical ＀!", [rt.sv(f, "name")]);
});

rt.type(2682, "/datum/holiday/pirate", "/datum/holiday", {
	name: "Talk-Like-a-Pirate Day",
	begin_day: 19,
	begin_month: 9,
});

// /datum/holiday/pirate/proc/greet  (code/modules/holiday/holidays.dm:227)
rt.def("/datum/holiday/pirate/proc/greet", function greet(f: Frame) {
	return "Ye be talkin' like a pirate today or else ye'r walkin' tha plank, matey!";
});

// /datum/holiday/pirate/proc/getStationPrefix  (code/modules/holiday/holidays.dm:230)
rt.def("/datum/holiday/pirate/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [3], ["Yarr", "Scurvy", "Yo-ho-ho"]);
});

rt.type(2683, "/datum/holiday/programmers", "/datum/holiday", {
	name: "Programmers' Day",
});

// /datum/holiday/programmers/proc/shouldCelebrate  (code/modules/holiday/holidays.dm:236)
rt.def("/datum/holiday/programmers/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (isEqual(live(mm), 9)) {
		if (isEqual(divide(live(yy), 4), rt.call(f, P("/proc/round"), null, [divide(live(yy), 4)]))) {
			if (isEqual(live(dd), 12)) {
				return 1;
			}
		} else {
			if (isEqual(live(dd), 13)) {
				return 1;
			}
		}
	}
	return 0;
});

// /datum/holiday/programmers/proc/getStationPrefix  (code/modules/holiday/holidays.dm:246)
rt.def("/datum/holiday/programmers/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [5], ["span>", "DEBUG: ", "null", "/list", "EVENT PREFIX NOT FOUND"]);
});

rt.type(2684, "/datum/holiday/questions", "/datum/holiday", {
	name: "Stupid-Questions Day",
	begin_day: 28,
	begin_month: 9,
});

// /datum/holiday/questions/proc/greet  (code/modules/holiday/holidays.dm:254)
rt.def("/datum/holiday/questions/proc/greet", function greet(f: Frame) {
	return fmt("Are you having a happy ＀?", [rt.sv(f, "name")]);
});

rt.type(2685, "/datum/holiday/animal", "/datum/holiday", {
	name: "Animal's Day",
	begin_day: 4,
	begin_month: 10,
});

// /datum/holiday/animal/proc/getStationPrefix  (code/modules/holiday/holidays.dm:262)
rt.def("/datum/holiday/animal/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [6], ["Parrot", "Corgi", "Cat", "Pug", "Goat", "Fox"]);
});

rt.type(2688, "/datum/holiday/halloween", "/datum/holiday", {
	name: "Halloween",
	begin_day: 30,
	begin_month: 10,
	end_day: 2,
	end_month: 11,
});

// /datum/holiday/halloween/proc/greet  (code/modules/holiday/holidays.dm:282)
rt.def("/datum/holiday/halloween/proc/greet", function greet(f: Frame) {
	return "Have a spooky Halloween!";
});

// /datum/holiday/halloween/proc/getStationPrefix  (code/modules/holiday/holidays.dm:285)
rt.def("/datum/holiday/halloween/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [6], ["Bone-Rattling", "Mr. Bones' Own", "2SPOOKY", "Spooky", "Scary", "Skeletons"]);
});

rt.type(2692, "/datum/holiday/hello", "/datum/holiday", {
	name: "Saying-'Hello' Day",
	begin_day: 21,
	begin_month: 11,
});

// /datum/holiday/hello/proc/greet  (code/modules/holiday/holidays.dm:308)
rt.def("/datum/holiday/hello/proc/greet", function greet(f: Frame) {
	return add(fmt("＀! ", [rt.op(f, "PickUnweighted", [1], [rt.list("Aloha", "Bonjour", "Hello", "Hi", "Greetings", "Salutations", "Bienvenidos", "Hola", "Howdy")])]), rt.callSuper(f, [], rt.Args.Same));
});

rt.type(2698, "/datum/holiday/mother", "/datum/holiday", {
	name: "Mother's Day",
	begin_week: 2,
	begin_month: 5,
	begin_weekday: "Sun",
});

// /datum/holiday/mother/proc/greet  (code/modules/holiday/holidays.dm:345)
rt.def("/datum/holiday/mother/proc/greet", function greet(f: Frame) {
	return "Happy Mother's Day in most of the Americas, Asia, and Oceania!";
});

rt.type(2700, "/datum/holiday/ramadan", "/datum/holiday", {
	name: "Start of Ramadan",
});

// /datum/holiday/ramadan/proc/shouldCelebrate  (code/modules/holiday/holidays.dm:369)
rt.def("/datum/holiday/ramadan/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (isEqual(rt.call(f, P("/proc/round"), null, [rt.modulus(divide(subtract(rt.fv(f, "realtime", rt.world()), 285984000), 864000), 354.3734436035156)]), 0)) {
		return 1;
	}
	return 0;
});

// /datum/holiday/ramadan/proc/getStationPrefix  (code/modules/holiday/holidays.dm:374)
rt.def("/datum/holiday/ramadan/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [4], ["Harm", "Halaal", "Jihad", "Muslim"]);
});

rt.type(2701, "/datum/holiday/ramadan/end", "/datum/holiday/ramadan", {
	name: "End of Ramadan",
});

// /datum/holiday/ramadan/end/proc/shouldCelebrate  (code/modules/holiday/holidays.dm:380)
rt.def("/datum/holiday/ramadan/end/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (isEqual(rt.call(f, P("/proc/round"), null, [rt.modulus(divide(subtract(rt.fv(f, "realtime", rt.world()), 312768000), 864000), 354.3734436035156)]), 0)) {
		return 1;
	}
	return 0;
});

rt.type(2703, "/datum/holiday/xmas", "/datum/holiday", {
	name: "Christmas",
	begin_day: 23,
	begin_month: 12,
	end_day: 25,
});

// /datum/holiday/xmas/proc/greet  (code/modules/holiday/holidays.dm:396)
rt.def("/datum/holiday/xmas/proc/greet", function greet(f: Frame) {
	return "Have a merry Christmas!";
});

rt.type(2704, "/datum/holiday/festive_season", "/datum/holiday", {
	name: "Festive Season",
	begin_day: 1,
	begin_month: 12,
	end_day: 31,
});

// /datum/holiday/festive_season/proc/greet  (code/modules/holiday/holidays.dm:405)
rt.def("/datum/holiday/festive_season/proc/greet", function greet(f: Frame) {
	return "Have a nice festive season!";
});

rt.type(2706, "/datum/holiday/friday_thirteenth", "/datum/holiday", {
	name: "Friday the 13th",
});

// /datum/holiday/friday_thirteenth/proc/shouldCelebrate  (code/modules/holiday/holidays.dm:416)
rt.def("/datum/holiday/friday_thirteenth/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if ((isEqual(live(dd), 13) && isEqual(live(ddd), "Fri"))) {
		return 1;
	}
	return 0;
});

// /datum/holiday/friday_thirteenth/proc/getStationPrefix  (code/modules/holiday/holidays.dm:421)
rt.def("/datum/holiday/friday_thirteenth/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return rt.op(f, "PickUnweighted", [7], ["Mike", "Friday", "Evil", "Myers", "Murder", "Deathly", "Stabby"]);
});

rt.type(2662, "/datum/holiday/easter", "/datum/holiday", {
	days_early: 1,
	days_extra: 1,
	name: "Easter",
}, { const: ["days_early","days_extra"] });

// /datum/holiday/easter/proc/shouldCelebrate  (code/modules/holiday/holidays.dm:431)
rt.def("/datum/holiday/easter/proc/shouldCelebrate", function shouldCelebrate(f: Frame) {
	let yy_string: Value = null, easters: Value = null;
	f.vars = () => [yy_string, easters];
	if (!truthy(rt.sv(f, "begin_month"))) {
		yy_string = fmt("＀", [live(f.args[2])]);
		rt.setSv(f, "begin_day", rt.index((easters = rt.alist(f, ["15", 14, "16", 6, "17", 25, "18", 10, "19", 30, "20", 22, "21", 13, "22", 26, "23", 18, "24", 9, "25", 29, "26", 14, "27", 6, "28", 25, "29", 10, "30", 30, "31", 23, "32", 6, "33", 26, "34", 18, "35", 3, "36", 22, "37", 14, "38", 34, "39", 19, "40", 9])), live(yy_string)));
		if (rt.le(rt.sv(f, "begin_day"), 9)) {
			rt.modSrcVar(f, "begin_day", 22, add);
			rt.setSv(f, "begin_month", 3);
		} else {
			(rt.modSrcVar(f, "begin_day", 9, subtract));
			rt.setSv(f, "begin_month", 4);
		}
		rt.setSv(f, "end_day", add(rt.sv(f, "begin_day"), 1));
		rt.setSv(f, "end_month", rt.sv(f, "begin_month"));
		if ((rt.ge(rt.sv(f, "end_day"), 32) && isEqual(rt.sv(f, "end_month"), 3))) {
			(rt.modSrcVar(f, "end_day", 31, subtract));
			rt.incSrcVar(f, "end_month", 1, true);
		}
		if ((rt.ge(rt.sv(f, "end_day"), 31) && isEqual(rt.sv(f, "end_month"), 4))) {
			(rt.modSrcVar(f, "end_day", 30, subtract));
			rt.incSrcVar(f, "end_month", 1, true);
		}
		(rt.modSrcVar(f, "begin_day", 1, subtract));
		if (rt.le(rt.sv(f, "begin_day"), 0)) {
			if (isEqual(rt.sv(f, "begin_month"), 4)) {
				rt.modSrcVar(f, "begin_day", 31, add);
				rt.incSrcVar(f, "begin_month", -1, true);
			}
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["dd", "mm", "yy", "ww", "ddd"] });

// /datum/holiday/easter/proc/celebrate  (code/modules/holiday/holidays.dm:493)
rt.def("/datum/holiday/easter/proc/celebrate", function celebrate(f: Frame) {
	rt.modGl("maintenance_loot", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/egg/loaded"), 15, T("/obj/item/weapon/storage/bag/easterbasket"), 15]), add);
	return f.dot;
});
