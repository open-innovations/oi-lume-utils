# oi-lume-utils

> Useful utilities for the Lume SSG

[![](https://data.jsdelivr.com/v1/package/gh/open-innovations/oi-lume-utils/badge)](https://www.jsdelivr.com/package/gh/open-innovations/oi-lume-utils)

## processors

This library includes a series of processors for use in Lume.

### auto-dependency

Adds script headers to generated pages based on the inclusion of `data-dependencies` attributes. Each dependency is only included once.

Annotations such as this:

```html
<div data-dependencies='/js/optional-script.js'>...</div>
```

or to specify multiple dependencies

```html
<div data-dependencies='/js/optional-script.js, /js/another-script.js'>...</div>
```

Will result in the following being added to the head

```html
<script src='/js/optional-script.js' data-auto-dependency=true></script>
```

To configure this procesor, add the following to `_config.js` (or `_config.ts`, if you're that way inclined).

```js
import autoDependency from 'https://cdn.jsdelivr.net/gh/open-innovations/oi-lume-utils@<version>/processors/auto-dependency.ts';

site.process(['.html'], autoDependency)
```

NB - if you are using the [`base_path` plugin](https://lume.land/plugins/base_path/), make sure that is loaded after this processor,
or any script URLs are 