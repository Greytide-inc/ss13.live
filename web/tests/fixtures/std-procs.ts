// Test-program standard procs for the engine-section fixtures: the built-in procs (bodiless: the VM supplies them) and the
// standard bodies DMStandard has in DM (atom/New, Enter, Exit, Move, client/New, Topic, mob/Login ...). Copied once from
// web/game/_Standard.ts and web/game/Types/ (types the fixtures do not declare left out); hand-edit as the fixtures need.
import { rt } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;

// ---- _Standard.ts ----
{
const $ic = rt.fieldICs(["loc","loc","loc","x","x","y","y","loc"]);
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

// /datum/proc/Del  built in (BYOND provides it)
rt.def("/datum/proc/Del");

// /datum/proc/Topic  built in (BYOND provides it)
rt.def("/datum/proc/Topic", undefined, false, { args: ["href", "href_list"] });

// /datum/proc/Read  built in (BYOND provides it)
rt.def("/datum/proc/Read", undefined, false, { args: ["F"] });

// /datum/proc/Write  built in (BYOND provides it)
rt.def("/datum/proc/Write", undefined, false, { args: ["F"] });

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

// /world/proc/SetScores  built in (BYOND provides it)
rt.def("/world/proc/SetScores");

// /world/proc/GetScores  built in (BYOND provides it)
rt.def("/world/proc/GetScores");

// /world/proc/GetMedal  built in (BYOND provides it)
rt.def("/world/proc/GetMedal");

// /world/proc/SetMedal  built in (BYOND provides it)
rt.def("/world/proc/SetMedal");

// /world/proc/ClearMedal  built in (BYOND provides it)
rt.def("/world/proc/ClearMedal");

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
	if ((!truthy((NewLoc = rt.getStep(f, live(Ref), live(Dir)))) || isEqual(live(NewLoc), rt.fieldI(f, live(Ref), $ic[0])))) {
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
	if ((!truthy((NewLoc = (yield* g.call(f, P("/proc/get_step_away"), null, [live(Ref), live(Trg), live(Max)])))) || isEqual(live(NewLoc), rt.fieldI(f, live(Ref), $ic[1])))) {
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
	if ((!truthy((NewLoc = (yield* g.call(f, P("/proc/get_step_to"), null, [live(Ref), live(Trg), live(Min)])))) || isEqual(live(NewLoc), rt.fieldI(f, live(Ref), $ic[2])))) {
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
	dx = subtract(rt.fieldI(f, live(Loc2), $ic[3]), rt.fieldI(f, live(Loc1), $ic[4]));
	dy = subtract(rt.fieldI(f, live(Loc2), $ic[5]), rt.fieldI(f, live(Loc1), $ic[6]));
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
	if ((!truthy((NewLoc = (yield* g.call(f, P("/proc/get_step_towards"), null, [live(Ref), live(Trg)])))) || isEqual(live(NewLoc), rt.fieldI(f, live(Ref), $ic[7])))) {
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

}

// ---- Types/Atoms/_Atom.ts ----
{
// From Types/Atoms/_Atom.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs(["density","density","density","density"]);

// /atom/proc/handle_atom_del  empty
rt.def("/atom/proc/handle_atom_del", undefined, false, { args: ["A"] });

// /atom/proc/Cross  (Types/Atoms/_Atom.dm:95)
rt.def("/atom/proc/Cross", function Cross(f: Frame, O: Value) {
	return (!(truthy(rt.fieldI(f, live(f.src), $ic[0])) && truthy(rt.fieldI(f, live(O), $ic[1]))) ? 1 : 0);
});

// /atom/proc/Enter  (Types/Atoms/_Atom.dm:106)
rt.def("/atom/proc/Enter", function Enter(f: Frame, O: Value, oldloc: Value) {
	let content: Value = null;
	let $e: any;
	f.vars = () => [content, $e];
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(f.src)]))) {
		if (((truthy(rt.srcVarI(f, $ic[2])) && truthy(live(O))) && truthy(rt.fieldI(f, live(O), $ic[3])))) {
			return 0;
		}
		content = null;
		rt.forList(f, 0, live(f.src), T("/atom/movable"));
		while ((($e = rt.next(f, 0)) !== undefined)) {
			content = $e;
			if ((!isEqual(live(content), live(O)) && !truthy(rt.callName(f, live(content), "Cross", [live(O)])))) {
				return 0;
			}
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /atom/proc/Exit  (Types/Atoms/_Atom.dm:115)
rt.def("/atom/proc/Exit", function Exit(f: Frame, O: Value, newloc: Value) {
	let content: Value = null;
	let $e: any;
	f.vars = () => [content, $e];
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(f.src)]))) {
		content = null;
		rt.forList(f, 0, live(f.src), T("/atom/movable"));
		while ((($e = rt.next(f, 0)) !== undefined)) {
			content = $e;
			if ((!isEqual(live(content), live(O)) && !truthy(rt.callName(f, live(content), "Uncross", [live(O)])))) {
				return 0;
			}
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /atom/proc/New  (Types/Atoms/_Atom.dm:124)
rt.def("/atom/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["loc"] });
}

// ---- Types/Atoms/Movable.ts ----
{
// From Types/Atoms/Movable.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs(["loc","dir","dir","loc","loc","density","density","loc","z","z"]);

// /atom/movable/proc/get_alt_name  empty
rt.def("/atom/movable/proc/get_alt_name");

// /atom/movable/proc/GetJob  empty
rt.def("/atom/movable/proc/GetJob");

// /atom/movable/proc/GetSource  empty
rt.def("/atom/movable/proc/GetSource");

// /atom/movable/proc/GetRadio  empty
rt.def("/atom/movable/proc/GetRadio");

// /atom/movable/proc/Move  (Types/Atoms/Movable.dm:25)
rt.def("/atom/movable/proc/Move", function Move(f: Frame, NewLoc: Value, Dir: Value) {
	let oldloc: Value = null, d: Value = null, oldarea: Value = null, newarea: Value = null, areachange: Value = null, entered: Value = null, areaentered: Value = null, obstacle: Value = null, uncrossed: Value = null, crossed: Value = null;
	let $0: any, $e: any;
	f.vars = () => [Dir, oldloc, d, oldarea, newarea, areachange, entered, areaentered, obstacle, uncrossed, crossed, $0, $e];
	if (live(Dir) === null) {
		Dir = 0;
	}
	if (live(NewLoc) === null) {
		return 0;
	}
	oldloc = rt.srcVarI(f, $ic[0]);
	if (truthy(live(Dir))) {
		rt.setSrcVarI(f, $ic[1], live(Dir));
	} else {
		if (truthy(live(oldloc))) {
			if (truthy((d = rt.getDir(f, live(oldloc), live(NewLoc))))) {
				rt.setSrcVarI(f, $ic[2], live(d));
			}
		}
	}
	if (isEqual(live(oldloc), live(NewLoc))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(oldloc)]))) {
		$0 = rt.fieldI(f, live(oldloc), $ic[3]);
	} else {
		$0 = null;
	}
	oldarea = $0;
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(NewLoc)]))) {
		$0 = rt.fieldI(f, live(NewLoc), $ic[4]);
	} else {
		$0 = null;
	}
	newarea = $0;
	areachange = (!isEqual(live(oldarea), live(newarea)) ? 1 : 0);
	if (truthy(live(oldloc))) {
		if (!truthy(rt.callName(f, live(oldloc), "Exit", [live(f.src), live(NewLoc)]))) {
			return 0;
		}
		if (((truthy(live(areachange)) && truthy(live(oldarea))) && !truthy(rt.callName(f, live(oldarea), "Exit", [live(f.src), live(NewLoc)])))) {
			return 0;
		}
	}
	entered = rt.callName(f, live(NewLoc), "Enter", [live(f.src), live(oldloc)]);
	if ((!truthy(live(areachange)) || !truthy(live(newarea)))) {
		$0 = 1;
	} else {
		$0 = rt.callName(f, live(newarea), "Enter", [live(f.src), live(oldloc)]);
	}
	areaentered = $0;
	if ((!truthy(live(entered)) || !truthy(live(areaentered)))) {
		if (!truthy(live(entered))) {
			if (truthy(rt.fieldI(f, live(NewLoc), $ic[5]))) {
				rt.callSrc(f, "Bump", [live(NewLoc)]);
			} else {
				obstacle = null;
				rt.forList(f, 0, live(NewLoc), T("/atom/movable"));
				while ((($e = rt.next(f, 0)) !== undefined)) {
					obstacle = $e;
					if ((!isEqual(live(obstacle), live(f.src)) && truthy(rt.fieldI(f, live(obstacle), $ic[6])))) {
						rt.callSrc(f, "Bump", [live(obstacle)]);
						break;
					}
				}
				rt.endFor(f, 0);
			}
		}
		if (!truthy(live(areaentered))) {
			rt.callSrc(f, "Bump", [live(newarea)]);
		}
		return 0;
	}
	rt.setSrcVarI(f, $ic[7], live(NewLoc));
	if (truthy(live(oldloc))) {
		rt.callName(f, live(oldloc), "Exited", [live(f.src), live(NewLoc)]);
		if (truthy(rt.call(f, P("/proc/isturf"), null, [live(oldloc)]))) {
			uncrossed = null;
			rt.forList(f, 0, live(oldloc), T("/atom/movable"));
			while ((($e = rt.next(f, 0)) !== undefined)) {
				uncrossed = $e;
				if (!isEqual(live(uncrossed), live(f.src))) {
					rt.callName(f, live(uncrossed), "Uncrossed", [live(f.src)]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	if ((truthy(live(areachange)) && truthy(live(oldarea)))) {
		rt.callName(f, live(oldarea), "Exited", [live(f.src), live(NewLoc)]);
	}
	rt.callName(f, live(NewLoc), "Entered", [live(f.src), live(oldloc)]);
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(NewLoc)]))) {
		crossed = null;
		rt.forList(f, 0, live(NewLoc), T("/atom/movable"));
		while ((($e = rt.next(f, 0)) !== undefined)) {
			crossed = $e;
			if (!isEqual(live(crossed), live(f.src))) {
				rt.callName(f, live(crossed), "Crossed", [live(f.src)]);
			}
		}
		rt.endFor(f, 0);
	}
	if ((truthy(live(areachange)) && truthy(live(newarea)))) {
		rt.callName(f, live(newarea), "Entered", [live(f.src), live(oldloc)]);
	}
	if ((((truthy(rt.call(f, P("/proc/isturf"), null, [live(oldloc)])) && truthy(rt.call(f, P("/proc/isturf"), null, [live(NewLoc)]))) && isEqual(rt.fieldI(f, live(oldloc), $ic[8]), rt.fieldI(f, live(NewLoc), $ic[9]))) && isEqual(rt.call(f, P("/proc/get_dist"), null, [live(oldloc), live(NewLoc)]), 1))) {
		return 32;
	}
	return 1;
});
}

