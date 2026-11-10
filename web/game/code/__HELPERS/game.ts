// Based on /tg/station's code/__HELPERS/game.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


// game.dm:12
rt.def("/proc/get_area", function get_area(f: Frame, A: Value) {
	if (!rt.istype(A, T("/atom"))) {
		return f.dot;
	}
	A;
	while (A && !isarea(A)) {
		A = A.loc;
	}
	return A;
});

// game.dm:18
rt.def("/proc/get_area_name", function get_area_name(f: Frame, X: Value) {
	let Y: Value = null;
	return (Y = get_area(X)).name;
});

// game.dm:22
rt.def("/proc/get_area_by_name", function get_area_by_name(f: Frame, N: Value) {
	let A: Value = null;
	for (A of each(rt.world(), T("/area"))) {
		if (A.name == N) {
			return A;
		}
	}
	return 0;
});

// game.dm:28
rt.def("/proc/get_areas_in_range", function get_areas_in_range(f: Frame, dist: Value, center: Value) {
	let _T: Value = null, V: Value = null, _T_3: Value = null;
	let $e: any;
	dist ??= 0;
	center ??= f.usr;
	if (!dist) {
		return (_T = rt.getStep(f, center, 0)) ? list(_T.loc) : list();
	}
	if (!center) {
		return list();
	}
	let turfs: Value = block(rt.locate(max(center.x - dist, 1), max(center.y - dist, 1), center.z), rt.locate(min(center.x + dist, rt.world().maxx), min(center.y + dist, rt.world().maxy), center.z));
	let areas: Value = list();
	for (V of each(turfs)) {
		(areas = rt.modify(areas, (_T_3 = V).loc, rt.bitOr));
	}
	return areas;
});

// game.dm:49
rt.def("/proc/get_open_turf_in_dir", function get_open_turf_in_dir(f: Frame, center: Value, dir: Value) {
	let _T: Value = null;
	if (!rt.istype((_T = get_ranged_target_turf(center, dir, 1)), T("/turf/open"))) return f.dot;
	return _T;
});

// game.dm:54
rt.def("/proc/get_adjacent_open_turfs", function get_adjacent_open_turfs(f: Frame, center: Value) {
	f.dot = list(get_open_turf_in_dir(center, 1), get_open_turf_in_dir(center, 2), get_open_turf_in_dir(center, 4), get_open_turf_in_dir(center, 8));
	listclearnulls(f.dot);
	return f.dot;
});

// game.dm:61
rt.def("/proc/get_adjacent_open_areas", function get_adjacent_open_areas(f: Frame, center: Value) {
	let I: Value = null;
	f.dot = list();
	let adjacent_turfs: Value = get_adjacent_open_turfs(center);
	for (I of each(adjacent_turfs)) {
		(f.dot = rt.modify(f.dot, get_area(I), rt.bitOr));
	}
	return f.dot;
});

// game.dm:71
rt.def("/proc/get_hear", function get_hear(f: Frame, range: Value, source: Value) {
	let lum: Value = source.luminosity;
	source.luminosity = 6;
	let heard: Value = view(range, source);
	source.luminosity = lum;
	return heard;
});

// game.dm:79
rt.def("/proc/alone_in_area", function alone_in_area(f: Frame, the_area: Value, must_be_alone: Value, check_type: Value) {
	let C: Value = null;
	check_type ??= T("/mob/living/carbon");
	let our_area: Value = get_area(the_area);
	for (C of each(GLOB.living_mob_list)) {
		if (!rt.op(f, "IsType", [], [C, check_type])) {
			continue;
		}
		if (C == must_be_alone) {
			continue;
		}
		if (our_area == get_area(C)) {
			return 0;
		}
	}
	return 1;
});

// game.dm:92
rt.def("/proc/cheap_hypotenuse", function cheap_hypotenuse(f: Frame, Ax: Value, Ay: Value, Bx: Value, By: Value) {
	return rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [Ax - Bx]) ** 2 + rt.op(f, "Abs", [], [Ay - By]) ** 2]);
});

