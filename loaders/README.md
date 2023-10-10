# Loaders

The following loaders are defined in this repository.

## CSV Loader

The CSV loader is a highly opinionated loader of CSV files.
For many uses, the standard [Sheets plugin](https://lume.land/plugins/sheets/) is worth a look.

### Using the CSV loader

```js
import csvLoader from 'oi_lume_utils/loaders/csv-loader.ts';

site.loadData(['.csv'], csvLoader);
```

Any `.csv` files in `_data` directories will now be loaded with the CSV loader.

### Data structure

Data is assumed to be columnar, i.e. all items in a column are of the same type.
On loading a CSV the loader will return data of the following format:

Key | Purpose
----|------------
`header` | 2D array of header names. Each level of the multi-row header is an array.
`names` | Header names, constructed by concatenating header rows per column
`data` | Tabular data, converted to best guess of data type
`rows` | Array of objects representing the rows of the data. Each row is an object with keys named per column, and the value being the value of the cell.
`columns` | Object with a property per column name. The value of the property is an array of the values in that column
`types` | Guessed data type for column, either 'float' and 'string'
`raw` | raw 2D array of data parsed from the file
`range` | Object of objects with min and max properties (undefined for string)
`colnum` | Object mapping names to column numbers

As an example, the following CSV

```
A,B,C
1,2,3
4,5,6
```

will be loaded as:

```js
{
  header: [['A'], ['B'], ['C']],
  names: ['A', 'B', 'C'],
  data: [[1, 2, 3], [4, 5, 6]],
  rows: [{A: 1, B: 2, C: 3}, {A: 4, B: 5, C: 6}],
  columns: {A: [1, 4], B: [2, 5], C: [3, 6]},
  types: ['float', 'float'],
  raw: [['A', 'B', 'C'], [1, 2, 3], [4, 5, 6]],
  range: {
    A: {max: 4, min: 1},
    B: {max: 5, min: 2},
    C: {max: 6, min: 3}
  },
  colnum: {A: 0, B: 1, C: 2}
}
```

By default, it is assumed that there is a single line header.
The loader will search for the string `---` at the start of a line and use anything prior to that as a header.
For a CSV like this:

```
A,B,C
a,b,c
---
<...data...>
```

The header and names properties will be set as follows:

```js
{
  header: [['A', 'B', 'C'], ['a', 'b', 'c']],
  names: ['A→a', 'B→b', 'C→c'],
  ...
}
```