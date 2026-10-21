// js-names.mjs - Turns a game proc's JS parameter name back into its DM argument name (undoes the old translator's `_` prefix).
// The translator (src/translate/translate.ts, ident()) prefixed `_` to a DM name that is a JS reserved word or one of
// the names a translated proc uses itself (f, rt, T, P, ...). Used by tools/translate-tg.mjs (rt.def argument names) and
// tools/proc-meta-write.mjs. A DM name the rule gets wrong is written out in the rt.def's meta.args instead.
export const RESERVED = new Set(("break case catch class const continue debugger default delete do else enum export extends false finally for function if import in " +
	"instanceof new null return super switch this throw true try typeof var void while with yield let static implements interface package private " +
	"protected public await arguments eval undefined NaN Infinity f rt T P g live truthy isEqual add subtract multiply divide fmt Frame Value").split(" "));

export const dmName = (js) => (js.startsWith("_") && (RESERVED.has(js.slice(1)) || js.startsWith("_$")) ? js.slice(1) : js);
