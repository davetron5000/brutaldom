import TypeOf from "TypeOf"

import { Passed, Failed, assert, assertEqual, suite } from "./shared"

class SomeClass {
}

suite("TypeOf", { "constructor": "handles all types of types" },({test}) => {
  test("undefined", () => {
    const typeOf = new TypeOf(undefined)
    return assertEqual("undefined",typeOf.toString())
  })
  test("null", () => {
    const typeOf = new TypeOf(null)
    return assertEqual("null",typeOf.toString())
  })
  test("Boolean", () => {
    const typeOf = new TypeOf(true)
    return assertEqual("Boolean",typeOf.toString())
  })
  test("Number", () => {
    const typeOf = new TypeOf(123)
    return assertEqual("Number",typeOf.toString())
  })
  test("BigInt", () => {
    const typeOf = new TypeOf(BigInt(9007199254740991))
    return assertEqual("BigInt",typeOf.toString())
  })
  test("String", () => {
    const typeOf = new TypeOf("foobar")
    return assertEqual("String",typeOf.toString())
  })
  test("Symbol", () => {
    const typeOf = new TypeOf(Symbol.for("foobar"))
    return assertEqual("Symbol",typeOf.toString())
  })
  test("Function", () => {
    const typeOf = new TypeOf(() => { "foo" })
    return assertEqual("Function",typeOf.toString())
  })
  test("Object w/out a class", () => {
    const typeOf = new TypeOf({ foo: "bar" })
    return assertEqual("Object",typeOf.toString())
  })
  test("Array", () => {
    const typeOf = new TypeOf([1,2,3])
    return assertEqual("Array",typeOf.toString())
  })
  test("Object from a class", () => {
    const typeOf = new TypeOf(new SomeClass())
    return assertEqual("SomeClass",typeOf.toString())
  })
})
suite("TypeOf", { "asString": "calls through" },({test}) => {
  test("undefined", () => assertEqual("undefined",TypeOf.asString(undefined)))
  test("undefined", () => assertEqual("String",TypeOf.asString("some string")))
  test("undefined", () => assertEqual("SomeClass",TypeOf.asString(new SomeClass())))
})