// game.dm:96
rt.def("/proc/circlerange", function circlerange(f: Frame, center: Value, radius: Value) {
	let _T: Value = null, dx: Value = null, dy: Value = null;
	center ??= f.usr;
	radius ??= 3;
	let centerturf: Value = rt.getStep(f, center, 0);
	let turfs: Value = new_(T("/list"));
	let rsq: Value = radius * (radius + 0.5);
	for (_T of each(range(radius, centerturf), T("/atom"))) {
		dx = _T.x - centerturf.x;
		dy = _T.y - centerturf.y;
		if (dx * dx + dy * dy <= rsq) {
			turfs += _T;
		}
	}
	return turfs;
});

// game.dm:125
rt.def("/proc/get_dist_euclidian", function get_dist_euclidian(f: Frame, Loc1: Value, Loc2: Value) {
	let dist: Value = null;
	let dx: Value = Loc1.x - Loc2.x;
	let dy: Value = Loc1.y - Loc2.y;
	return (dist = rt.op(f, "Sqrt", [], [dx ** 2 + dy ** 2]));
});

// game.dm:134
rt.def("/proc/circlerangeturfs", function circlerangeturfs(f: Frame, center: Value, radius: Value) {
	let _T: Value = null, dx: Value = null, dy: Value = null;
	center ??= f.usr;
	radius ??= 3;
	let centerturf: Value = rt.getStep(f, center, 0);
	let turfs: Value = new_(T("/list"));
	let rsq: Value = radius * (radius + 0.5);
	for (_T of each(range(radius, centerturf), T("/turf"))) {
		dx = _T.x - centerturf.x;
		dy = _T.y - centerturf.y;
		if (dx * dx + dy * dy <= rsq) {
			turfs += _T;
		}
	}
	return turfs;
});

// game.dm:147
rt.def("/proc/circleviewturfs", function circleviewturfs(f: Frame, center: Value, radius: Value) {
	let _T: Value = null, dx: Value = null, dy: Value = null;
	center ??= f.usr;
	radius ??= 3;
	let centerturf: Value = rt.getStep(f, center, 0);
	let turfs: Value = new_(T("/list"));
	let rsq: Value = radius * (radius + 0.5);
	for (_T of each(view(radius, centerturf), T("/turf"))) {
		dx = _T.x - centerturf.x;
		dy = _T.y - centerturf.y;
		if (dx * dx + dy * dy <= rsq) {
			turfs += _T;
		}
	}
	return turfs;
});

// game.dm:163
rt.def("/proc/recursive_hear_check", function recursive_hear_check(f: Frame, O: Value) {
	let A: Value = null;
	let $t: any;
	let processing_list: Value = list(O);
	f.dot = list();
	let i: Value = 1;
	while (i <= rt.len(f, processing_list)) {
		if (rt.bitAnd((A = rt.index(processing_list, ($t = i, i = rt.inc($t, 1), $t))).flags, HEAR)) {
			f.dot += A;
		}
		processing_list += A.contents;
	}
	return f.dot;
});

// game.dm:177
rt.def("/proc/recursive_mob_check", function recursive_mob_check(f: Frame, O: Value, client_check: Value, sight_check: Value, include_radio: Value) {
	let A: Value = null, passed: Value = null, A_tmp: Value = null, B: Value = null;
	client_check ??= 1;
	sight_check ??= 1;
	include_radio ??= 1;
	let processing_list: Value = list(O);
	let processed_list: Value = list();
	let found_mobs: Value = list();
	while (rt.len(f, processing_list)) {
		A = rt.index(processing_list, 1);
		passed = 0;
		if (ismob(A)) {
			A_tmp = A;
			passed = 1;
			if (client_check && !A_tmp.client) {
				passed = 0;
			}
			if (sight_check && !isInSight(A_tmp, O)) {
				passed = 0;
			}
		} else if (include_radio && rt.istype(A, T("/obj/item/device/radio"))) {
			passed = 1;
			if (sight_check && !isInSight(A, O)) {
				passed = 0;
			}
		}
		if (passed) {
			(found_mobs = rt.modify(found_mobs, A, rt.bitOr));
		}
		B = null;
		for (B of each(A, T("/atom"))) {
			if (!rt.index(processed_list, B)) {
				(processing_list = rt.modify(processing_list, B, rt.bitOr));
			}
		}
		processing_list.Cut(1, 2);
		rt.setAt(processed_list, A, A);
	}
	return found_mobs;
});

