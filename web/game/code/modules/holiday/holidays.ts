// Based on /tg/station's code/modules/holiday/holidays.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// holidays.dm:18
rt.def("/datum/holiday/proc/greet", function greet(f: Frame) {
	return `Have a happy ${this.name}!`;
});

// holidays.dm:23
rt.def("/datum/holiday/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	let i: Value = findtext(this.name, " ", 1, 0);
	return copytext(this.name, 1, i);
});

// holidays.dm:31
rt.def("/datum/holiday/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (this.always_celebrate) {
		return 1;
	}
	if (!this.end_day) {
		this.end_day = this.begin_day;
	}
	if (!this.end_month) {
		this.end_month = this.begin_month;
	}
	if (this.begin_week && this.begin_weekday) {
		if (this.begin_week == ww && this.begin_weekday == ddd) {
			return 1;
		}
	}
	if (this.end_month > this.begin_month) {
		if (mm == this.end_month) {
			if (dd <= this.end_day) {
				return 1;
			}
		} else if (mm == this.begin_month) {
			if (dd >= this.begin_day) {
				return 1;
			}
		} else if (rt.op(f, "IsInRange", [], [mm, this.begin_month, this.end_month])) {
			return 1;
		}
	} else if (this.end_month == this.begin_month) {
		if (mm == this.begin_month && rt.op(f, "IsInRange", [], [dd, this.begin_day, this.end_day])) {
			return 1;
		}
	} else {
		if (mm >= this.begin_month && dd >= this.begin_day) {
			return 1;
		}
		if (mm <= this.end_month && dd <= this.end_day) {
			return 1;
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

// holidays.dm:72
rt.def("/datum/holiday/new_year/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Party", "New", "Hangover", "Resolution");
});

rt.type(2665, "/datum/holiday/valentines", "/datum/holiday", {
	name: "Valentine's Day",
	begin_day: 13,
	end_day: 15,
	begin_month: 2,
});

// holidays.dm:86
rt.def("/datum/holiday/valentines/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Love", "Amore", "Single", "Smootch", "Hug");
});

rt.type(2666, "/datum/holiday/birthday", "/datum/holiday", {
	name: "Birthday of Space Station 13",
	begin_day: 16,
	begin_month: 2,
});

// holidays.dm:94
rt.def("/datum/holiday/birthday/proc/greet", function greet(f: Frame) {
	let Fact: Value = null;
	let game_age: Value = text2num(time2text(rt.world().timeofday, "YY")) - 3;
	if (game_age === 16) {
		Fact = " SS13 is now old enough to drive!";
	} else if (game_age === 18) {
		Fact = " SS13 is now legal!";
	} else if (game_age === 21) {
		Fact = " SS13 can now drink!";
	} else if (game_age === 26) {
		Fact = " SS13 can now rent a car!";
	} else if (game_age === 30) {
		Fact = " SS13 can now go home and be a family man!";
	} else if (game_age === 40) {
		Fact = " SS13 can now suffer a midlife crisis!";
	} else if (game_age === 50) {
		Fact = " Happy golden anniversary!";
	} else if (game_age === 65) {
		Fact = " SS13 can now start thinking about retirement!";
	} else if (game_age === 96) {
		Fact = " Please send a time machine back to pick me up, I need to update the time formatting for this feature!";
	}
	if (!Fact) {
		Fact = ` SS13 is now ${game_age} years old!`;
	}
	return `Say 'Happy Birthday' to Space Station 13, first publicly playable on February 16th, 2003!${Fact}`;
});

rt.type(2667, "/datum/holiday/random_kindness", "/datum/holiday", {
	name: "Random Acts of Kindness Day",
	begin_day: 17,
	begin_month: 2,
});

// holidays.dm:126
rt.def("/datum/holiday/random_kindness/proc/greet", function greet(f: Frame) {
	return "Go do some random acts of kindness for a stranger!";
});

rt.type(2670, "/datum/holiday/no_this_is_patrick", "/datum/holiday", {
	name: "St. Patrick's Day",
	begin_day: 17,
	begin_month: 3,
});

// holidays.dm:144
rt.def("/datum/holiday/no_this_is_patrick/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Blarney", "Green", "Leprechaun", "Booze");
});

rt.type(2671, "/datum/holiday/april_fools", "/datum/holiday", {
	name: "April Fool's Day",
	begin_day: 1,
	end_day: 2,
	begin_month: 4,
});

