import { Dispatch, SetStateAction } from "react";

/******************** TYPES **********************/
//helpers:

//makes vs code show the object type when using '&' to join 2 object types together instead of "Type1 & Type2"
type Merge<Obj> = {[Key in keyof Obj]: Obj[Key];};

//react/next:

//set function from useState
export type SetState<T> = Dispatch<SetStateAction<T>>;

//objects:

//simpler object type
export type Object<Key extends string | number | symbol, Val> = {[key in Key]: Val};

//union of all keys from an object
export type ObjKeys<Obj extends object> = keyof Obj;

//union of all values from an object
export type ObjValues<Obj extends object> = Obj[keyof Obj];

//include all key/value pairs that match the Keys type
export type ObjIncludeKeys<Obj, Keys extends keyof Obj> = {[key in Keys]: Obj[keyof Obj]};

//omit all key/value pairs that match the Keys type
export type ObjOmitKeys<Obj, Keys extends keyof Obj> = {[key in Exclude<keyof Obj, Keys>]: Obj[keyof Obj]};

//makes all key/value pairs optional
export type ObjAllOptional<Obj> = {[key in keyof Obj]?: Obj[key]};

//makes key/value pairs optional if they match the Keys type
export type ObjOptional<Obj, Keys extends keyof Obj> =  
  Merge<
    {
      [key in Exclude<keyof Obj, Keys>]: Obj[keyof Obj]
    } & {
      [key in keyof Obj]?: Obj[key]
    }
  >;

//function:

//return type of function
export type Return<Func> = Func extends (...args: any[]) => infer Return ? Return : never;

//parameters of function as array
export type Parameters<Func> = Func extends (...args: (infer Params)) => any ? Params : never;

/******************** Functions **********************/
export const iDiv = Math.floor;