// game.dm:217
rt.def("/proc/get_hearers_in_view", function get_hearers_in_view(f: Frame, R: Value, source: Value) {
	let A: Value = null;
	let _T: Value = rt.getStep(f, source, 0);
	let hear: Value = list();
	if (!_T) {
		return hear;
	}
	let range: Value = get_hear(R, _T);
	// stress2b: the per-atom recursive_hear_check + list union loop is one native pass (collect_hearers, same order);
	// with the TG_CHECK_HEAR env flag the old loop also runs and every call is compared.
	hear = collect_hearers(range);
	if (hear_check_mode()) {
		let old: Value = list();
		for (A of each(range, T("/atom/movable"))) {
			(old = rt.modify(old, recursive_hear_check(A), rt.bitOr));
		}
		hear_check_compare(hear, old);
	}
	return hear;
});

// game.dm:234
rt.def("/proc/get_mobs_in_radio_ranges", function get_mobs_in_radio_ranges(f: Frame, radios: Value) {
	let R: Value = null;
	f.dot = list();
	for (R of each(radios, T("/obj/item/device/radio"))) {
		if (R) {
			(f.dot = rt.modify(f.dot, get_hearers_in_view(R.canhear_range, R), rt.bitOr));
		}
	}
	return f.dot;
});

// game.dm:245
rt.def("/proc/inLineOfSight", function inLineOfSight(f: Frame, X1: Value, Y1: Value, X2: Value, Y2: Value, Z: Value, PX1: Value, PY1: Value, PX2: Value, PY2: Value) {
	let _T: Value = null, s: Value = null, m: Value = null, b: Value = null, signX: Value = null, signY: Value = null;
	Z ??= 1;
	PX1 ??= 16.5;
	PY1 ??= 16.5;
	PX2 ??= 16.5;
	PY2 ??= 16.5;
	if (X1 == X2) {
		if (Y1 == Y2) {
			return 1;
		} else {
			Y1 += (s = Y2 - Y1 < 0 ? -1 : 1);
			while (Y1 != Y2) {
				if ((_T = rt.locate(X1, Y1, Z)).opacity) {
					return 0;
				}
				Y1 += s;
			}
		}
	} else {
		m = (32 * (Y2 - Y1) + (PY2 - PY1)) / (32 * (X2 - X1) + (PX2 - PX1));
		b = Y1 + PY1 / 32 - 0.015625 - m * (X1 + PX1 / 32 - 0.015625);
		signX = X2 - X1 < 0 ? -1 : 1;
		signY = Y2 - Y1 < 0 ? -1 : 1;
		if (X1 < X2) {
			b += m;
		}
		while (X1 != X2 || Y1 != Y2) {
			if (round(m * X1 + b - Y1)) {
				Y1 += signY;
			} else {
				X1 += signX;
			}
			if ((_T = rt.locate(X1, Y1, Z)).opacity) {
				return 0;
			}
		}
	}
	return 1;
});

// game.dm:276
rt.def("/proc/isInSight", function isInSight(f: Frame, A: Value, B: Value) {
	let Aturf: Value = rt.getStep(f, A, 0);
	let Bturf: Value = rt.getStep(f, B, 0);
	if (!Aturf || !Bturf) {
		return 0;
	}
	if (inLineOfSight(Aturf.x, Aturf.y, Bturf.x, Bturf.y, Aturf.z)) {
		return 1;
	} else {
		return 0;
	}
});