// ---- Types/Atoms/Mob.ts ----
{
// From Types/Atoms/Mob.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs(["loc","loc","client"]);

// /mob/proc/CanMobAutoclick  empty
rt.def("/mob/proc/CanMobAutoclick", undefined, false, { args: ["object", "location", "params"] });

// /mob/proc/canMobMousedown  empty
rt.def("/mob/proc/canMobMousedown", undefined, false, { args: ["object", "location", "params"] });

// /mob/proc/RangedAttack  empty
rt.def("/mob/proc/RangedAttack", undefined, false, { args: ["A", "params"] });

// /mob/proc/browse_rsc_icon  empty
rt.def("/mob/proc/browse_rsc_icon", undefined, false, { args: ["icon", "icon_state", "dir"] });

// /mob/proc/petrify  empty
rt.def("/mob/proc/petrify", undefined, false, { args: ["statue_timer"] });

// /mob/proc/get_contents  empty
rt.def("/mob/proc/get_contents");

// /mob/proc/restoreEars  empty
rt.def("/mob/proc/restoreEars");

// /mob/proc/adjustEarDamage  empty
rt.def("/mob/proc/adjustEarDamage");

// /mob/proc/minimumDeafTicks  empty
rt.def("/mob/proc/minimumDeafTicks");

// /mob/proc/Login  (Types/Atoms/Mob.dm:19)
rt.def("/mob/proc/Login", function Login(f: Frame) {
	let fallback_spawn: Value = null;
	f.vars = () => [fallback_spawn];
	if (truthy(rt.srcVarI(f, $ic[0]))) return f.dot;
	if (!truthy((fallback_spawn = rt.locate(1, 1, 1)))) return f.dot;
	rt.setSrcVarI(f, $ic[1], live(fallback_spawn));
	return f.dot;
});

// /mob/proc/Logout  (Types/Atoms/Mob.dm:25)
rt.def("/mob/proc/Logout", function Logout(f: Frame) {
	rt.del(f, rt.srcVarI(f, $ic[2]));
	return f.dot;
});
}

