// Based on BYOND's _Standard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// BYOND built-in.
rt.def("/datum/proc/New");

// BYOND built-in.
rt.def("/proc/alert", undefined, false, { args: ["Usr", "Message", "Title", "Button1", "Button2", "Button3"] });

// BYOND built-in.
rt.def("/proc/animate", undefined, false, { args: ["Object", "time", "loop", "easing", "flags", "delay", "pixel_x", "pixel_y", "pixel_z", "maptext", "maptext_width", "maptext_height", "maptext_x", "maptext_y", "dir", "alpha", "transform", "color", "luminosity", "infra_luminosity", "layer", "glide_size", "icon", "icon_state", "invisibility", "suffix"] });

// BYOND built-in.
rt.def("/proc/ascii2text", undefined, false, { args: ["N"] });

// BYOND built-in.
rt.def("/proc/block", undefined, false, { args: ["Start", "End", "StartZ", "EndX", "EndY", "EndZ"] });

// BYOND built-in.
rt.def("/proc/bounds_dist", undefined, false, { args: ["Ref", "Target"] });

// BYOND built-in.
rt.def("/proc/ceil", undefined, false, { args: ["A"] });

// BYOND built-in.
rt.def("/proc/ckey", undefined, false, { args: ["Key"] });

// BYOND built-in.
rt.def("/proc/ckeyEx", undefined, false, { args: ["Text"] });

// BYOND built-in.
rt.def("/proc/clamp", undefined, false, { args: ["Value", "Low", "High"] });

// BYOND built-in.
rt.def("/proc/cmptext", undefined, false, { args: ["T1"] });

// BYOND built-in.
rt.def("/proc/cmptextEx", undefined, false, { args: ["T1"] });