// game.dm:305
rt.def("/proc/try_move_adjacent", function* try_move_adjacent(f: Frame, AM: Value) {
	let direction: Value = null;
	let _T: Value = rt.getStep(f, AM, 0);
	for (direction of each(GLOB.cardinal)) {
		if (yield* AM.Move(rt.getStep(f, _T, direction))) {
			break;
		}
	}
	return f.dot;
}, true);

// game.dm:311
rt.def("/proc/get_mob_by_key", function get_mob_by_key(f: Frame, key: Value) {
	let M: Value = null;
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (M.ckey == lowertext(key)) {
			return M;
		}
	}
	return null;
});

// game.dm:319
rt.def("/proc/get_candidates", function get_candidates(f: Frame, be_special_type: Value, afk_bracket: Value, jobbanType: Value) {
	let G: Value = null;
	afk_bracket ??= GLOB.config.inactivity_period;
	let candidates: Value = list();
	while (!rt.len(f, candidates) && afk_bracket < GLOB.config.afk_period) {
		G = null;
		for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
			if (G.client !== null) {
				if (!(G.mind && G.mind.current && G.mind.current.stat != 2)) {
					if (!G.client.is_afk(afk_bracket) && rt.isIn(f, be_special_type, G.client.prefs.be_special)) {
						if (jobbanType) {
							if (!(jobban_isbanned(G, jobbanType) || jobban_isbanned(G, "Syndicate"))) {
								candidates += G.client;
							}
						} else {
							candidates += G.client;
						}
					}
				}
			}
		}
		afk_bracket += 600;
	}
	return candidates;
});

// game.dm:344
rt.def("/proc/remove_images_from_clients", function remove_images_from_clients(f: Frame, I: Value, show_to: Value) {
	let C: Value = null;
	for (C of each(show_to, T("/client"))) {
		C.images -= I;
	}
	return f.dot;
}, false, { argTypes: [{ path: "/image" }, { path: "/list" }] });