// ---- Types/Client.ts ----
{
// From Types/Client.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs(["key","key","mob","mob","mob","eye","statobj","mob","mob","statobj","statobj","mob","mob","mob","mob","mob","mob","mob","mob","mob"]);

// /client/proc/New  (Types/Client.dm:61)  may sleep
rt.def("/client/proc/New", function* New(f: Frame, TopicData: Value) {
	let M: Value = null, initial_mob: Value = null;
	let $e: any;
	f.vars = () => [TopicData, M, initial_mob, $e];
	M = null;
	rt.forList(f, 0, rt.world(), T("/mob"));
	while ((($e = rt.next(f, 0)) !== undefined)) {
		M = $e;
		if (isEqual(rt.fieldI(f, live(M), $ic[0]), rt.srcVarI(f, $ic[1]))) {
			rt.setSrcVarI(f, $ic[2], live(M));
			break;
		}
	}
	rt.endFor(f, 0);
	if (rt.srcVarI(f, $ic[3]) === null) {
		rt.setSrcVarI(f, $ic[5], (initial_mob = (yield* g.new_(f, rt.fieldI(f, rt.world(), $ic[4]), []))));
		rt.setSrcVarI(f, $ic[6], live(initial_mob));
		rt.setSrcVarI(f, $ic[7], live(initial_mob));
	}
	return rt.srcVarI(f, $ic[8]);
}, true);

// /client/proc/Topic  (Types/Client.dm:77)  may sleep
rt.def("/client/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	f.vars = () => [href, href_list, hsrc];
	if (live(hsrc) === null) return f.dot;
	(yield* g.callName(f, live(hsrc), "Topic", [live(href), live(href_list)]));
	return f.dot;
}, true);

