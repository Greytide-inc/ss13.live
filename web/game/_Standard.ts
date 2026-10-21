// From _Standard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/proc/New  built in (BYOND provides it)
rt.def("/datum/proc/New");

// /proc/alert  built in (BYOND provides it)
rt.def("/proc/alert", undefined, false, { args: ["Usr", "Message", "Title", "Button1", "Button2", "Button3"] });

// /proc/animate  built in (BYOND provides it)
rt.def("/proc/animate", undefined, false, { args: ["Object", "time", "loop", "easing", "flags", "delay", "pixel_x", "pixel_y", "pixel_z", "maptext", "maptext_width", "maptext_height", "maptext_x", "maptext_y", "dir", "alpha", "transform", "color", "luminosity", "infra_luminosity", "layer", "glide_size", "icon", "icon_state", "invisibility", "suffix"] });

// /proc/ascii2text  built in (BYOND provides it)
rt.def("/proc/ascii2text", undefined, false, { args: ["N"] });

// /proc/block  built in (BYOND provides it)
rt.def("/proc/block", undefined, false, { args: ["Start", "End", "StartZ", "EndX", "EndY", "EndZ"] });

// /proc/bounds_dist  built in (BYOND provides it)
rt.def("/proc/bounds_dist", undefined, false, { args: ["Ref", "Target"] });

// /proc/ceil  built in (BYOND provides it)
rt.def("/proc/ceil", undefined, false, { args: ["A"] });

// /proc/ckey  built in (BYOND provides it)
rt.def("/proc/ckey", undefined, false, { args: ["Key"] });

// /proc/ckeyEx  built in (BYOND provides it)
rt.def("/proc/ckeyEx", undefined, false, { args: ["Text"] });

// /proc/clamp  built in (BYOND provides it)
rt.def("/proc/clamp", undefined, false, { args: ["Value", "Low", "High"] });

// /proc/cmptext  built in (BYOND provides it)
rt.def("/proc/cmptext", undefined, false, { args: ["T1"] });

// /proc/cmptextEx  built in (BYOND provides it)
rt.def("/proc/cmptextEx", undefined, false, { args: ["T1"] });

// /proc/copytext  built in (BYOND provides it)
rt.def("/proc/copytext", undefined, false, { args: ["T", "Start", "End"] });

// /proc/copytext_char  built in (BYOND provides it)
rt.def("/proc/copytext_char", undefined, false, { args: ["T", "Start", "End"] });

// /proc/CRASH  built in (BYOND provides it)
rt.def("/proc/CRASH", undefined, false, { args: ["msg"] });

// /proc/fcopy  built in (BYOND provides it)
rt.def("/proc/fcopy", undefined, false, { args: ["Src", "Dst"] });

// /proc/fcopy_rsc  built in (BYOND provides it)
rt.def("/proc/fcopy_rsc", undefined, false, { args: ["File"] });

// /proc/fdel  built in (BYOND provides it)
rt.def("/proc/fdel", undefined, false, { args: ["File"] });

// /proc/fexists  built in (BYOND provides it)
rt.def("/proc/fexists", undefined, false, { args: ["File"] });

// /proc/file  built in (BYOND provides it)
rt.def("/proc/file", undefined, false, { args: ["Path"] });

// /proc/file2text  built in (BYOND provides it)
rt.def("/proc/file2text", undefined, false, { args: ["File"] });

// /proc/filter  built in (BYOND provides it)
rt.def("/proc/filter", undefined, false, { args: ["type"] });

