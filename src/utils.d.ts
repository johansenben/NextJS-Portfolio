import { Dispatch, SetStateAction } from "react";

//helpers:

//makes vs code show the object type when using '&' to join 2 object types together instead of "Type1 & Type2"
type Merge<Obj> = { [Key in keyof Obj]: Obj[Key] };

declare global {
  //react/next:

  //set function from useState
  type SetState<T> = Dispatch<SetStateAction<T>>;

  //objects:

  //simpler object type - Record
  // type ObjectType<Key extends string | number | symbol, Val> = {
  //   [key in Key]: Val;
  // };

  //union of all keys from an object
  // type ObjKeys<Obj extends object> = keyof Obj;

  //union of all values from an object
  type ObjValues<Obj extends object> = Obj[keyof Obj];

  //include all key/value pairs that match the Keys type - Pick
  // type ObjIncludeKeys<Obj, Keys extends keyof Obj> = {
  //   [K in Keys]: Obj[K];
  // };

  //omit all key/value pairs that match the Keys type - Omit
  // type ObjOmitKeys<Obj, Keys extends keyof Obj> = {
  //   [Key in Exclude<keyof Obj, Keys>]: Obj[Key];
  // };

  //makes all key/value pairs optional - Partial
  // type ObjAllOptional<Obj> = { [key in keyof Obj]?: Obj[key] };

  //makes key/value pairs optional if they match the Keys type
  type ObjOptional<Obj, Keys extends keyof Obj> = Merge<
    {
      [key in Exclude<keyof Obj, Keys>]: Obj[keyof Obj];
    } & {
      [key in keyof Obj]?: Obj[key];
    }
  >;

  //function:

  //return type of function - ReturnType
  // type Return<Func> = Func extends (...args: unknown[]) => infer Return
  //   ? Return
  //   : never;

  //parameters of function as array - Parameters
  // type Parameters<Func> = Func extends (...args: infer Params) => unknown
  //   ? Params
  //   : never;
}

// type a = "123" | "abc";
// type b = "456" | "def";

// type HyphenatedString = `${a}-${b}`;
// function doSomething(input: HyphenatedString) {
//   console.log(input);
// }
// doSomething("abc-456")

// type word1 = "background" | "text" | "border"
// type word2 = "red" | "blue" | "green"
// type word3 = "100" | "200" | "300"

// type T = `${word1}-${word2}-${word3}` | (string & {});

// function x(y: T){

// }
