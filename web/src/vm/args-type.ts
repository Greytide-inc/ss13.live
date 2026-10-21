// How a call's arguments were written (the one part of the old bytecode opcode set left; translated code passes
// these numbers as rt.Args.* and in the operands of rt.op("Rgb"/"Animate")).
export enum ArgsType {
	/** `f()` with no args */
	None = 0,
	/** `f(a, b)`: positional */
	FromStack = 1,
	/** `f(a, name = b)`: [name or null, value] pairs */
	FromStackKeyed = 2,
	/** `f(arglist(L))` */
	FromArgumentList = 3,
	/** `..()` with no args: the caller's own */
	FromProcArguments = 4,
}
