# oi-lume-utils

[![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Foi_lume_utils)](https://deno.land/x/oi_lume_utils)
![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fx%2Foi_lume_utils/deps.ts)
![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fupdates%2Fx%2Foi_lume_utils%2Fmod.ts)

This is a small collection of utilities for the [Lume static site generator](https://lume.land).

## Getting started

The library is published at https://deno.land/x/oi_lume_utils.

There is no top-level module, instead you should import the functions direct from the
underlying module files. Generally, the main function is exported as the default, so you should be able to import as a name that suits you.

As an example, to import the CSV loader from v0.3.1 of the library,
use the following import.

```ts
import c from "https://deno.land/x/oi_lume_utils@v0.3.1/loaders/csv-loader.ts";

site.loader(['.csv'], c);
```

For detailed usage instructions, refer to the README files located closest to the
functions.

In the detailed examples, the import path is truncated for brevity.
The examples can be rendered correct by setting the 
`oi_lume_charts` key appropriately in a [Deno import map](https://docs.deno.com/runtime/manual/basics/import_maps).

## Loaders

Lume [loaders](https://lume.land/docs/core/loaders/) allow new file types to be loaded as data or pages. See the [loaders README](./loaders/README.md) for more details of the loaders in this repository.

## Processors

Lume [processors](https://lume.land/docs/core/processors/) allow transformation of page content after the page is rendered. See the [processors README](./processors/README.md) for more details of the processors in this repository.