// game.dm:348
rt.def("/proc/flick_overlay", function* flick_overlay(f: Frame, I: Value, show_to: Value, duration: Value) {
	let C: Value = null;
	for (C of each(show_to, T("/client"))) {
		C.images += I;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/remove_images_from_clients"), I, show_to)), duration);
	return f.dot;
}, true);

// game.dm:353
rt.def("/proc/flick_overlay_view", function* flick_overlay_view(f: Frame, I: Value, target: Value, duration: Value) {
	let m: Value = null, M: Value = null;
	let viewing: Value = list();
	for (m of each(viewers(target))) {
		if ((M = m).client) {
			viewing += M.client;
		}
	}
	yield* flick_overlay(I, viewing, duration);
	return f.dot;
}, true);

// game.dm:363
rt.def("/proc/get_active_player_count", function get_active_player_count(f: Frame, alive_check: Value, afk_check: Value, human_check: Value) {
	let M: Value = null, O: Value = null;
	alive_check ??= 0;
	afk_check ??= 0;
	human_check ??= 0;
	let active_players: Value = 0;
	let i: Value = 1;
	while (i <= rt.len(f, GLOB.player_list)) {
		blk57: {
			if ((M = rt.index(GLOB.player_list, i)) && M.client) {
				if (!(alive_check && M.stat)) {
					if (!(afk_check && M.client.is_afk())) {
						if (!(human_check && !rt.istype(M, T("/mob/living/carbon/human")))) {
							if (!rt.istype(M, T("/mob/dead/new_player"))) {
								if (rt.istype(M, T("/mob/dead/observer"))) {
									if ((O = M).started_as_observer) {
										break blk57;
									}
								}
								active_players++;
							}
						}
					}
				}
			}
		}
		i++;
	}
	return active_players;
});

// game.dm:422
rt.def("/proc/showCandidatePollWindow", function* showCandidatePollWindow(f: Frame, M: Value, poll_time: Value, Question: Value, candidates: Value, ignore_category: Value, time_passed: Value, flashwindow: Value) {
	let L: Value = null;
	let $0: any;
	flashwindow ??= 1;
	rt.op(f, "Output", [], [M, rt.rsc("sound/misc/notice2.ogg")], false);
	if (flashwindow) {
		window_flash(M.client);
	}
	if (ignore_category) {
		$0 = (yield* askuser(M, Question, `Please answer in ${poll_time / 10} seconds!`, "Yes", "No", "Never for this round", { StealFocus: 0, Timeout: poll_time }));
	} else {
		$0 = (yield* askuser(M, Question, `Please answer in ${poll_time / 10} seconds!`, "Yes", "No", { StealFocus: 0, Timeout: poll_time }));
	}
	if ($0 === 1) {
		to_chat(M, "<span class='notice'>Choice registered: Yes.</span>");
		if (time_passed + poll_time <= rt.worldTime(f)) {
			to_chat(M, "<span class='danger'>Sorry, you answered too late to be considered!</span>");
			rt.op(f, "Output", [], [M, rt.rsc("sound/machines/buzz-sigh.ogg")], false);
			candidates -= M;
		} else {
			candidates += M;
		}
	} else if ($0 === 2) {
		to_chat(M, "<span class='danger'>Choice registered: No.</span>");
		candidates -= M;
	} else if ($0 === 3) {
		if (!(L = rt.index(GLOB.poll_ignore, ignore_category))) {
			rt.setAt(GLOB.poll_ignore, ignore_category, list());
		}
		rt.modAt(GLOB.poll_ignore, ignore_category, M.ckey, add);
		to_chat(M, "<span class='danger'>Choice registered: Never for this round.</span>");
		candidates -= M;
	} else {
		candidates -= M;
	}
	return f.dot;
}, true, { waitfor: false });

// game.dm:448
rt.def("/proc/pollGhostCandidates", function* pollGhostCandidates(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, ignore_category: Value, flashwindow: Value) {
	let G: Value = null;
	be_special_flag ??= 0;
	poll_time ??= 300;
	flashwindow ??= 1;
	let candidates: Value = list();
	for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
		candidates += G;
	}
	return (yield* pollCandidates(Question, jobbanType, gametypeCheck, be_special_flag, poll_time, ignore_category, flashwindow, candidates));
}, true);

// game.dm:457
rt.def("/proc/pollCandidates", function* pollCandidates(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, ignore_category: Value, flashwindow: Value, group: Value) {
	let m: Value = null, M: Value = null, M_2: Value = null;
	be_special_flag ??= 0;
	poll_time ??= 300;
	flashwindow ??= 1;
	let time_passed: Value = rt.worldTime(f);
	if (!Question) {
		Question = "Would you like to be a special role?";
	}
	let result: Value = list();
	for (m of each(group)) {
		if (!(M = m).key || !M.client || rt.isIn(f, ((ignore_category && rt.index(GLOB.poll_ignore, ignore_category)) && M.ckey), rt.index(GLOB.poll_ignore, ignore_category))) {
			continue;
		}
		if (be_special_flag) {
			if (!M.client.prefs || !rt.isIn(f, be_special_flag, M.client.prefs.be_special)) {
				continue;
			}
		}
		if (gametypeCheck) {
		}
		if (jobbanType) {
			if (jobban_isbanned(M, jobbanType) || jobban_isbanned(M, "Syndicate")) {
				continue;
			}
		}
		yield* showCandidatePollWindow(M, poll_time, Question, result, ignore_category, time_passed, flashwindow);
	}
	yield* sleep(poll_time);
	for (M_2 of each(result, T("/mob"))) {
		if (!M_2.key || !M_2.client) {
			result -= M_2;
		}
	}
	listclearnulls(result);
	return result;
}, true);

