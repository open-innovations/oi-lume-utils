# Processors

## auto-dependency

Adds script headers to generated pages based on the inclusion of `data-dependencies` attributes. Each dependency is only included once.

### Using the auto-dependency processor

To configure this processor, add the following to `_config.js` (or `_config.ts`, if you're that way inclined).

```js
import autoDependency from 'oi-lume-utils/processors/auto-dependency.ts';

site.process(['.html'], autoDependency)
```

**IMPORTANT** Make sure that the [`base_path` plugin](https://lume.land/plugins/base_path/),
processor is loaded after this one to make sure that any local absolute script URLs
are properly transformed.


### Registering auto dependencies

Annotations such as this:

```html
<div data-dependencies='/js/optional-script.js'>...</div>
```

Will result in the following being added to the head

```html
<script src='/js/optional-script.js' data-auto-dependency=true></script>
```

You can specify multiple dependencies

```html
<div data-dependencies='/js/optional-script.js, /js/another-script.js'>...</div>
```

### Recognised dependency types

The processor recognises `js` and `css` files at the moment.

By default, it assumes that the file is a script file, and will add a script tag as follows:

```html
<script src="__dependency path__" data-auto-dependency="true"></script>
```

if the dependency ends with `.css` it will instead add a stylesheet link tag.

```html
<link href="__dependency path__" rel="stylesheet" data-auto-dependency="true"></link>
```