// /client/proc/Stat  (Types/Client.dm:81)  may sleep
rt.def("/client/proc/Stat", function* Stat(f: Frame) {
	if (!truthy((rt.istype(rt.srcVarI(f, $ic[9]), T("/atom")) ? 1 : 0))) return f.dot;
	(yield* g.callName(f, rt.srcVarI(f, $ic[10]), "Stat", []));
	return f.dot;
}, true);

// /client/proc/Move  (Types/Client.dm:100)  may sleep
rt.def("/client/proc/Move", function* Move(f: Frame, loc: Value, dir: Value) {
	f.vars = () => [loc, dir];
	(yield* g.callName(f, rt.srcVarI(f, $ic[11]), "Move", [live(loc), live(dir)]));
	return f.dot;
}, true);

// /client/verb/North  (Types/Client.dm:104)  may sleep
rt.def("/client/verb/North", function* North(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[12]), 1), 1]));
	return f.dot;
}, true, { verb: { name: ".north" } });

// /client/verb/South  (Types/Client.dm:108)  may sleep
rt.def("/client/verb/South", function* South(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[13]), 2), 2]));
	return f.dot;
}, true, { verb: { name: ".south" } });

// /client/verb/East  (Types/Client.dm:112)  may sleep
rt.def("/client/verb/East", function* East(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[14]), 4), 4]));
	return f.dot;
}, true, { verb: { name: ".east" } });

// /client/verb/West  (Types/Client.dm:116)  may sleep
rt.def("/client/verb/West", function* West(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[15]), 8), 8]));
	return f.dot;
}, true, { verb: { name: ".west" } });

// /client/verb/Northeast  (Types/Client.dm:120)  may sleep
rt.def("/client/verb/Northeast", function* Northeast(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[16]), 5), 5]));
	return f.dot;
}, true, { verb: { name: ".northeast" } });

// /client/verb/Southeast  (Types/Client.dm:124)  may sleep
rt.def("/client/verb/Southeast", function* Southeast(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[17]), 6), 6]));
	return f.dot;
}, true, { verb: { name: ".southeast" } });

// /client/verb/Southwest  (Types/Client.dm:128)  may sleep
rt.def("/client/verb/Southwest", function* Southwest(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[18]), 10), 10]));
	return f.dot;
}, true, { verb: { name: ".southwest" } });

