import { assertEquals } from 'std/assert/mod.ts';
import {
  assertSpyCall,
  resolvesNext,
  stub,
} from 'std/testing/mock.ts';
import csvLoader, { isNumeric } from './csv-loader.ts';

Deno.test('url test', async () => {
  const fakeReadTextFile = stub(
    Deno,
    'readTextFile',
    resolvesNext(['a,b\n1,2\n3,4'])
  );
  let result;
  try {
    result = await csvLoader('FAKE_PATH');
  } finally {
    fakeReadTextFile.restore();
  }

  assertSpyCall(fakeReadTextFile, 0, {
    args: ['FAKE_PATH'],
  });

  assertEquals(result.header, [['a', 'b']]);
  assertEquals(result.names, ['a', 'b']);
  assertEquals(result.data, [
    [1, 2],
    [3, 4],
  ]);
  assertEquals(result.rows, [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ]);
  assertEquals(result.columns, {
    a: [1, 3],
    b: [2, 4],
  });
});

Deno.test('handle multi-line headers', async () => {
  const fakeReadTextFile = stub(
    Deno,
    'readTextFile',
    resolvesNext(['a,b\nc,d\n---\n1,2\n3,4'])
  );
  let result;
  try {
    result = await csvLoader('FAKE_PATH');
  } finally {
    fakeReadTextFile.restore();
  }

  assertEquals(result.header, [['a', 'b'], ['c', 'd']])
  assertEquals(result.names, ['a→c', 'b→d']);
  assertEquals(result.data, [[1, 2], [3, 4]])
})

Deno.test('default header length to 1', async () => {
  const fakeReadTextFile = stub(
    Deno,
    'readTextFile',
    resolvesNext(['a,b\nc,d\ne,f\ng,h'])
  );
  let result;
  try {
    result = await csvLoader('FAKE_PATH');
  } finally {
    fakeReadTextFile.restore();
  }

  assertEquals(result.header, [['a', 'b']]);
  assertEquals(result.names, ['a', 'b']);
  assertEquals(result.data, [['c', 'd'], ['e', 'f'], ['g', 'h']]);
})

Deno.test('clip to width of first line', async () => {
  const fakeReadTextFile = stub(
    Deno,
    'readTextFile',
    resolvesNext(['a,b\n1,2,3\n2,2\n3,2,3,4'])
  );
  let result;
  try {
    result = await csvLoader('FAKE_PATH');
  } finally {
    fakeReadTextFile.restore();
  }

  assertEquals(result.header, [['a', 'b']]);
  assertEquals(result.data, [[1, 2], [2, 2], [3, 2]]);
})

Deno.test('rejects empty strings', async () => {
  const fakeReadTextFile = stub(
    Deno,
    'readTextFile',
    resolvesNext(['a,b\n1,2\n2,'])
  );
  let result;
  try {
    result = await csvLoader('FAKE_PATH');
  } finally {
    fakeReadTextFile.restore();
  }

  assertEquals(result.header, [['a', 'b']]);
  assertEquals(result.data, [
    [1, 2],
    [2, NaN]]);
})

Deno.test('isNumeric', async (t) => {
  const numeric = [
    12, 12.0, 12.2, "10", "10.0", "10.2", 1e3, "1e3"
  ];
  for (const value of numeric) {
    await t.step(`${JSON.stringify(value)} is numeric`, () => assertEquals(isNumeric(value), true));
  }
  const nonNumeric = [
    "2022/23",
  ];
  for (const value of nonNumeric) {
    await t.step(`${JSON.stringify(value)} is non numeric`, () => assertEquals(isNumeric(value), false));
  }
})