import { Dispatch, SetStateAction } from "react";

//helpers:

//makes vs code show the object type when using '&' to join 2 object types together instead of "Type1 & Type2"
type Merge<Obj> = {[Key in keyof Obj]: Obj[Key];};

declare global {
//react/next:

//set function from useState
type SetState<T> = Dispatch<SetStateAction<T>>;

//objects:

//simpler object type
type ObjectType<Key extends string | number | symbol, Val> = {[key in Key]: Val};

//union of all keys from an object
type ObjKeys<Obj extends object> = keyof Obj;

//union of all values from an object
type ObjValues<Obj extends object> = Obj[keyof Obj];

//include all key/value pairs that match the Keys type
type ObjIncludeKeys<Obj, Keys extends keyof Obj> = {[key in Keys]: Obj[keyof Obj]};

//omit all key/value pairs that match the Keys type
type ObjOmitKeys<Obj, Keys extends keyof Obj> = {[key in Exclude<keyof Obj, Keys>]: Obj[keyof Obj]};

//makes all key/value pairs optional
type ObjAllOptional<Obj> = {[key in keyof Obj]?: Obj[key]};

//makes key/value pairs optional if they match the Keys type
type ObjOptional<Obj, Keys extends keyof Obj> =  
  Merge<
    {
      [key in Exclude<keyof Obj, Keys>]: Obj[keyof Obj]
    } & {
      [key in keyof Obj]?: Obj[key]
    }
  >;

//function:

//return type of function
type Return<Func> = Func extends (...args: unknown[]) => infer Return ? Return : never;

//parameters of function as array
type Parameters<Func> = Func extends (...args: (infer Params)) => unknown ? Params : never;

}