// /proc/findtext  built in (BYOND provides it)
rt.def("/proc/findtext", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findtext_char  built in (BYOND provides it)
rt.def("/proc/findtext_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findtextEx  built in (BYOND provides it)
rt.def("/proc/findtextEx", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findtextEx_char  built in (BYOND provides it)
rt.def("/proc/findtextEx_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findlasttext  built in (BYOND provides it)
rt.def("/proc/findlasttext", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findlasttext_char  built in (BYOND provides it)
rt.def("/proc/findlasttext_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findlasttextEx  built in (BYOND provides it)
rt.def("/proc/findlasttextEx", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/findlasttextEx_char  built in (BYOND provides it)
rt.def("/proc/findlasttextEx_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// /proc/flick  built in (BYOND provides it)
rt.def("/proc/flick", undefined, false, { args: ["Icon", "Object"] });

// /proc/flist  built in (BYOND provides it)
rt.def("/proc/flist", undefined, false, { args: ["Path"] });

// /proc/floor  built in (BYOND provides it)
rt.def("/proc/floor", undefined, false, { args: ["A"] });

// /proc/fract  built in (BYOND provides it)
rt.def("/proc/fract", undefined, false, { args: ["n"] });

// /proc/ftime  built in (BYOND provides it)
rt.def("/proc/ftime", undefined, false, { args: ["File", "IsCreationTime"] });

// /proc/generator  built in (BYOND provides it)
rt.def("/proc/generator", undefined, false, { args: ["type", "A", "B", "rand"] });

// /proc/get_step_to  built in (BYOND provides it)
rt.def("/proc/get_step_to", undefined, false, { args: ["Ref", "Trg", "Min"] });

// /proc/get_steps_to  built in (BYOND provides it)
rt.def("/proc/get_steps_to", undefined, false, { args: ["Ref", "Trg", "Min"] });

// /proc/gradient  built in (BYOND provides it)
rt.def("/proc/gradient", undefined, false, { args: ["A", "index"] });

// /proc/hascall  built in (BYOND provides it)
rt.def("/proc/hascall", undefined, false, { args: ["Object", "ProcName"] });

// /proc/hearers  built in (BYOND provides it)
rt.def("/proc/hearers", undefined, false, { args: ["Depth", "Center"] });

// /proc/html_decode  built in (BYOND provides it)
rt.def("/proc/html_decode", undefined, false, { args: ["HtmlText"] });

// /proc/html_encode  built in (BYOND provides it)
rt.def("/proc/html_encode", undefined, false, { args: ["PlainText"] });

// /proc/icon_states  built in (BYOND provides it)
rt.def("/proc/icon_states", undefined, false, { args: ["Icon", "mode"] });

// /proc/image  built in (BYOND provides it)
rt.def("/proc/image", undefined, false, { args: ["icon", "loc", "icon_state", "layer", "dir", "pixel_x", "pixel_y"] });

// /proc/isarea  built in (BYOND provides it)
rt.def("/proc/isarea", undefined, false, { args: ["Loc1"] });

// /proc/isfile  built in (BYOND provides it)
rt.def("/proc/isfile", undefined, false, { args: ["File"] });

// /proc/isicon  built in (BYOND provides it)
rt.def("/proc/isicon", undefined, false, { args: ["Icon"] });

// /proc/isinf  built in (BYOND provides it)
rt.def("/proc/isinf", undefined, false, { args: ["n"] });

// /proc/islist  built in (BYOND provides it)
rt.def("/proc/islist", undefined, false, { args: ["Object"] });

// /proc/isloc  built in (BYOND provides it)
rt.def("/proc/isloc", undefined, false, { args: ["Loc1"] });

// /proc/ismob  built in (BYOND provides it)
rt.def("/proc/ismob", undefined, false, { args: ["Loc1"] });

// /proc/isobj  built in (BYOND provides it)
rt.def("/proc/isobj", undefined, false, { args: ["Loc1"] });

// /proc/ismovable  built in (BYOND provides it)
rt.def("/proc/ismovable", undefined, false, { args: ["Loc1"] });

// /proc/isnan  built in (BYOND provides it)
rt.def("/proc/isnan", undefined, false, { args: ["n"] });

// /proc/isnull  built in (BYOND provides it)
rt.def("/proc/isnull", undefined, false, { args: ["Val"] });

// /proc/isnum  built in (BYOND provides it)
rt.def("/proc/isnum", undefined, false, { args: ["Val"] });

// /proc/ispath  built in (BYOND provides it)
rt.def("/proc/ispath", undefined, false, { args: ["Val", "Type"] });

// /proc/istext  built in (BYOND provides it)
rt.def("/proc/istext", undefined, false, { args: ["Val"] });

// /proc/isturf  built in (BYOND provides it)
rt.def("/proc/isturf", undefined, false, { args: ["Loc1"] });

// /proc/json_decode  built in (BYOND provides it)
rt.def("/proc/json_decode", undefined, false, { args: ["JSON"] });

// /proc/json_encode  built in (BYOND provides it)
rt.def("/proc/json_encode", undefined, false, { args: ["Value", "flags"] });

// /proc/length_char  built in (BYOND provides it)
rt.def("/proc/length_char", undefined, false, { args: ["E"] });

// /proc/lerp  built in (BYOND provides it)
rt.def("/proc/lerp", undefined, false, { args: ["A", "B", "factor"] });

// /proc/list2params  built in (BYOND provides it)
rt.def("/proc/list2params", undefined, false, { args: ["List"] });

// /proc/lowertext  built in (BYOND provides it)
rt.def("/proc/lowertext", undefined, false, { args: ["T"] });

// /proc/max  built in (BYOND provides it)
rt.def("/proc/max", undefined, false, { args: ["A"] });

// /proc/md5  built in (BYOND provides it)
rt.def("/proc/md5", undefined, false, { args: ["T"] });

// /proc/min  built in (BYOND provides it)
rt.def("/proc/min", undefined, false, { args: ["A"] });

// /proc/nonspantext  built in (BYOND provides it)
rt.def("/proc/nonspantext", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// /proc/nonspantext_char  built in (BYOND provides it)
rt.def("/proc/nonspantext_char", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// /proc/num2text  built in (BYOND provides it)
rt.def("/proc/num2text", undefined, false, { args: ["N", "A", "B"] });

// /proc/orange  built in (BYOND provides it)
rt.def("/proc/orange", undefined, false, { args: ["Dist", "Center"] });

// /proc/oview  built in (BYOND provides it)
rt.def("/proc/oview", undefined, false, { args: ["Dist", "Center"] });

// /proc/oviewers  built in (BYOND provides it)
rt.def("/proc/oviewers", undefined, false, { args: ["Depth", "Center"] });

// /proc/ohearers  built in (BYOND provides it)
rt.def("/proc/ohearers", undefined, false, { args: ["Depth", "Center"] });

// /proc/params2list  built in (BYOND provides it)
rt.def("/proc/params2list", undefined, false, { args: ["Params"] });

// /proc/rand  built in (BYOND provides it)
rt.def("/proc/rand", undefined, false, { args: ["L", "H"] });

// /proc/rand_seed  built in (BYOND provides it)
rt.def("/proc/rand_seed", undefined, false, { args: ["Seed"] });

// /proc/range  built in (BYOND provides it)
rt.def("/proc/range", undefined, false, { args: ["Dist", "Center"] });
// stress2a: typecache_filter_list(range(Dist, Center), Typecache) in one native pass (no full range list built); see rangeTypecache in src/vm/natives-world.ts.
rt.def("/proc/typecache_filter_range", undefined, false, { args: ["Dist", "Center", "Typecache"] });

// stress2b: get_hearers_in_view's collecting loop as one native (src/vm/natives-world.ts), and its check mode (env TG_CHECK_HEAR).
rt.def("/proc/collect_hearers", undefined, false, { args: ["Range"] });
rt.def("/proc/hear_check_mode", undefined, false, { args: [] });
// stress2c: TG_PIPE_BATCH=0 switch and the TG_STRESS_COUNTS=1 counters (src/vm/natives-world.ts)
rt.def("/proc/pipe_batch_on", undefined, false, { args: [] });
rt.def("/proc/blast_throw_old", undefined, false, { args: [] });
// stress2c: visible_message's nearby-player pre-check, check mode TG_CHECK_VISMSG=1
rt.def("/proc/vismsg_check_mode", undefined, false, { args: [] });
rt.def("/proc/vismsg_check", undefined, false, { args: ["Near"] });
// stress2c: Move's per-neighbour hooks, only for the neighbours where the call can matter (src/vm/natives-world.ts); check mode TG_CHECK_HOOKS=1
rt.def("/proc/hook_check_mode", undefined, false, { args: [] });
rt.def("/proc/hook_list", undefined, false, { args: ["Loc", "Hook"] });
rt.def("/proc/hook_skips", undefined, false, { args: ["A", "Hook"] });
rt.def("/proc/hook_check", undefined, false, { args: ["Skipped", "Result", "Hook"] });
rt.def("/proc/stress_counts_on", undefined, false, { args: [] });
rt.def("/proc/stress_count", undefined, false, { args: ["Key", "N"] });
rt.def("/proc/stress_set", undefined, false, { args: ["Key", "V"] });
rt.def("/proc/hear_check_compare", undefined, false, { args: ["Got", "Want"] });

// /proc/ref  built in (BYOND provides it)
rt.def("/proc/ref", undefined, false, { args: ["Object"] });

// /proc/refcount  built in (BYOND provides it)
rt.def("/proc/refcount", undefined, false, { args: ["Object"] });

// /proc/replacetext  built in (BYOND provides it)
rt.def("/proc/replacetext", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// /proc/replacetext_char  built in (BYOND provides it)
rt.def("/proc/replacetext_char", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// /proc/replacetextEx  built in (BYOND provides it)
rt.def("/proc/replacetextEx", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// /proc/replacetextEx_char  built in (BYOND provides it)
rt.def("/proc/replacetextEx_char", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// /proc/rgb  built in (BYOND provides it)
rt.def("/proc/rgb", undefined, false, { args: ["R", "G", "B", "A", "space"] });

// /proc/rgb2num  built in (BYOND provides it)
rt.def("/proc/rgb2num", undefined, false, { args: ["color", "space"] });

// /proc/roll  built in (BYOND provides it)
rt.def("/proc/roll", undefined, false, { args: ["ndice", "sides"] });

// /proc/round  built in (BYOND provides it)
rt.def("/proc/round", undefined, false, { args: ["A", "B"] });

// /proc/sha1  built in (BYOND provides it)
rt.def("/proc/sha1", undefined, false, { args: ["input"] });

// /proc/shutdown  built in (BYOND provides it)
rt.def("/proc/shutdown", undefined, false, { args: ["Addr", "Natural"] });

// /proc/sleep  built in (BYOND provides it)
rt.def("/proc/sleep", undefined, false, { args: ["Delay"] });

// /proc/sorttext  built in (BYOND provides it)
rt.def("/proc/sorttext", undefined, false, { args: ["T1", "T2"] });

// /proc/sorttextEx  built in (BYOND provides it)
rt.def("/proc/sorttextEx", undefined, false, { args: ["T1", "T2"] });

// /proc/sound  built in (BYOND provides it)
rt.def("/proc/sound", undefined, false, { args: ["file", "repeat", "wait", "channel", "volume"] });

// /proc/spantext  built in (BYOND provides it)
rt.def("/proc/spantext", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// /proc/spantext_char  built in (BYOND provides it)
rt.def("/proc/spantext_char", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// /proc/splicetext  built in (BYOND provides it)
rt.def("/proc/splicetext", undefined, false, { args: ["Text", "Start", "End", "Insert"] });

// /proc/splicetext_char  built in (BYOND provides it)
rt.def("/proc/splicetext_char", undefined, false, { args: ["Text", "Start", "End", "Insert"] });

// /proc/splittext  built in (BYOND provides it)
rt.def("/proc/splittext", undefined, false, { args: ["Text", "Delimiter", "Start", "End", "include_delimiters"] });

// /proc/splittext_char  built in (BYOND provides it)
rt.def("/proc/splittext_char", undefined, false, { args: ["Text", "Delimiter", "Start", "End", "include_delimiters"] });

// /proc/stat  built in (BYOND provides it)
rt.def("/proc/stat", undefined, false, { args: ["Name", "Value"] });

// /proc/statpanel  built in (BYOND provides it)
rt.def("/proc/statpanel", undefined, false, { args: ["Panel", "Name", "Value"] });

// /proc/text2ascii  built in (BYOND provides it)
rt.def("/proc/text2ascii", undefined, false, { args: ["T", "pos"] });

// /proc/text2ascii_char  built in (BYOND provides it)
rt.def("/proc/text2ascii_char", undefined, false, { args: ["T", "pos"] });

// /proc/text2file  built in (BYOND provides it)
rt.def("/proc/text2file", undefined, false, { args: ["Text", "File"] });

// /proc/text2num  built in (BYOND provides it)
rt.def("/proc/text2num", undefined, false, { args: ["T", "radix"] });

// /proc/text2path  built in (BYOND provides it)
rt.def("/proc/text2path", undefined, false, { args: ["T"] });

// /proc/time2text  built in (BYOND provides it)
rt.def("/proc/time2text", undefined, false, { args: ["timestamp", "format"] });

// /proc/trimtext  built in (BYOND provides it)
rt.def("/proc/trimtext", undefined, false, { args: ["Text"] });

// /proc/trunc  built in (BYOND provides it)
rt.def("/proc/trunc", undefined, false, { args: ["n"] });

// /proc/turn  built in (BYOND provides it)
rt.def("/proc/turn", undefined, false, { args: ["Dir", "Angle"] });

// /proc/typesof  built in (BYOND provides it)
rt.def("/proc/typesof", undefined, false, { args: ["Item1"] });

// /proc/uppertext  built in (BYOND provides it)
rt.def("/proc/uppertext", undefined, false, { args: ["T"] });

// /proc/url_decode  built in (BYOND provides it)
rt.def("/proc/url_decode", undefined, false, { args: ["UrlText"] });

// /proc/url_encode  built in (BYOND provides it)
rt.def("/proc/url_encode", undefined, false, { args: ["PlainText", "format"] });

// /proc/values_cut_over  built in (BYOND provides it)
rt.def("/proc/values_cut_over", undefined, false, { args: ["Alist", "Max", "inclusive"] });

// /proc/values_cut_under  built in (BYOND provides it)
rt.def("/proc/values_cut_under", undefined, false, { args: ["Alist", "Min", "inclusive"] });

// /proc/values_dot  built in (BYOND provides it)
rt.def("/proc/values_dot", undefined, false, { args: ["A", "B"] });

// /proc/values_product  built in (BYOND provides it)
rt.def("/proc/values_product", undefined, false, { args: ["Alist"] });

// /proc/values_sum  built in (BYOND provides it)
rt.def("/proc/values_sum", undefined, false, { args: ["Alist"] });

// /proc/view  built in (BYOND provides it)
rt.def("/proc/view", undefined, false, { args: ["Dist", "Center"] });

// /proc/viewers  built in (BYOND provides it)
rt.def("/proc/viewers", undefined, false, { args: ["Depth", "Center"] });

// /proc/walk  built in (BYOND provides it)
rt.def("/proc/walk", undefined, false, { args: ["Ref", "Dir", "Lag", "Speed"] });

// /proc/walk_rand  built in (BYOND provides it)
rt.def("/proc/walk_rand", undefined, false, { args: ["Ref", "Lag", "Speed"] });

// /proc/walk_to  built in (BYOND provides it)
rt.def("/proc/walk_to", undefined, false, { args: ["Ref", "Trg", "Min", "Lag", "Speed"] });

// /proc/walk_towards  built in (BYOND provides it)
rt.def("/proc/walk_towards", undefined, false, { args: ["Ref", "Trg", "Lag", "Speed"] });

// /proc/winclone  built in (BYOND provides it)
rt.def("/proc/winclone", undefined, false, { args: ["player", "window_name", "clone_name"] });

// /proc/winexists  built in (BYOND provides it)
rt.def("/proc/winexists", undefined, false, { args: ["player", "control_id"] });

// /proc/winget  built in (BYOND provides it)
rt.def("/proc/winget", undefined, false, { args: ["player", "control_id", "params"] });

// /proc/winset  built in (BYOND provides it)
rt.def("/proc/winset", undefined, false, { args: ["player", "control_id", "params"] });

// /proc/matrix  built in (BYOND provides it)
rt.def("/proc/matrix", undefined, false, { args: ["a", "b", "c", "d", "e", "f"] });

// /proc/regex  built in (BYOND provides it)
rt.def("/proc/regex", undefined, false, { args: ["pattern", "flags"] });

// /proc/eval  built in (BYOND provides it)
rt.def("/proc/eval", undefined, false, { args: ["script"] });

// /proc/load_resource  built in (BYOND provides it)
rt.def("/proc/load_resource", undefined, false, { args: ["File"] });

// /proc/missile  built in (BYOND provides it)
rt.def("/proc/missile", undefined, false, { args: ["Type", "Start", "End"] });

// /proc/run  built in (BYOND provides it)
rt.def("/proc/run", undefined, false, { args: ["File"] });

// /proc/shell  built in (BYOND provides it)
rt.def("/proc/shell", undefined, false, { args: ["command"] });

// /proc/bound_pixloc  built in (BYOND provides it)
rt.def("/proc/bound_pixloc", undefined, false, { args: ["Atom", "Dir"] });

// /proc/_dm_db_new_con  built in (BYOND provides it)
rt.def("/proc/_dm_db_new_con");

// /proc/_dm_db_connect  built in (BYOND provides it)
rt.def("/proc/_dm_db_connect");

// /proc/_dm_db_close  built in (BYOND provides it)
rt.def("/proc/_dm_db_close");

// /proc/_dm_db_is_connected  built in (BYOND provides it)
rt.def("/proc/_dm_db_is_connected");

// /proc/_dm_db_quote  built in (BYOND provides it)
rt.def("/proc/_dm_db_quote");

// /proc/_dm_db_new_query  built in (BYOND provides it)
rt.def("/proc/_dm_db_new_query");

// /proc/_dm_db_execute  built in (BYOND provides it)
rt.def("/proc/_dm_db_execute");

// /proc/_dm_db_next_row  built in (BYOND provides it)
rt.def("/proc/_dm_db_next_row");

// /proc/_dm_db_rows_affected  built in (BYOND provides it)
rt.def("/proc/_dm_db_rows_affected");

// /proc/_dm_db_row_count  built in (BYOND provides it)
rt.def("/proc/_dm_db_row_count");

// /proc/_dm_db_error_msg  built in (BYOND provides it)
rt.def("/proc/_dm_db_error_msg");

// /proc/_dm_db_columns  built in (BYOND provides it)
rt.def("/proc/_dm_db_columns");

// /alist/proc/New  built in (BYOND provides it)
rt.def("/alist/proc/New", undefined, false, { args: ["items"] });

// /alist/proc/Add  built in (BYOND provides it)
rt.def("/alist/proc/Add", undefined, false, { args: ["Item1"] });

// /alist/proc/Copy  built in (BYOND provides it)
rt.def("/alist/proc/Copy", undefined, false, { args: ["Start", "End"] });

// /alist/proc/Cut  built in (BYOND provides it)
rt.def("/alist/proc/Cut", undefined, false, { args: ["Start", "End"] });

// /alist/proc/Find  built in (BYOND provides it)
rt.def("/alist/proc/Find", undefined, false, { args: ["Elem", "Start", "End"] });

// /alist/proc/Insert  built in (BYOND provides it)
rt.def("/alist/proc/Insert", undefined, false, { args: ["Index", "Item1"] });

// /alist/proc/Join  built in (BYOND provides it)
rt.def("/alist/proc/Join", undefined, false, { args: ["Glue", "Start", "End"] });

// /alist/proc/Remove  built in (BYOND provides it)
rt.def("/alist/proc/Remove", undefined, false, { args: ["Item1"] });

// /alist/proc/RemoveAll  built in (BYOND provides it)
rt.def("/alist/proc/RemoveAll", undefined, false, { args: ["Item1"] });

// /alist/proc/Swap  built in (BYOND provides it)
rt.def("/alist/proc/Swap", undefined, false, { args: ["Index1", "Index2"] });

// /alist/proc/Splice  built in (BYOND provides it)
rt.def("/alist/proc/Splice", undefined, false, { args: ["Start", "End", "Item1"] });

// /client/proc/Command  built in (BYOND provides it)
rt.def("/client/proc/Command", undefined, false, { args: ["command"] });

// /client/proc/Import  built in (BYOND provides it)
rt.def("/client/proc/Import", undefined, false, { args: ["Query"] });

// /client/proc/Export  built in (BYOND provides it)
rt.def("/client/proc/Export", undefined, false, { args: ["file"] });

// /client/proc/SoundQuery  built in (BYOND provides it)
rt.def("/client/proc/SoundQuery");

// /client/proc/CheckPassport  built in (BYOND provides it)
rt.def("/client/proc/CheckPassport", undefined, false, { args: ["passport_identifier"] });

// /client/proc/SendPage  built in (BYOND provides it)
rt.def("/client/proc/SendPage", undefined, false, { args: ["msg", "recipient", "options"] });

// /client/proc/GetAPI  built in (BYOND provides it)
rt.def("/client/proc/GetAPI", undefined, false, { args: ["Api", "Name"] });

// /client/proc/SetAPI  built in (BYOND provides it)
rt.def("/client/proc/SetAPI", undefined, false, { args: ["Api", "Key", "Value"] });

// /database/proc/Close  built in (BYOND provides it)
rt.def("/database/proc/Close");

// /database/proc/Error  built in (BYOND provides it)
rt.def("/database/proc/Error");

// /database/proc/ErrorMsg  built in (BYOND provides it)
rt.def("/database/proc/ErrorMsg");

// /database/proc/New  built in (BYOND provides it)
rt.def("/database/proc/New", undefined, false, { args: ["filename"] });

// /database/proc/Open  built in (BYOND provides it)
rt.def("/database/proc/Open", undefined, false, { args: ["filename"] });

// /database/query/proc/Add  built in (BYOND provides it)
rt.def("/database/query/proc/Add", undefined, false, { args: ["text"] });

// /database/query/proc/Clear  built in (BYOND provides it)
rt.def("/database/query/proc/Clear");

// /database/query/proc/Close  built in (BYOND provides it)
rt.def("/database/query/proc/Close");

// /database/query/proc/Columns  built in (BYOND provides it)
rt.def("/database/query/proc/Columns", undefined, false, { args: ["column"] });

// /database/query/proc/Error  built in (BYOND provides it)
rt.def("/database/query/proc/Error");

// /database/query/proc/ErrorMsg  built in (BYOND provides it)
rt.def("/database/query/proc/ErrorMsg");

// /database/query/proc/Execute  built in (BYOND provides it)
rt.def("/database/query/proc/Execute", undefined, false, { args: ["database"] });

// /database/query/proc/GetColumn  built in (BYOND provides it)
rt.def("/database/query/proc/GetColumn", undefined, false, { args: ["column"] });

// /database/query/proc/GetRowData  built in (BYOND provides it)
rt.def("/database/query/proc/GetRowData");

// /database/query/proc/New  built in (BYOND provides it)
rt.def("/database/query/proc/New", undefined, false, { args: ["text"] });

// /database/query/proc/NextRow  built in (BYOND provides it)
rt.def("/database/query/proc/NextRow");

// /database/query/proc/RowsAffected  built in (BYOND provides it)
rt.def("/database/query/proc/RowsAffected");

// /database/query/proc/Reset  built in (BYOND provides it)
rt.def("/database/query/proc/Reset");

// /datum/proc/Del  built in (BYOND provides it)
rt.def("/datum/proc/Del");

// /datum/proc/Topic  built in (BYOND provides it)
rt.def("/datum/proc/Topic", undefined, false, { args: ["href", "href_list"] });

// /datum/proc/Read  built in (BYOND provides it)
rt.def("/datum/proc/Read", undefined, false, { args: ["F"] });

// /datum/proc/Write  built in (BYOND provides it)
rt.def("/datum/proc/Write", undefined, false, { args: ["F"] });

// /generator/proc/Rand  built in (BYOND provides it)
rt.def("/generator/proc/Rand");

// /icon/proc/New  built in (BYOND provides it)
rt.def("/icon/proc/New", undefined, false, { args: ["icon", "icon_state", "dir", "frame", "moving"] });

// /icon/proc/Blend  built in (BYOND provides it)
rt.def("/icon/proc/Blend", undefined, false, { args: ["icon", "function", "x", "y"] });

// /icon/proc/Crop  built in (BYOND provides it)
rt.def("/icon/proc/Crop", undefined, false, { args: ["x1", "y1", "x2", "y2"] });

// /icon/proc/DrawBox  built in (BYOND provides it)
rt.def("/icon/proc/DrawBox", undefined, false, { args: ["rgb", "x1", "y1", "x2", "y2"] });

// /icon/proc/Flip  built in (BYOND provides it)
rt.def("/icon/proc/Flip", undefined, false, { args: ["dir"] });

// /icon/proc/GetPixel  built in (BYOND provides it)
rt.def("/icon/proc/GetPixel", undefined, false, { args: ["x", "y", "icon_state", "dir", "frame", "moving"] });

// /icon/proc/Height  built in (BYOND provides it)
rt.def("/icon/proc/Height");

// /icon/proc/Insert  built in (BYOND provides it)
rt.def("/icon/proc/Insert", undefined, false, { args: ["new_icon", "icon_state", "dir", "frame", "moving", "delay"] });

// /icon/proc/MapColors  built in (BYOND provides it)
rt.def("/icon/proc/MapColors");

// /icon/proc/Scale  built in (BYOND provides it)
rt.def("/icon/proc/Scale", undefined, false, { args: ["width", "height"] });

// /icon/proc/SetIntensity  built in (BYOND provides it)
rt.def("/icon/proc/SetIntensity", undefined, false, { args: ["r", "g", "b"] });

// /icon/proc/Shift  built in (BYOND provides it)
rt.def("/icon/proc/Shift", undefined, false, { args: ["dir", "offset", "wrap"] });

// /icon/proc/SwapColor  built in (BYOND provides it)
rt.def("/icon/proc/SwapColor", undefined, false, { args: ["old_rgb", "new_rgb"] });

// /icon/proc/Turn  built in (BYOND provides it)
rt.def("/icon/proc/Turn", undefined, false, { args: ["angle"] });

// /icon/proc/Width  built in (BYOND provides it)
rt.def("/icon/proc/Width");

// /image/proc/New  built in (BYOND provides it)
rt.def("/image/proc/New", undefined, false, { args: ["icon", "loc", "icon_state", "layer", "dir", "pixel_x", "pixel_y"] });

// /list/proc/New  built in (BYOND provides it)
rt.def("/list/proc/New", undefined, false, { args: ["Size"] });

// /list/proc/Add  built in (BYOND provides it)
rt.def("/list/proc/Add", undefined, false, { args: ["Item1"] });

// /list/proc/Copy  built in (BYOND provides it)
rt.def("/list/proc/Copy", undefined, false, { args: ["Start", "End"] });

// /list/proc/Cut  built in (BYOND provides it)
rt.def("/list/proc/Cut", undefined, false, { args: ["Start", "End"] });

// /list/proc/Find  built in (BYOND provides it)
rt.def("/list/proc/Find", undefined, false, { args: ["Elem", "Start", "End"] });

// /list/proc/Insert  built in (BYOND provides it)
rt.def("/list/proc/Insert", undefined, false, { args: ["Index", "Item1"] });

// /list/proc/Join  built in (BYOND provides it)
rt.def("/list/proc/Join", undefined, false, { args: ["Glue", "Start", "End"] });

// /list/proc/Remove  built in (BYOND provides it)
rt.def("/list/proc/Remove", undefined, false, { args: ["Item1"] });

// /list/proc/RemoveAll  built in (BYOND provides it)
rt.def("/list/proc/RemoveAll", undefined, false, { args: ["Item1"] });

// /list/proc/Swap  built in (BYOND provides it)
rt.def("/list/proc/Swap", undefined, false, { args: ["Index1", "Index2"] });

// /list/proc/Splice  built in (BYOND provides it)
rt.def("/list/proc/Splice", undefined, false, { args: ["Start", "End", "Item1"] });

// /matrix/proc/Interpolate  built in (BYOND provides it)
rt.def("/matrix/proc/Interpolate", undefined, false, { args: ["Matrix2", "t"] });

// /matrix/proc/New  built in (BYOND provides it)
rt.def("/matrix/proc/New", undefined, false, { args: ["a", "b", "c", "d", "e", "f"] });

// /matrix/proc/Add  built in (BYOND provides it)
rt.def("/matrix/proc/Add", undefined, false, { args: ["Matrix2"] });

// /matrix/proc/Invert  built in (BYOND provides it)
rt.def("/matrix/proc/Invert");

// /matrix/proc/Multiply  built in (BYOND provides it)
rt.def("/matrix/proc/Multiply", undefined, false, { args: ["m"] });

// /matrix/proc/Scale  built in (BYOND provides it)
rt.def("/matrix/proc/Scale", undefined, false, { args: ["x", "y"] });

// /matrix/proc/Subtract  built in (BYOND provides it)
rt.def("/matrix/proc/Subtract", undefined, false, { args: ["Matrix2"] });

// /matrix/proc/Translate  built in (BYOND provides it)
rt.def("/matrix/proc/Translate", undefined, false, { args: ["x", "y"] });

// /matrix/proc/Turn  built in (BYOND provides it)
rt.def("/matrix/proc/Turn", undefined, false, { args: ["angle"] });

// /pixloc/proc/New  built in (BYOND provides it)
rt.def("/pixloc/proc/New", undefined, false, { args: ["x", "y", "z"] });

// /regex/proc/Find  built in (BYOND provides it)
rt.def("/regex/proc/Find", undefined, false, { args: ["haystack", "start", "end"] });

// /regex/proc/Replace  built in (BYOND provides it)
rt.def("/regex/proc/Replace", undefined, false, { args: ["haystack", "replacement", "start", "end"] });

// /savefile/proc/New  built in (BYOND provides it)
rt.def("/savefile/proc/New", undefined, false, { args: ["filename", "timeout"] });

// /savefile/proc/Flush  built in (BYOND provides it)
rt.def("/savefile/proc/Flush");

// /savefile/proc/ExportText  built in (BYOND provides it)
rt.def("/savefile/proc/ExportText", undefined, false, { args: ["path", "file"] });

// /savefile/proc/Lock  built in (BYOND provides it)
rt.def("/savefile/proc/Lock", undefined, false, { args: ["timeout"] });

// /savefile/proc/Unlock  built in (BYOND provides it)
rt.def("/savefile/proc/Unlock");

// /vector/proc/New  built in (BYOND provides it)
rt.def("/vector/proc/New", undefined, false, { args: ["x", "y", "z"] });

// /vector/proc/Cross  built in (BYOND provides it)
rt.def("/vector/proc/Cross", undefined, false, { args: ["B"] });

// /vector/proc/Turn  built in (BYOND provides it)
rt.def("/vector/proc/Turn", undefined, false, { args: ["angle"] });

// /world/proc/Del  built in (BYOND provides it)
rt.def("/world/proc/Del");

// /world/proc/Profile  built in (BYOND provides it)
rt.def("/world/proc/Profile", undefined, false, { args: ["command", "type", "format"] });

// /world/proc/GetConfig  built in (BYOND provides it)
rt.def("/world/proc/GetConfig", undefined, false, { args: ["config_set", "param"] });

// /world/proc/SetConfig  built in (BYOND provides it)
rt.def("/world/proc/SetConfig", undefined, false, { args: ["config_set", "param", "value"] });

// /world/proc/OpenPort  built in (BYOND provides it)
rt.def("/world/proc/OpenPort", undefined, false, { args: ["port"] });

// /world/proc/IsSubscribed  built in (BYOND provides it)
rt.def("/world/proc/IsSubscribed", undefined, false, { args: ["player", "type"] });

// /world/proc/Repop  built in (BYOND provides it)
rt.def("/world/proc/Repop");

// /world/proc/Export  built in (BYOND provides it)
rt.def("/world/proc/Export", undefined, false, { args: ["Addr", "File", "Persist", "Clients"] });

// /world/proc/Import  built in (BYOND provides it)
rt.def("/world/proc/Import");

// /world/proc/Tick  built in (BYOND provides it)
rt.def("/world/proc/Tick");

// /world/proc/ODHotReloadInterface  built in (BYOND provides it)
rt.def("/world/proc/ODHotReloadInterface");

// /world/proc/ODHotReloadResource  built in (BYOND provides it)
rt.def("/world/proc/ODHotReloadResource", undefined, false, { args: ["file_name"] });

// /atom/proc/MouseDown  built in (BYOND provides it)
rt.def("/atom/proc/MouseDown", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/MouseDrag  built in (BYOND provides it)
rt.def("/atom/proc/MouseDrag", undefined, false, { args: ["over_object", "src_location", "over_location", "src_control", "over_control", "params"] });

// /atom/proc/MouseMove  built in (BYOND provides it)
rt.def("/atom/proc/MouseMove", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/MouseUp  built in (BYOND provides it)
rt.def("/atom/proc/MouseUp", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/Entered  built in (BYOND provides it)
rt.def("/atom/proc/Entered", undefined, false, { args: ["Obj", "OldLoc"] });

// /atom/proc/Exited  built in (BYOND provides it)
rt.def("/atom/proc/Exited", undefined, false, { args: ["Obj", "newloc"] });

// /atom/proc/Uncrossed  built in (BYOND provides it)
rt.def("/atom/proc/Uncrossed", undefined, false, { args: ["O"] });

// /atom/proc/Crossed  built in (BYOND provides it)
rt.def("/atom/proc/Crossed", undefined, false, { args: ["O"] });

// /atom/proc/Stat  built in (BYOND provides it)
rt.def("/atom/proc/Stat");

// /proc/step  (_Standard.dm:173)  may sleep
rt.def("/proc/step", function* step(f: Frame, Ref: Value, Dir: Value, Speed: Value) {
	let NewLoc: Value = null;
	let $0: any;
	f.vars = () => [Ref, Dir, Speed, NewLoc, $0];
	if (live(Speed) === null) {
		Speed = 0;
	}
	if ((!truthy((NewLoc = rt.getStep(f, live(Ref), live(Dir)))) || isEqual(live(NewLoc), rt.fv(f, "loc", live(Ref))))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, live(Ref), "Move", [live(NewLoc), live(Dir)])))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	return $0;
}, true);

// /proc/step_away  (_Standard.dm:179)  may sleep
rt.def("/proc/step_away", function* step_away(f: Frame, Ref: Value, Trg: Value, Max: Value, Speed: Value) {
	let NewLoc: Value = null;
	let $0: any;
	f.vars = () => [Ref, Trg, Max, Speed, NewLoc, $0];
	if (live(Max) === null) {
		Max = 5;
	}
	if (live(Speed) === null) {
		Speed = 0;
	}
	if ((!truthy((NewLoc = (yield* g.call(f, P("/proc/get_step_away"), null, [live(Ref), live(Trg), live(Max)])))) || isEqual(live(NewLoc), rt.fv(f, "loc", live(Ref))))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, live(Ref), "Move", [live(NewLoc), rt.getDir(f, live(Ref), live(NewLoc))])))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	return $0;
}, true);

// /proc/step_to  (_Standard.dm:185)  may sleep
rt.def("/proc/step_to", function* step_to(f: Frame, Ref: Value, Trg: Value, Min: Value, Speed: Value) {
	let NewLoc: Value = null;
	let $0: any;
	f.vars = () => [Ref, Trg, Min, Speed, NewLoc, $0];
	if (live(Min) === null) {
		Min = 0;
	}
	if (live(Speed) === null) {
		Speed = 0;
	}
	if ((!truthy((NewLoc = (yield* g.call(f, P("/proc/get_step_to"), null, [live(Ref), live(Trg), live(Min)])))) || isEqual(live(NewLoc), rt.fv(f, "loc", live(Ref))))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, live(Ref), "Move", [live(NewLoc), rt.getDir(f, live(Ref), live(NewLoc))])))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	return $0;
}, true);

// /proc/walk_away  (_Standard.dm:192)
rt.def("/proc/walk_away", function walk_away(f: Frame, Ref: Value, Trg: Value, Max: Value, Lag: Value, Speed: Value) {
	f.vars = () => [Max, Lag, Speed];
	if (live(Max) === null) {
		Max = 5;
	}
	if (live(Lag) === null) {
		Lag = 0;
	}
	if (live(Speed) === null) {
		Speed = 0;
	}
	rt.call(f, P("/proc/CRASH"), null, ["/walk_away() is not implemented"]);
	return f.dot;
});

// /proc/get_dist  (_Standard.dm:198)
rt.def("/proc/get_dist", function get_dist(f: Frame, Loc1: Value, Loc2: Value) {
	let dx: Value = null, dy: Value = null;
	let $0: any;
	f.vars = () => [dx, dy, $0];
	if (isEqual(live(Loc1), live(Loc2))) {
		return -1;
	}
	if ((!truthy((rt.istype(live(Loc1), T("/atom")) ? 1 : 0)) || !truthy((rt.istype(live(Loc2), T("/atom")) ? 1 : 0)))) {
		return 127;
	}
	dx = subtract(rt.fv(f, "x", live(Loc2)), rt.fv(f, "x", live(Loc1)));
	dy = subtract(rt.fv(f, "y", live(Loc2)), rt.fv(f, "y", live(Loc1)));
	if (rt.lt(live(dx), 0)) {
		dx = rt.neg(live(dx));
	}
	if (rt.lt(live(dy), 0)) {
		dy = rt.neg(live(dy));
	}
	if (rt.gt(live(dx), live(dy))) {
		$0 = live(dx);
	} else {
		$0 = live(dy);
	}
	return $0;
});

// /proc/get_step_towards  (_Standard.dm:207)
rt.def("/proc/get_step_towards", function get_step_towards(f: Frame, Ref: Value, Trg: Value) {
	return rt.getStep(f, live(Ref), rt.getDir(f, live(Ref), live(Trg)));
});

// /proc/get_step_away  (_Standard.dm:211)
rt.def("/proc/get_step_away", function get_step_away(f: Frame, Ref: Value, Trg: Value, Max: Value) {
	f.vars = () => [Max];
	if (live(Max) === null) {
		Max = 5;
	}
	if (rt.gt(rt.call(f, P("/proc/get_dist"), null, [live(Ref), live(Trg)]), live(Max))) {
		return null;
	}
	return rt.getStep(f, live(Ref), rt.call(f, P("/proc/turn"), null, [rt.getDir(f, live(Ref), live(Trg)), 180]));
});

// /proc/get_step_rand  (_Standard.dm:217)
rt.def("/proc/get_step_rand", function get_step_rand(f: Frame, Ref: Value) {
	let dir: Value = null;
	f.vars = () => [dir];
	dir = rt.op(f, "PickUnweighted", [8], [1, 2, 4, 8, 5, 6, 10, 9]);
	return rt.getStep(f, live(Ref), live(dir));
});

// /proc/step_towards  (_Standard.dm:222)  may sleep
rt.def("/proc/step_towards", function* step_towards(f: Frame, Ref: Value, Trg: Value, Speed: Value) {
	let NewLoc: Value = null;
	let $0: any;
	f.vars = () => [Ref, Trg, Speed, NewLoc, $0];
	if ((!truthy((NewLoc = (yield* g.call(f, P("/proc/get_step_towards"), null, [live(Ref), live(Trg)])))) || isEqual(live(NewLoc), rt.fv(f, "loc", live(Ref))))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, live(Ref), "Move", [live(NewLoc), rt.getDir(f, live(Ref), live(Trg))])))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	return $0;
}, true);

// /proc/step_rand  (_Standard.dm:228)  may sleep
rt.def("/proc/step_rand", function* step_rand(f: Frame, Ref: Value, Speed: Value) {
	let target: Value = null;
	f.vars = () => [Ref, Speed, target];
	if (live(Speed) === null) {
		Speed = 0;
	}
	target = (yield* g.call(f, P("/proc/get_step_rand"), null, [live(Ref)]));
	return (yield* g.callName(f, live(Ref), "Move", [live(target), rt.getDir(f, live(Ref), live(target))]));
}, true);

// /proc/jointext  (_Standard.dm:232)
rt.def("/proc/jointext", function jointext(f: Frame, List: Value, Glue: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	if (truthy(rt.call(f, P("/proc/islist"), null, [live(List)]))) {
		return rt.callName(f, live(List), "Join", [live(Glue), live(Start), live(End)]);
	}
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(List)]))) {
		return live(List);
	}
	rt.call(f, P("/proc/CRASH"), null, ["jointext was passed a non-list, non-text value"]);
	return f.dot;
});

// /proc/lentext  (_Standard.dm:239)
rt.def("/proc/lentext", function lentext(f: Frame, _T: Value) {
	return rt.length(live(_T));
});

// /proc/winshow  (_Standard.dm:242)
rt.def("/proc/winshow", function winshow(f: Frame, player: Value, window: Value, show: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [show, $0, $1, $2];
	if (live(show) === null) {
		show = 1;
	}
	$0 = live(player);
	$1 = live(window);
	if (truthy(live(show))) {
		$1 = $1;
		$2 = "true";
	} else {
		$2 = "false";
	}
	rt.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-visible=＀", [$2])]);
	return f.dot;
});