// game.dm:487
rt.def("/proc/pollCandidatesForMob", function* pollCandidatesForMob(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, M: Value, ignore_category: Value) {
	be_special_flag ??= 0;
	poll_time ??= 300;
	let L: Value = (yield* pollGhostCandidates(Question, jobbanType, gametypeCheck, be_special_flag, poll_time, ignore_category));
	if (!M || !M || M.gc_destroyed || !M.loc) {
		return list();
	}
	return L;
}, true);

// game.dm:493
rt.def("/proc/pollCandidatesForMobs", function* pollCandidatesForMobs(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, mobs: Value, ignore_category: Value) {
	let v: Value = null, A: Value = null;
	be_special_flag ??= 0;
	poll_time ??= 300;
	let L: Value = (yield* pollGhostCandidates(Question, jobbanType, gametypeCheck, be_special_flag, poll_time, ignore_category));
	let i: Value = 1;
	for (v of each(mobs)) {
		if (!(A = v) || !A || A.gc_destroyed || !A.loc) {
			mobs.Cut(i, i + 1);
		} else {
			i++;
		}
	}
	return L;
}, true);

// game.dm:506
rt.def("/proc/makeBody", function* makeBody(f: Frame, G_found: Value) {
	if (!G_found || !G_found.key) {
		return f.dot;
	}
	let new_character: Value = (yield* new_(T("/mob/living/carbon/human")));
	yield* GLOB.SSjob.SendToLateJoin(new_character);
	yield* G_found.client.prefs.copy_to(new_character);
	yield* new_character.dna.update_dna_identity();
	new_character.key = G_found.key;
	return new_character;
}, true);

// game.dm:520
rt.def("/proc/send_to_playing_players", function send_to_playing_players(f: Frame, thing: Value) {
	let M: Value = null;
	for (M of each(GLOB.player_list)) {
		if (M && !rt.istype(M, T("/mob/dead/new_player"))) {
			to_chat(M, thing);
		}
	}
	return f.dot;
});

// game.dm:525
rt.def("/proc/window_flash", function window_flash(f: Frame, C: Value, ignorepref: Value) {
	let M: Value = null;
	ignorepref ??= 0;
	if (ismob(C)) {
		if ((M = C).client) {
			C = M.client;
		}
	}
	if (!C || !C.prefs.windowflashing && !ignorepref) {
		return f.dot;
	}
	winset(C, "mainwindow", "flash=5");
	return f.dot;
});

// game.dm:534
rt.def("/proc/AnnounceArrival", function* AnnounceArrival(f: Frame, character: Value, rank: Value) {
	let announcer: Value = null;
	if (!GLOB.SSticker.IsRoundInProgress() || !character) {
		return f.dot;
	}
	let A: Value = get_area(character);
	let message: Value = `<span class='game deadsay'><span class='name'>${character.real_name}</span> (${rank}) has arrived at the station at <span class='name'>${A.name}</span>.</span>`;
	yield* deadchat_broadcast(message, { follow_target: character, message_type: "arrivalrattle" });
	if (!rt.len(f, GLOB.announcement_systems) || !character.mind) {
		return f.dot;
	}
	if (character.mind.assigned_role == "Cyborg" || character.mind.assigned_role == character.mind.special_role) {
		return f.dot;
	}
	yield* (announcer = pick(GLOB.announcement_systems)).announce("ARRIVAL", character.real_name, rank, list());
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, {  }] });

// game.dm:550
rt.def("/proc/GetRedPart", function GetRedPart(f: Frame, hexa: Value) {
	return hex2num(copytext(hexa, 2, 4));
});

// game.dm:553
rt.def("/proc/GetGreenPart", function GetGreenPart(f: Frame, hexa: Value) {
	return hex2num(copytext(hexa, 4, 6));
});

// game.dm:556
rt.def("/proc/GetBluePart", function GetBluePart(f: Frame, hexa: Value) {
	return hex2num(copytext(hexa, 6, 8));
});