// BYOND built-in.
rt.def("/proc/copytext", undefined, false, { args: ["T", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/copytext_char", undefined, false, { args: ["T", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/CRASH", undefined, false, { args: ["msg"] });

// BYOND built-in.
rt.def("/proc/fcopy", undefined, false, { args: ["Src", "Dst"] });

// BYOND built-in.
rt.def("/proc/fcopy_rsc", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/fdel", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/fexists", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/file", undefined, false, { args: ["Path"] });

// BYOND built-in.
rt.def("/proc/file2text", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/filter", undefined, false, { args: ["type"] });

// BYOND built-in.
rt.def("/proc/findtext", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findtext_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findtextEx", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findtextEx_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findlasttext", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findlasttext_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findlasttextEx", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/findlasttextEx_char", undefined, false, { args: ["Haystack", "Needle", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/flick", undefined, false, { args: ["Icon", "Object"] });

// BYOND built-in.
rt.def("/proc/flist", undefined, false, { args: ["Path"] });

// BYOND built-in.
rt.def("/proc/floor", undefined, false, { args: ["A"] });

// BYOND built-in.
rt.def("/proc/fract", undefined, false, { args: ["n"] });

// BYOND built-in.
rt.def("/proc/ftime", undefined, false, { args: ["File", "IsCreationTime"] });

// BYOND built-in.
rt.def("/proc/generator", undefined, false, { args: ["type", "A", "B", "rand"] });

// BYOND built-in.
rt.def("/proc/get_step_to", undefined, false, { args: ["Ref", "Trg", "Min"] });

// BYOND built-in.
rt.def("/proc/get_steps_to", undefined, false, { args: ["Ref", "Trg", "Min"] });

// BYOND built-in.
rt.def("/proc/gradient", undefined, false, { args: ["A", "index"] });

// BYOND built-in.
rt.def("/proc/hascall", undefined, false, { args: ["Object", "ProcName"] });

// BYOND built-in.
rt.def("/proc/hearers", undefined, false, { args: ["Depth", "Center"] });

// BYOND built-in.
rt.def("/proc/html_decode", undefined, false, { args: ["HtmlText"] });

// BYOND built-in.
rt.def("/proc/html_encode", undefined, false, { args: ["PlainText"] });

// BYOND built-in.
rt.def("/proc/icon_states", undefined, false, { args: ["Icon", "mode"] });

// BYOND built-in.
rt.def("/proc/image", undefined, false, { args: ["icon", "loc", "icon_state", "layer", "dir", "pixel_x", "pixel_y"] });

// BYOND built-in.
rt.def("/proc/isarea", undefined, false, { args: ["Loc1"] });

// BYOND built-in.
rt.def("/proc/isfile", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/isicon", undefined, false, { args: ["Icon"] });

// BYOND built-in.
rt.def("/proc/isinf", undefined, false, { args: ["n"] });

// BYOND built-in.
rt.def("/proc/islist", undefined, false, { args: ["Object"] });

// BYOND built-in.
rt.def("/proc/isloc", undefined, false, { args: ["Loc1"] });

// BYOND built-in.
rt.def("/proc/ismob", undefined, false, { args: ["Loc1"] });

// BYOND built-in.
rt.def("/proc/isobj", undefined, false, { args: ["Loc1"] });

// BYOND built-in.
rt.def("/proc/ismovable", undefined, false, { args: ["Loc1"] });

// BYOND built-in.
rt.def("/proc/isnan", undefined, false, { args: ["n"] });

// BYOND built-in.
rt.def("/proc/isnull", undefined, false, { args: ["Val"] });

// BYOND built-in.
rt.def("/proc/isnum", undefined, false, { args: ["Val"] });

// BYOND built-in.
rt.def("/proc/ispath", undefined, false, { args: ["Val", "Type"] });

// BYOND built-in.
rt.def("/proc/istext", undefined, false, { args: ["Val"] });

// BYOND built-in.
rt.def("/proc/isturf", undefined, false, { args: ["Loc1"] });

// BYOND built-in.
rt.def("/proc/json_decode", undefined, false, { args: ["JSON"] });

// BYOND built-in.
rt.def("/proc/json_encode", undefined, false, { args: ["Value", "flags"] });

// BYOND built-in.
rt.def("/proc/length_char", undefined, false, { args: ["E"] });

// BYOND built-in.
rt.def("/proc/lerp", undefined, false, { args: ["A", "B", "factor"] });

// BYOND built-in.
rt.def("/proc/list2params", undefined, false, { args: ["List"] });

// BYOND built-in.
rt.def("/proc/lowertext", undefined, false, { args: ["T"] });

// BYOND built-in.
rt.def("/proc/max", undefined, false, { args: ["A"] });

// BYOND built-in.
rt.def("/proc/md5", undefined, false, { args: ["T"] });

// BYOND built-in.
rt.def("/proc/min", undefined, false, { args: ["A"] });

// BYOND built-in.
rt.def("/proc/nonspantext", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// BYOND built-in.
rt.def("/proc/nonspantext_char", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// BYOND built-in.
rt.def("/proc/num2text", undefined, false, { args: ["N", "A", "B"] });

// BYOND built-in.
rt.def("/proc/orange", undefined, false, { args: ["Dist", "Center"] });

// BYOND built-in.
rt.def("/proc/oview", undefined, false, { args: ["Dist", "Center"] });

// BYOND built-in.
rt.def("/proc/oviewers", undefined, false, { args: ["Depth", "Center"] });

// BYOND built-in.
rt.def("/proc/ohearers", undefined, false, { args: ["Depth", "Center"] });

// BYOND built-in.
rt.def("/proc/params2list", undefined, false, { args: ["Params"] });

// BYOND built-in.
rt.def("/proc/rand", undefined, false, { args: ["L", "H"] });

// BYOND built-in.
rt.def("/proc/rand_seed", undefined, false, { args: ["Seed"] });

// BYOND built-in.
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

// BYOND built-in.
rt.def("/proc/ref", undefined, false, { args: ["Object"] });

// BYOND built-in.
rt.def("/proc/refcount", undefined, false, { args: ["Object"] });

// BYOND built-in.
rt.def("/proc/replacetext", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/replacetext_char", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/replacetextEx", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/replacetextEx_char", undefined, false, { args: ["Haystack", "Needle", "Replacement", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/rgb", undefined, false, { args: ["R", "G", "B", "A", "space"] });

// BYOND built-in.
rt.def("/proc/rgb2num", undefined, false, { args: ["color", "space"] });

// BYOND built-in.
rt.def("/proc/roll", undefined, false, { args: ["ndice", "sides"] });

// BYOND built-in.
rt.def("/proc/round", undefined, false, { args: ["A", "B"] });

// BYOND built-in.
rt.def("/proc/sha1", undefined, false, { args: ["input"] });

// BYOND built-in.
rt.def("/proc/shutdown", undefined, false, { args: ["Addr", "Natural"] });

// BYOND built-in.
rt.def("/proc/sleep", undefined, false, { args: ["Delay"] });

// BYOND built-in.
rt.def("/proc/sorttext", undefined, false, { args: ["T1", "T2"] });

// BYOND built-in.
rt.def("/proc/sorttextEx", undefined, false, { args: ["T1", "T2"] });

// BYOND built-in.
rt.def("/proc/sound", undefined, false, { args: ["file", "repeat", "wait", "channel", "volume"] });

// BYOND built-in.
rt.def("/proc/spantext", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// BYOND built-in.
rt.def("/proc/spantext_char", undefined, false, { args: ["Haystack", "Needles", "Start"] });

// BYOND built-in.
rt.def("/proc/splicetext", undefined, false, { args: ["Text", "Start", "End", "Insert"] });

// BYOND built-in.
rt.def("/proc/splicetext_char", undefined, false, { args: ["Text", "Start", "End", "Insert"] });

// BYOND built-in.
rt.def("/proc/splittext", undefined, false, { args: ["Text", "Delimiter", "Start", "End", "include_delimiters"] });

// BYOND built-in.
rt.def("/proc/splittext_char", undefined, false, { args: ["Text", "Delimiter", "Start", "End", "include_delimiters"] });

// BYOND built-in.
rt.def("/proc/stat", undefined, false, { args: ["Name", "Value"] });

// BYOND built-in.
rt.def("/proc/statpanel", undefined, false, { args: ["Panel", "Name", "Value"] });

// BYOND built-in.
rt.def("/proc/text2ascii", undefined, false, { args: ["T", "pos"] });

// BYOND built-in.
rt.def("/proc/text2ascii_char", undefined, false, { args: ["T", "pos"] });

// BYOND built-in.
rt.def("/proc/text2file", undefined, false, { args: ["Text", "File"] });

// BYOND built-in.
rt.def("/proc/text2num", undefined, false, { args: ["T", "radix"] });

// BYOND built-in.
rt.def("/proc/text2path", undefined, false, { args: ["T"] });

// BYOND built-in.
rt.def("/proc/time2text", undefined, false, { args: ["timestamp", "format"] });

// BYOND built-in.
rt.def("/proc/trimtext", undefined, false, { args: ["Text"] });

// BYOND built-in.
rt.def("/proc/trunc", undefined, false, { args: ["n"] });

// BYOND built-in.
rt.def("/proc/turn", undefined, false, { args: ["Dir", "Angle"] });

// BYOND built-in.
rt.def("/proc/typesof", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/proc/uppertext", undefined, false, { args: ["T"] });

// BYOND built-in.
rt.def("/proc/url_decode", undefined, false, { args: ["UrlText"] });

// BYOND built-in.
rt.def("/proc/url_encode", undefined, false, { args: ["PlainText", "format"] });

// BYOND built-in.
rt.def("/proc/values_cut_over", undefined, false, { args: ["Alist", "Max", "inclusive"] });

// BYOND built-in.
rt.def("/proc/values_cut_under", undefined, false, { args: ["Alist", "Min", "inclusive"] });

// BYOND built-in.
rt.def("/proc/values_dot", undefined, false, { args: ["A", "B"] });

// BYOND built-in.
rt.def("/proc/values_product", undefined, false, { args: ["Alist"] });

// BYOND built-in.
rt.def("/proc/values_sum", undefined, false, { args: ["Alist"] });

// BYOND built-in.
rt.def("/proc/view", undefined, false, { args: ["Dist", "Center"] });

// BYOND built-in.
rt.def("/proc/viewers", undefined, false, { args: ["Depth", "Center"] });

// BYOND built-in.
rt.def("/proc/walk", undefined, false, { args: ["Ref", "Dir", "Lag", "Speed"] });

// BYOND built-in.
rt.def("/proc/walk_rand", undefined, false, { args: ["Ref", "Lag", "Speed"] });

// BYOND built-in.
rt.def("/proc/walk_to", undefined, false, { args: ["Ref", "Trg", "Min", "Lag", "Speed"] });

// BYOND built-in.
rt.def("/proc/walk_towards", undefined, false, { args: ["Ref", "Trg", "Lag", "Speed"] });

// BYOND built-in.
rt.def("/proc/winclone", undefined, false, { args: ["player", "window_name", "clone_name"] });

// BYOND built-in.
rt.def("/proc/winexists", undefined, false, { args: ["player", "control_id"] });

// BYOND built-in.
rt.def("/proc/winget", undefined, false, { args: ["player", "control_id", "params"] });

// BYOND built-in.
rt.def("/proc/winset", undefined, false, { args: ["player", "control_id", "params"] });

// BYOND built-in.
rt.def("/proc/matrix", undefined, false, { args: ["a", "b", "c", "d", "e", "f"] });

// BYOND built-in.
rt.def("/proc/regex", undefined, false, { args: ["pattern", "flags"] });

// BYOND built-in.
rt.def("/proc/eval", undefined, false, { args: ["script"] });

// BYOND built-in.
rt.def("/proc/load_resource", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/missile", undefined, false, { args: ["Type", "Start", "End"] });

// BYOND built-in.
rt.def("/proc/run", undefined, false, { args: ["File"] });

// BYOND built-in.
rt.def("/proc/shell", undefined, false, { args: ["command"] });

// BYOND built-in.
rt.def("/proc/bound_pixloc", undefined, false, { args: ["Atom", "Dir"] });

// BYOND built-in.
rt.def("/proc/_dm_db_new_con");

// BYOND built-in.
rt.def("/proc/_dm_db_connect");

// BYOND built-in.
rt.def("/proc/_dm_db_close");

// BYOND built-in.
rt.def("/proc/_dm_db_is_connected");

// BYOND built-in.
rt.def("/proc/_dm_db_quote");

// BYOND built-in.
rt.def("/proc/_dm_db_new_query");

// BYOND built-in.
rt.def("/proc/_dm_db_execute");

// BYOND built-in.
rt.def("/proc/_dm_db_next_row");

// BYOND built-in.
rt.def("/proc/_dm_db_rows_affected");

// BYOND built-in.
rt.def("/proc/_dm_db_row_count");

// BYOND built-in.
rt.def("/proc/_dm_db_error_msg");

// BYOND built-in.
rt.def("/proc/_dm_db_columns");

// BYOND built-in.
rt.def("/alist/proc/New", undefined, false, { args: ["items"] });

// BYOND built-in.
rt.def("/alist/proc/Add", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/alist/proc/Copy", undefined, false, { args: ["Start", "End"] });

// BYOND built-in.
rt.def("/alist/proc/Cut", undefined, false, { args: ["Start", "End"] });

// BYOND built-in.
rt.def("/alist/proc/Find", undefined, false, { args: ["Elem", "Start", "End"] });

// BYOND built-in.
rt.def("/alist/proc/Insert", undefined, false, { args: ["Index", "Item1"] });

// BYOND built-in.
rt.def("/alist/proc/Join", undefined, false, { args: ["Glue", "Start", "End"] });

// BYOND built-in.
rt.def("/alist/proc/Remove", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/alist/proc/RemoveAll", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/alist/proc/Swap", undefined, false, { args: ["Index1", "Index2"] });

// BYOND built-in.
rt.def("/alist/proc/Splice", undefined, false, { args: ["Start", "End", "Item1"] });

// BYOND built-in.
rt.def("/client/proc/Command", undefined, false, { args: ["command"] });

// BYOND built-in.
rt.def("/client/proc/Import", undefined, false, { args: ["Query"] });

// BYOND built-in.
rt.def("/client/proc/Export", undefined, false, { args: ["file"] });

// BYOND built-in.
rt.def("/client/proc/SoundQuery");

// BYOND built-in.
rt.def("/client/proc/CheckPassport", undefined, false, { args: ["passport_identifier"] });

// BYOND built-in.
rt.def("/client/proc/SendPage", undefined, false, { args: ["msg", "recipient", "options"] });

// BYOND built-in.
rt.def("/client/proc/GetAPI", undefined, false, { args: ["Api", "Name"] });

// BYOND built-in.
rt.def("/client/proc/SetAPI", undefined, false, { args: ["Api", "Key", "Value"] });

// BYOND built-in.
rt.def("/database/proc/Close");

// BYOND built-in.
rt.def("/database/proc/Error");

// BYOND built-in.
rt.def("/database/proc/ErrorMsg");

// BYOND built-in.
rt.def("/database/proc/New", undefined, false, { args: ["filename"] });

// BYOND built-in.
rt.def("/database/proc/Open", undefined, false, { args: ["filename"] });

// BYOND built-in.
rt.def("/database/query/proc/Add", undefined, false, { args: ["text"] });

// BYOND built-in.
rt.def("/database/query/proc/Clear");

// BYOND built-in.
rt.def("/database/query/proc/Close");

// BYOND built-in.
rt.def("/database/query/proc/Columns", undefined, false, { args: ["column"] });

// BYOND built-in.
rt.def("/database/query/proc/Error");

// BYOND built-in.
rt.def("/database/query/proc/ErrorMsg");

// BYOND built-in.
rt.def("/database/query/proc/Execute", undefined, false, { args: ["database"] });

// BYOND built-in.
rt.def("/database/query/proc/GetColumn", undefined, false, { args: ["column"] });

// BYOND built-in.
rt.def("/database/query/proc/GetRowData");

// BYOND built-in.
rt.def("/database/query/proc/New", undefined, false, { args: ["text"] });

// BYOND built-in.
rt.def("/database/query/proc/NextRow");

// BYOND built-in.
rt.def("/database/query/proc/RowsAffected");

// BYOND built-in.
rt.def("/database/query/proc/Reset");

// BYOND built-in.
rt.def("/datum/proc/Del");

// BYOND built-in.
rt.def("/datum/proc/Topic", undefined, false, { args: ["href", "href_list"] });

// BYOND built-in.
rt.def("/datum/proc/Read", undefined, false, { args: ["F"] });

// BYOND built-in.
rt.def("/datum/proc/Write", undefined, false, { args: ["F"] });

// BYOND built-in.
rt.def("/generator/proc/Rand");

// BYOND built-in.
rt.def("/icon/proc/New", undefined, false, { args: ["icon", "icon_state", "dir", "frame", "moving"] });

// BYOND built-in.
rt.def("/icon/proc/Blend", undefined, false, { args: ["icon", "function", "x", "y"] });

// BYOND built-in.
rt.def("/icon/proc/Crop", undefined, false, { args: ["x1", "y1", "x2", "y2"] });

// BYOND built-in.
rt.def("/icon/proc/DrawBox", undefined, false, { args: ["rgb", "x1", "y1", "x2", "y2"] });

// BYOND built-in.
rt.def("/icon/proc/Flip", undefined, false, { args: ["dir"] });

// BYOND built-in.
rt.def("/icon/proc/GetPixel", undefined, false, { args: ["x", "y", "icon_state", "dir", "frame", "moving"] });

// BYOND built-in.
rt.def("/icon/proc/Height");

// BYOND built-in.
rt.def("/icon/proc/Insert", undefined, false, { args: ["new_icon", "icon_state", "dir", "frame", "moving", "delay"] });

// BYOND built-in.
rt.def("/icon/proc/MapColors");

// BYOND built-in.
rt.def("/icon/proc/Scale", undefined, false, { args: ["width", "height"] });

// BYOND built-in.
rt.def("/icon/proc/SetIntensity", undefined, false, { args: ["r", "g", "b"] });

// BYOND built-in.
rt.def("/icon/proc/Shift", undefined, false, { args: ["dir", "offset", "wrap"] });

// BYOND built-in.
rt.def("/icon/proc/SwapColor", undefined, false, { args: ["old_rgb", "new_rgb"] });

// BYOND built-in.
rt.def("/icon/proc/Turn", undefined, false, { args: ["angle"] });

// BYOND built-in.
rt.def("/icon/proc/Width");

// BYOND built-in.
rt.def("/image/proc/New", undefined, false, { args: ["icon", "loc", "icon_state", "layer", "dir", "pixel_x", "pixel_y"] });

// BYOND built-in.
rt.def("/list/proc/New", undefined, false, { args: ["Size"] });

// BYOND built-in.
rt.def("/list/proc/Add", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/list/proc/Copy", undefined, false, { args: ["Start", "End"] });

// BYOND built-in.
rt.def("/list/proc/Cut", undefined, false, { args: ["Start", "End"] });

// BYOND built-in.
rt.def("/list/proc/Find", undefined, false, { args: ["Elem", "Start", "End"] });

// BYOND built-in.
rt.def("/list/proc/Insert", undefined, false, { args: ["Index", "Item1"] });

// BYOND built-in.
rt.def("/list/proc/Join", undefined, false, { args: ["Glue", "Start", "End"] });

// BYOND built-in.
rt.def("/list/proc/Remove", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/list/proc/RemoveAll", undefined, false, { args: ["Item1"] });

// BYOND built-in.
rt.def("/list/proc/Swap", undefined, false, { args: ["Index1", "Index2"] });

// BYOND built-in.
rt.def("/list/proc/Splice", undefined, false, { args: ["Start", "End", "Item1"] });

// BYOND built-in.
rt.def("/matrix/proc/Interpolate", undefined, false, { args: ["Matrix2", "t"] });

// BYOND built-in.
rt.def("/matrix/proc/New", undefined, false, { args: ["a", "b", "c", "d", "e", "f"] });

// BYOND built-in.
rt.def("/matrix/proc/Add", undefined, false, { args: ["Matrix2"] });

// BYOND built-in.
rt.def("/matrix/proc/Invert");

// BYOND built-in.
rt.def("/matrix/proc/Multiply", undefined, false, { args: ["m"] });

// BYOND built-in.
rt.def("/matrix/proc/Scale", undefined, false, { args: ["x", "y"] });

// BYOND built-in.
rt.def("/matrix/proc/Subtract", undefined, false, { args: ["Matrix2"] });

// BYOND built-in.
rt.def("/matrix/proc/Translate", undefined, false, { args: ["x", "y"] });

// BYOND built-in.
rt.def("/matrix/proc/Turn", undefined, false, { args: ["angle"] });

// BYOND built-in.
rt.def("/pixloc/proc/New", undefined, false, { args: ["x", "y", "z"] });

// BYOND built-in.
rt.def("/regex/proc/Find", undefined, false, { args: ["haystack", "start", "end"] });

// BYOND built-in.
rt.def("/regex/proc/Replace", undefined, false, { args: ["haystack", "replacement", "start", "end"] });

// BYOND built-in.
rt.def("/savefile/proc/New", undefined, false, { args: ["filename", "timeout"] });

// BYOND built-in.
rt.def("/savefile/proc/Flush");

// BYOND built-in.
rt.def("/savefile/proc/ExportText", undefined, false, { args: ["path", "file"] });

// BYOND built-in.
rt.def("/savefile/proc/Lock", undefined, false, { args: ["timeout"] });

// BYOND built-in.
rt.def("/savefile/proc/Unlock");

// BYOND built-in.
rt.def("/vector/proc/New", undefined, false, { args: ["x", "y", "z"] });

// BYOND built-in.
rt.def("/vector/proc/Cross", undefined, false, { args: ["B"] });

// BYOND built-in.
rt.def("/vector/proc/Turn", undefined, false, { args: ["angle"] });

// BYOND built-in.
rt.def("/world/proc/Del");

// BYOND built-in.
rt.def("/world/proc/Profile", undefined, false, { args: ["command", "type", "format"] });

// BYOND built-in.
rt.def("/world/proc/GetConfig", undefined, false, { args: ["config_set", "param"] });

// BYOND built-in.
rt.def("/world/proc/SetConfig", undefined, false, { args: ["config_set", "param", "value"] });

// BYOND built-in.
rt.def("/world/proc/OpenPort", undefined, false, { args: ["port"] });

// BYOND built-in.
rt.def("/world/proc/IsSubscribed", undefined, false, { args: ["player", "type"] });

// BYOND built-in.
rt.def("/world/proc/Repop");

// BYOND built-in.
rt.def("/world/proc/Export", undefined, false, { args: ["Addr", "File", "Persist", "Clients"] });

// BYOND built-in.
rt.def("/world/proc/Import");

// BYOND built-in.
rt.def("/world/proc/Tick");

// BYOND built-in.
rt.def("/world/proc/ODHotReloadInterface");

// BYOND built-in.
rt.def("/world/proc/ODHotReloadResource", undefined, false, { args: ["file_name"] });

// BYOND built-in.
rt.def("/atom/proc/MouseDown", undefined, false, { args: ["location", "control", "params"] });

// BYOND built-in.
rt.def("/atom/proc/MouseDrag", undefined, false, { args: ["over_object", "src_location", "over_location", "src_control", "over_control", "params"] });

// BYOND built-in.
rt.def("/atom/proc/MouseMove", undefined, false, { args: ["location", "control", "params"] });

// BYOND built-in.
rt.def("/atom/proc/MouseUp", undefined, false, { args: ["location", "control", "params"] });

// BYOND built-in.
rt.def("/atom/proc/Entered", undefined, false, { args: ["Obj", "OldLoc"] });

// BYOND built-in.
rt.def("/atom/proc/Exited", undefined, false, { args: ["Obj", "newloc"] });

// BYOND built-in.
rt.def("/atom/proc/Uncrossed", undefined, false, { args: ["O"] });

// BYOND built-in.
rt.def("/atom/proc/Crossed", undefined, false, { args: ["O"] });

// BYOND built-in.
rt.def("/atom/proc/Stat");

// _Standard.dm:173
rt.def("/proc/step", function* step(f: Frame, Ref: Value, Dir: Value, Speed: Value) {
	let NewLoc: Value = null;
	Speed ??= 0;
	if (!(NewLoc = rt.getStep(f, Ref, Dir)) || NewLoc == Ref.loc) {
		return 0;
	}
	return (yield* Ref.Move(NewLoc, Dir)) ? 1 : 0;
}, true);

// _Standard.dm:179
rt.def("/proc/step_away", function* step_away(f: Frame, Ref: Value, Trg: Value, Max: Value, Speed: Value) {
	let NewLoc: Value = null;
	Max ??= 5;
	Speed ??= 0;
	if (!(NewLoc = get_step_away(Ref, Trg, Max)) || NewLoc == Ref.loc) {
		return 0;
	}
	return (yield* Ref.Move(NewLoc, rt.getDir(f, Ref, NewLoc))) ? 1 : 0;
}, true);

// _Standard.dm:185
rt.def("/proc/step_to", function* step_to(f: Frame, Ref: Value, Trg: Value, Min: Value, Speed: Value) {
	let NewLoc: Value = null;
	Min ??= 0;
	Speed ??= 0;
	if (!(NewLoc = get_step_to(Ref, Trg, Min)) || NewLoc == Ref.loc) {
		return 0;
	}
	return (yield* Ref.Move(NewLoc, rt.getDir(f, Ref, NewLoc))) ? 1 : 0;
}, true);

// _Standard.dm:192
rt.def("/proc/walk_away", function walk_away(f: Frame, Ref: Value, Trg: Value, Max: Value, Lag: Value, Speed: Value) {
	Max ??= 5;
	Lag ??= 0;
	Speed ??= 0;
	CRASH("/walk_away() is not implemented");
	return f.dot;
});

// _Standard.dm:198
rt.def("/proc/get_dist", function get_dist(f: Frame, Loc1: Value, Loc2: Value) {
	if (Loc1 == Loc2) {
		return -1;
	}
	if (!rt.istype(Loc1, T("/atom")) || !rt.istype(Loc2, T("/atom"))) {
		return 127;
	}
	let dx: Value = Loc2.x - Loc1.x;
	let dy: Value = Loc2.y - Loc1.y;
	if (dx < 0) {
		dx = -dx;
	}
	if (dy < 0) {
		dy = -dy;
	}
	return dx > dy ? dx : dy;
});

// _Standard.dm:207
rt.def("/proc/get_step_towards", function get_step_towards(f: Frame, Ref: Value, Trg: Value) {
	return rt.getStep(f, Ref, rt.getDir(f, Ref, Trg));
});

// _Standard.dm:211
rt.def("/proc/get_step_away", function get_step_away(f: Frame, Ref: Value, Trg: Value, Max: Value) {
	Max ??= 5;
	if (get_dist(Ref, Trg) > Max) {
		return null;
	}
	return rt.getStep(f, Ref, turn(rt.getDir(f, Ref, Trg), 180));
});

// _Standard.dm:217
rt.def("/proc/get_step_rand", function get_step_rand(f: Frame, Ref: Value) {
	let dir: Value = pick(1, 2, 4, 8, 5, 6, 10, 9);
	return rt.getStep(f, Ref, dir);
});

// _Standard.dm:222
rt.def("/proc/step_towards", function* step_towards(f: Frame, Ref: Value, Trg: Value, Speed: Value) {
	let NewLoc: Value = null;
	if (!(NewLoc = get_step_towards(Ref, Trg)) || NewLoc == Ref.loc) {
		return 0;
	}
	return (yield* Ref.Move(NewLoc, rt.getDir(f, Ref, Trg))) ? 1 : 0;
}, true);

// _Standard.dm:228
rt.def("/proc/step_rand", function* step_rand(f: Frame, Ref: Value, Speed: Value) {
	Speed ??= 0;
	let target: Value = get_step_rand(Ref);
	return (yield* Ref.Move(target, rt.getDir(f, Ref, target)));
}, true);

// _Standard.dm:232
rt.def("/proc/jointext", function jointext(f: Frame, List: Value, Glue: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	if (islist(List)) {
		return List.Join(Glue, Start, End);
	}
	if (istext(List)) {
		return List;
	}
	CRASH("jointext was passed a non-list, non-text value");
	return f.dot;
});

// _Standard.dm:239
rt.def("/proc/lentext", function lentext(f: Frame, _T: Value) {
	return rt.length(_T);
});

// _Standard.dm:242
rt.def("/proc/winshow", function winshow(f: Frame, player: Value, window: Value, show: Value) {
	let $2: any;
	show ??= 1;
	let $0: any = player;
	let $1: any = window;
	if (show) {

		$2 = "true";
	} else {
		$2 = "false";
	}
	winset($0, $1, `is-visible=${$2}`);
	return f.dot;
});
