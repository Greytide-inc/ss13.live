// The program's shape (typedefs.gameProgram builds it from the game files): originally the JSON OpenDream's DMCompiler
// wrote, whose field names it keeps. Absent optional fields mean "default" (0, null, empty).

/** see CompiledJson.GlobalInitSetup (types kept loose: json.ts imports nothing). */
export type GlobalInitSetup = (vm: unknown, proc: unknown) => void;

export interface CompiledJson {
	Strings: string[];
	GlobalProcs?: number[];
	Globals?: { GlobalCount: number; Names: string[]; Globals: { [index: string]: JsonValue } };
	/** the global init as TypeScript (game/_globals.ts, via runtime.globalInit): makes the init proc run it on VM `vm`. */
	GlobalInitSetup?: GlobalInitSetup;
	Maps?: unknown[];
	/** the .dmm files to load as the compile-time maps, in z order (web/game/_maps.ts); replaces Maps. */
	MapFiles?: string[];
	Interface?: string;
	Types: TypeJson[];
	OptionalErrors?: { [name: string]: number };
	/** each proc's facts from the game files' rt.def statements (typedefs.gameProgram); proc id = position. */
	ProcDecls: ProcDecl[];
}

/**
 * the 4th argument of a game file's rt.def(path, fn, gen, meta), for the facts the path and the function's
 * parameters don't give. Only the keys that apply are written.
 */
export interface ProcMeta {
	/** The DM argument names, when the function's parameters aren't them (it reads `args`, or has no body). */
	args?: string[];
	/** `set waitfor = 0`. */
	waitfor?: false;
	/** `set hidden = 1`. */
	hidden?: true;
	/** `set popup_menu = 0`. */
	hidePopup?: true;
	/** The `set name/category/desc/src/invisibility` of a verb (or of a proc made a verb at runtime). */
	verb?: { name?: string; category?: string; desc?: string; src?: number; range?: number; invisibility?: number };
	/** The DM argument types (`mob/M as mob|obj in view()`) of a proc that can be a verb, one per argument. */
	argTypes?: { type?: number; path?: string; source?: string }[];
}
/** one rt.def statement as build/game-types.js declares it (typedefs.procDecls). */
export interface ProcDecl {
	path: string;
	/** The DM argument names (meta.args, else the function's parameters with the translator's `_` prefix undone). */
	args: string[];
	/** False for an rt.def with no function (a BYOND built-in, or an empty proc). */
	body: boolean;
	meta: ProcMeta | null;
}

export interface TypeJson {
	Path: string;
	Parent?: number;
	InitProc?: number;
	/** Each inner list is one proc name's definitions on this type, in override order. */
	Procs?: number[][];
	/** Names of the verbs this type declares (DMCompiler writes a set of names). */
	Verbs?: string[];
	Variables?: { [name: string]: JsonValue };
	GlobalVariables?: { [name: string]: number };
	ConstVariables?: string[];
	TmpVariables?: string[];
}

/** One argument of a proc: its name and DM type (Type/TypePath/Source), for parsing it as a verb's command line. */
export interface ProcArg {
	Name: string;
	Type?: number;
	Source?: string;
	TypePath?: string;
}

/** JsonVariableType in DreamObjectJson.cs */
export const enum JsonVarType {
	Resource = 0,
	Type = 1,
	Proc = 2,
	List = 3,
	PositiveInfinity = 4,
	NegativeInfinity = 5,
	AList = 6,
}

export type JsonValue =
	| null
	| number
	| string
	| { type: JsonVarType.Resource; resourcePath: string }
	| { type: JsonVarType.Type | JsonVarType.Proc; value: number }
	| { type: JsonVarType.List | JsonVarType.AList; values: (JsonValue | { key: JsonValue; value: JsonValue })[] }
	| { type: JsonVarType.PositiveInfinity | JsonVarType.NegativeInfinity };

/** ProcAttributes (DMCompiler/DM/ProcAttributes.cs) */
export const ProcAttr = {
	None: 1 << 0,
	IsOverride: 1 << 1,
	Unimplemented: 1 << 2,
	Hidden: 1 << 3,
	HidePopupMenu: 1 << 4,
	DisableWaitfor: 1 << 5,
	Instant: 1 << 6,
	Background: 1 << 7,
} as const;
