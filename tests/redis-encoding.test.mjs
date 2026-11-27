// Run with: npm test
// The encoding must match what the old Upstash client wrote and read, so data
// copied from that database reads back unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode, decodeHash } from "../lib/redis.js";

test("encode: strings and numbers are stored as they are, objects as JSON", () => {
  assert.equal(encode("hello"), "hello");
  assert.equal(encode('{"a":1}'), '{"a":1}');
  assert.equal(encode(42), "42");
  assert.equal(encode(true), "true");
  assert.equal(encode({ t: 1, disco: "lesco" }), '{"t":1,"disco":"lesco"}');
  assert.equal(encode(["a", 1]), '["a",1]');
});

test("decode: JSON comes back as values, other text as text", () => {
  assert.deepEqual(decode('{"t":1,"disco":"lesco"}'), { t: 1, disco: "lesco" });
  assert.equal(decode("20032"), 20032);
  assert.equal(decode("true"), true);
  assert.equal(decode("plain text"), "plain text");
  assert.equal(decode(null), null);
  assert.equal(decode(undefined), null);
});

test("decode: numbers whose text would change stay strings", () => {
  assert.equal(decode("007"), "007");
  assert.equal(decode("1e3"), "1e3");
  assert.equal(decode("12345678901234567890"), "12345678901234567890");
  assert.equal(decode("1.50"), "1.50");
});

test("decodeHash: parses each field, null for an empty or missing hash", () => {
  assert.deepEqual(decodeHash({ a: '{"x":1}', b: "5", c: "text" }), { a: { x: 1 }, b: 5, c: "text" });
  assert.equal(decodeHash({}), null);
  assert.equal(decodeHash(null), null);
});

test("round trip: what the app writes is what it reads", () => {
  for (const v of [{ slug: "a", content: "<p>x</p>" }, "text", 7, ["x", { y: 2 }]]) {
    assert.deepEqual(decode(encode(v)), v);
  }
});