// holidays.dm:154
rt.def("/datum/holiday/april_fools/proc/celebrate", function* celebrate(f: Frame) {
	let _P: Value = null;
	if (!GLOB.SSticker) return f.dot;
	GLOB.SSticker.login_music = rt.rsc("sound/ambience/clown.ogg");
	for (_P of each(GLOB.mob_list, T("/mob/dead/new_player"))) {
		if (_P.client) {
			yield* _P.client.playtitlemusic();
		}
	}
	return f.dot;
}, true);

rt.type(2672, "/datum/holiday/fourtwenty", "/datum/holiday", {
	name: "Four-Twenty",
	begin_day: 20,
	begin_month: 4,
});

// holidays.dm:165
rt.def("/datum/holiday/fourtwenty/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Snoop", "Blunt", "Toke", "Dank");
});

rt.type(2675, "/datum/holiday/firefighter", "/datum/holiday", {
	name: "Firefighter's Day",
	begin_day: 4,
	begin_month: 5,
});

// holidays.dm:183
rt.def("/datum/holiday/firefighter/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Burning", "Blazing", "Plasma", "Fire");
});

rt.type(2678, "/datum/holiday/UFO", "/datum/holiday", {
	name: "UFO Day",
	begin_day: 2,
	begin_month: 7,
});

// holidays.dm:201
rt.def("/datum/holiday/UFO/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Ayy", "Truth", "Tsoukalos", "Mulder");
});

rt.type(2680, "/datum/holiday/friendship", "/datum/holiday", {
	name: "Friendship Day",
	begin_day: 30,
	begin_month: 7,
});

// holidays.dm:214
rt.def("/datum/holiday/friendship/proc/greet", function greet(f: Frame) {
	return `Have a magical ${this.name}!`;
});

rt.type(2682, "/datum/holiday/pirate", "/datum/holiday", {
	name: "Talk-Like-a-Pirate Day",
	begin_day: 19,
	begin_month: 9,
});

// holidays.dm:227
rt.def("/datum/holiday/pirate/proc/greet", function greet(f: Frame) {
	return "Ye be talkin' like a pirate today or else ye'r walkin' tha plank, matey!";
});

// holidays.dm:230
rt.def("/datum/holiday/pirate/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Yarr", "Scurvy", "Yo-ho-ho");
});

rt.type(2683, "/datum/holiday/programmers", "/datum/holiday", {
	name: "Programmers' Day",
});

// holidays.dm:236
rt.def("/datum/holiday/programmers/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (mm == 9) {
		if (yy / 4 == round(yy / 4)) {
			if (dd == 12) {
				return 1;
			}
		} else if (dd == 13) {
			return 1;
		}
	}
	return 0;
});

// holidays.dm:246
rt.def("/datum/holiday/programmers/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("span>", "DEBUG: ", "null", "/list", "EVENT PREFIX NOT FOUND");
});

rt.type(2684, "/datum/holiday/questions", "/datum/holiday", {
	name: "Stupid-Questions Day",
	begin_day: 28,
	begin_month: 9,
});

// holidays.dm:254
rt.def("/datum/holiday/questions/proc/greet", function greet(f: Frame) {
	return `Are you having a happy ${this.name}?`;
});

rt.type(2685, "/datum/holiday/animal", "/datum/holiday", {
	name: "Animal's Day",
	begin_day: 4,
	begin_month: 10,
});

// holidays.dm:262
rt.def("/datum/holiday/animal/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Parrot", "Corgi", "Cat", "Pug", "Goat", "Fox");
});

rt.type(2688, "/datum/holiday/halloween", "/datum/holiday", {
	name: "Halloween",
	begin_day: 30,
	begin_month: 10,
	end_day: 2,
	end_month: 11,
});

// holidays.dm:282
rt.def("/datum/holiday/halloween/proc/greet", function greet(f: Frame) {
	return "Have a spooky Halloween!";
});

// holidays.dm:285
rt.def("/datum/holiday/halloween/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Bone-Rattling", "Mr. Bones' Own", "2SPOOKY", "Spooky", "Scary", "Skeletons");
});

rt.type(2692, "/datum/holiday/hello", "/datum/holiday", {
	name: "Saying-'Hello' Day",
	begin_day: 21,
	begin_month: 11,
});

// holidays.dm:308
rt.def("/datum/holiday/hello/proc/greet", function greet(f: Frame) {
	return `${pick(list("Aloha", "Bonjour", "Hello", "Hi", "Greetings", "Salutations", "Bienvenidos", "Hola", "Howdy"))}! ` + parent_proc();
});

