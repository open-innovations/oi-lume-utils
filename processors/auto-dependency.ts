/**
 * Helper function to encapsulate the logic for creating a new element
 *
 * @param dependency
 * @param document
 * @returns
 */
export function createElement(dependency: string, document: any) {
  // If the dependency contains .css
  if (dependency.indexOf(".css") > 0) {
    // Create a new link element
    const newElement = document.createElement("link");
    // Set the src attribute
    newElement.setAttribute("href", dependency);
    newElement.setAttribute("rel", "stylesheet");
    // Return the element
    return newElement;
  }
  // Default action (note early returns above)
  // Create a new script element
  const newElement = document.createElement("script");
  // Set the src attribute
  newElement.setAttribute("src", dependency);
  // Return the element
  return newElement;
}

/**
 * auto-dependency
 *
 * Usage:
 *
 *   import autoDependency from '<this file>'
 *   site.process(['.html'], autoDependency)
 *
 * This will search a built dom tree for data-dependencies attributes and add a script element for each.
 */
export default function (page: any) {
  // Search for all elements on page with a data-dependencies attribute and turn into an Array
  const elementsWithDependencies = Array.from(
    page.document.querySelectorAll("[data-dependencies]"),
  );
  // If none found, finish processing
  if (elementsWithDependencies.length === 0) return;

  // For each element in the list,
  // get data-dependencies attribute,
  //   split the string each list (to allow for multiple dependencies)
  //   and trim whitespace
  // then flatten the list (un-nest lists)
  const fullDependencyList = elementsWithDependencies
    .map((element: any) =>
      element
        .getAttribute("data-dependencies")
        .split(",")
        .map((dependency: string) => dependency.trim())
    )
    .flat();

  // Finally deduplicate by creating a Set, then converting to an Array.
  // A Set has the property that values are stored only once.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  const deduplicatedDependencies = Array.from(new Set(fullDependencyList));

  // For each deduplicated depdency
  deduplicatedDependencies.forEach((dependency) => {
    // Create the new element by calling createElement
    const newElement = createElement(dependency, page.document);
    // And set a data-auto-depdendency attribute
    newElement.setAttribute("data-auto-dependency", true);
    // Then append to the document head
    page.document.head.appendChild(newElement);
  });
}