// /client/verb/Northwest  (Types/Client.dm:132)  may sleep
rt.def("/client/verb/Northwest", function* Northwest(f: Frame) {
	(yield* g.callSrc(f, "Move", [rt.getStep(f, rt.srcVarI(f, $ic[19]), 9), 9]));
	return f.dot;
}, true, { verb: { name: ".northwest" } });

// /client/proc/Click  (Types/Client.dm:139)  may sleep
rt.def("/client/proc/Click", function* Click(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	(yield* g.callName(f, live(object), "Click", [live(location), live(control), live(params)]));
	return f.dot;
}, true);

// /client/proc/DblClick  (Types/Client.dm:142)  may sleep
rt.def("/client/proc/DblClick", function* DblClick(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	(yield* g.callName(f, live(object), "DblClick", [live(location), live(control), live(params)]));
	return f.dot;
}, true);

// /client/proc/MouseDown  (Types/Client.dm:146)
rt.def("/client/proc/MouseDown", function MouseDown(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.callName(f, live(object), "MouseDown", [live(location), live(control), live(params)]);
	return f.dot;
});

// /client/proc/MouseDrag  (Types/Client.dm:150)
rt.def("/client/proc/MouseDrag", function MouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	rt.callName(f, live(src_object), "MouseDrag", [live(over_object), live(src_location), live(over_location), live(src_control), live(over_control), live(params)]);
	return f.dot;
});

// /client/proc/MouseDrop  (Types/Client.dm:153)  may sleep
rt.def("/client/proc/MouseDrop", function* MouseDrop(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	f.vars = () => [src_object, over_object, src_location, over_location, src_control, over_control, params];
	(yield* g.callName(f, live(src_object), "MouseDrop", [live(over_object), live(src_location), live(over_location), live(src_control), live(over_control), live(params)]));
	return f.dot;
}, true);

// /client/proc/MouseEntered  (Types/Client.dm:157)  may sleep
rt.def("/client/proc/MouseEntered", function* MouseEntered(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	(yield* g.callName(f, live(object), "MouseEntered", [live(location), live(control), live(params)]));
	return f.dot;
}, true);

// /client/proc/MouseExited  (Types/Client.dm:161)  may sleep
rt.def("/client/proc/MouseExited", function* MouseExited(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	(yield* g.callName(f, live(object), "MouseExited", [live(location), live(control), live(params)]));
	return f.dot;
}, true);

// /client/proc/MouseMove  (Types/Client.dm:165)
rt.def("/client/proc/MouseMove", function MouseMove(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.callName(f, live(object), "MouseMove", [live(location), live(control), live(params)]);
	return f.dot;
});

// /client/proc/MouseUp  (Types/Client.dm:169)
rt.def("/client/proc/MouseUp", function MouseUp(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.callName(f, live(object), "MouseUp", [live(location), live(control), live(params)]);
	return f.dot;
});

// /client/proc/MouseWheel  (Types/Client.dm:173)  may sleep
rt.def("/client/proc/MouseWheel", function* MouseWheel(f: Frame, object: Value, delta_x: Value, delta_y: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, delta_x, delta_y, location, control, params];
	(yield* g.callName(f, live(object), "MouseWheel", [live(delta_x), live(delta_y), live(location), live(control), live(params)]));
	return f.dot;
}, true);
}

// ---- Types/World.ts ----
{
// From Types/World.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs([]);

// /world/proc/SetupExternalRSC  empty
rt.def("/world/proc/SetupExternalRSC");

// /world/proc/GetCredits  (Types/World.dm:113)
rt.def("/world/proc/GetCredits", function GetCredits(f: Frame, player: Value) {
	return null;
});
}

// ---- Types/Exception.ts ----
{
// From Types/Exception.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs(["name","file","line"]);


// /exception/proc/New  (Types/Exception.dm:10)
rt.def("/exception/proc/New", function New(f: Frame, N: Value, F: Value, L: Value) {
	rt.setSrcVarI(f, $ic[0], live(N));
	rt.setSrcVarI(f, $ic[1], live(F));
	rt.setSrcVarI(f, $ic[2], live(L));
	return f.dot;
});
}

// ---- Types/Image.ts ----
{
// From Types/Image.dm (translated once from the DM; this file is now the source, edit it by hand).
const $ic = rt.fieldICs(["filters"]);


// /image/proc/<init>  (Types/Image.dm:17)
rt.def("/image/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSrcVarI(f, $ic[0], rt.list());
	return f.dot;
});
}
