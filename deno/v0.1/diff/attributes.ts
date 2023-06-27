//

// add property injections to added indnexes

function addProperties<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (const sourceIndex of delta.addedIndexes) {
    const source = render.sources[sourceIndex];
    if (!(source instanceof SourceLink)) continue;

    const draw = render.draws[source.drawIndex];
    const build = render.builds[source.buildIndex];

    for (const injection of build.injections) {
      const { index, node } = injection;
      const propertyMap = draw.injections[index];

      if (propertyMap instanceof Map || typeof proeprtyMap === "object") {
        for (const [name, value] of Object.entries(propertyMap)) {
          utils.setAttribute(node, name, value);
        }
      }
    }
  }
}

function removeAttributes<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  delta: DeltaTargets,
) {
  for (const sourceIndex of delta.removedIndexes) {
    const source = render.sources[sourceIndex];
    if (source instanceof SourceLink) {
      const draw = render.draws[source.drawIndex];
      const build = render.builds[source.buildIndex];

      for (const injection of build.injections) {
        const { index, node } = injection;
        const propertyMap = draw.injections[index];

        if (propertyMap instanceof Map || typeof proeprtyMap === "object") {
          for (const [name, value] of Object.entries(propertyMap)) {
            utils.removeAttribute(node, name, value);
          }
        }
      }
    }
  }
}

function updateAttributes<N>(
  utils: UtilsInterface<N>,
  render: Render<N>,
  prevRender: Render<N>,
  delta: DeltaTargets,
) {
  for (const sourceIndex of delta.survivedIndexes) {
    const source = render.sources[sourceIndex];
    const prevSource = prevRender.sources[sourceIndex];

    if (source instanceof SourceLink && prevSource instanceof SourceLink) {
      const draw = render.draws[source.drawIndex];
      const build = render.builds[source.buildIndex];

      const prevDraw = prevRender.draws[prevSource.drawIndex];

      for (const injection of build.injections) {
        const { index, node } = injection;
        const propertyMap = draw.injections[index];

        const prevPropertyMap = prevDraw.injections[index];

        if (
          (propertyMap instanceof Map || typeof propertyMap === "object") &&
          (prevPropertyMap instanceof Map ||
            typeof prevPropertyMap === "object")
        ) {
          // remove old properties
          for (const [name, value] in Object.entries(prevPropertymap)) {
            // if not in new properties, remove property
            if (propertyMap[name] === undefined) {
              utils.removeAttribute(node, name, value);
            }
          }

          for (const [name, value] of Object.entries(propertyMap)) {
            const prevValue = prevPropertyMap[name];
            utils.setAttribute(node, name, value, prevValue);
          }
        }
      }
    }
  }
}
