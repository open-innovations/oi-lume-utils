import { parse } from 'std/encoding/csv.ts';
import { transpose, range, ensureFloat } from '../util/mod.ts';

const FLOAT = 'float';
const STRING = 'string';
const HEADER_SEPARATOR = '---';

function guessType(value: string) {
  if (['', undefined].includes(value)) return null;

  // Don't include things that parse as numbers but which also contain other things e.g. "2002/03"
  if (isFinite(parseFloat(value)) && parseFloat(value).toString() === value) {
    return FLOAT;
  }

  // Default to a string
  return STRING;
}

function typePrecedence(types: (string | null)[]) {
  // TODO Put in heuristic
  if (types.includes(STRING)) return STRING;
  if (types.includes(FLOAT)) return FLOAT;
  return STRING;
}

function typeConvert(value: string, type: string): string | number {
  if (type === FLOAT) return parseFloat(value);
  return value;
}

export default async function csvLoader(path: string) {
  const text = await Deno.readTextFile(path);
  let raw = await (<Promise<string[][]>>parse(text));

  const width = raw[0].length;

  raw = raw.map((x) => x.slice(0, width));

  const separatorRow = raw.findIndex((x) => x[0] === HEADER_SEPARATOR);
  if (separatorRow > 0) raw.splice(separatorRow, 1);

  const headerRowCount = separatorRow > 1 ? separatorRow : 1;

  // Grab the header
  const header = raw.slice(0, headerRowCount);
  // Construct the column names by concatenating columns
  // Error: this will also join empty column headers
  //const names: string[] = transpose(header).map((r: string[]) => r.join('→'));
  const names: string[] = new Array(header[0].length);
  for(let j = 0; j < names.length; j++){
    names[j] = "";
    for(let i = 0; i < header.length; i++) names[j] += (names[j] && header[i][j] ? '→':'')+header[i][j];
  }

  // Grab the data
  const stringData = raw.slice(headerRowCount);

  // Calculate types for all cells
  const types = transpose(stringData.map((rows) => rows.map(guessType))).map(
    typePrecedence
  );

  // Convert the data
  const data = stringData.map((row) =>
    row.map((column, i) => typeConvert(column, types[i]))
  );

  // Construct a list of objects as key / value pairs
  const rows = data.map((row) =>
    names.reduce(
      (a, k, i) => ({
        ...a,
        [k]: row[i],
      }),
      {}
    )
  );

  // Create an object with a property per column name.
  // The value of the key will be a 1 dimensional array of the values in that column.
  const columns = names.reduce(
    function (accumulator: Record<string, (string|number)[]>, name, n) {
      // Add a property to the object
      // Set the value to the n-th column from the data array (defined in containing function)
      accumulator[name] = data.map((row) => row[n]);

      // Return the accumulator
      return accumulator;
    },
    {}
  );
  
  const colnum: Record<string, number> = {};
  for(let j = 0; j < names.length; j++) colnum[names[j]] = j;

  const ranges = Object.entries(columns).reduce(
    (accumulator: Record<string, { min: number, max: number } | undefined>, current, index) => {
      const key = current[0];
      const values = current[1];
      accumulator[key] = types[index] === FLOAT ? range(values.map(ensureFloat)) : undefined;
      return accumulator;
    },
    {}
  );

  return { header, names, data, rows, columns, types, raw, range: ranges, colnum };
}