rt.type(2698, "/datum/holiday/mother", "/datum/holiday", {
	name: "Mother's Day",
	begin_week: 2,
	begin_month: 5,
	begin_weekday: "Sun",
});

// holidays.dm:345
rt.def("/datum/holiday/mother/proc/greet", function greet(f: Frame) {
	return "Happy Mother's Day in most of the Americas, Asia, and Oceania!";
});

rt.type(2700, "/datum/holiday/ramadan", "/datum/holiday", {
	name: "Start of Ramadan",
});

// holidays.dm:369
rt.def("/datum/holiday/ramadan/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (round((rt.world().realtime - 285984000) / 864000 % 354.37344) == 0) {
		return 1;
	}
	return 0;
});

// holidays.dm:374
rt.def("/datum/holiday/ramadan/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Harm", "Halaal", "Jihad", "Muslim");
});

rt.type(2701, "/datum/holiday/ramadan/end", "/datum/holiday/ramadan", {
	name: "End of Ramadan",
});

// holidays.dm:380
rt.def("/datum/holiday/ramadan/end/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (round((rt.world().realtime - 312768000) / 864000 % 354.37344) == 0) {
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

// holidays.dm:396
rt.def("/datum/holiday/xmas/proc/greet", function greet(f: Frame) {
	return "Have a merry Christmas!";
});

rt.type(2704, "/datum/holiday/festive_season", "/datum/holiday", {
	name: "Festive Season",
	begin_day: 1,
	begin_month: 12,
	end_day: 31,
});

// holidays.dm:405
rt.def("/datum/holiday/festive_season/proc/greet", function greet(f: Frame) {
	return "Have a nice festive season!";
});

rt.type(2706, "/datum/holiday/friday_thirteenth", "/datum/holiday", {
	name: "Friday the 13th",
});

// holidays.dm:416
rt.def("/datum/holiday/friday_thirteenth/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	if (dd == 13 && ddd == "Fri") {
		return 1;
	}
	return 0;
});

// holidays.dm:421
rt.def("/datum/holiday/friday_thirteenth/proc/getStationPrefix", function getStationPrefix(f: Frame) {
	return pick("Mike", "Friday", "Evil", "Myers", "Murder", "Deathly", "Stabby");
});

rt.type(2662, "/datum/holiday/easter", "/datum/holiday", {
	days_early: 1,
	days_extra: 1,
	name: "Easter",
}, { const: ["days_early","days_extra"] });

// holidays.dm:431
rt.def("/datum/holiday/easter/proc/shouldCelebrate", function shouldCelebrate(f: Frame, dd: Value, mm: Value, yy: Value, ww: Value, ddd: Value) {
	let yy_string: Value = null, easters: Value = null;
	if (!this.begin_month) {
		yy_string = `${yy}`;
		this.begin_day = rt.index((easters = rt.alist(f, ["15", 14, "16", 6, "17", 25, "18", 10, "19", 30, "20", 22, "21", 13, "22", 26, "23", 18, "24", 9, "25", 29, "26", 14, "27", 6, "28", 25, "29", 10, "30", 30, "31", 23, "32", 6, "33", 26, "34", 18, "35", 3, "36", 22, "37", 14, "38", 34, "39", 19, "40", 9])), yy_string);
		if (this.begin_day <= 9) {
			this.begin_day += 22;
			this.begin_month = MARCH;
		} else {
			this.begin_day -= 9;
			this.begin_month = APRIL;
		}
		this.end_day = this.begin_day + 1;
		this.end_month = this.begin_month;
		if (this.end_day >= 32 && this.end_month == MARCH) {
			this.end_day -= 31;
			this.end_month++;
		}
		if (this.end_day >= 31 && this.end_month == APRIL) {
			this.end_day -= 30;
			this.end_month++;
		}
		this.begin_day -= 1;
		if (this.begin_day <= 0) {
			if (this.begin_month == APRIL) {
				this.begin_day += 31;
				this.begin_month--;
			}
		}
	}
	return parent_proc();
}, false);

// holidays.dm:493
rt.def("/datum/holiday/easter/proc/celebrate", function celebrate(f: Frame) {
	GLOB.maintenance_loot += rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/egg/loaded"), 15, T("/obj/item/weapon/storage/bag/easterbasket"), 15]);
	return f.dot;
});
