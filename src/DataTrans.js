import * as THREE from "three";
import * as d3 from "d3";
import _ from "lodash";

import data from "./Static/systemPosition.json";
import jump from "./Static/systemJump.json";
import regions from "./Static/regions.json";
import parent from "./Static/systemParent.json";

const regionScale = d3
  .scaleQuantize()
  .range(regions.map((_, index) => index / (regions.length - 1)))
  .domain(regions);

const scale = 0.0001;
const jumpIds = _.flattenDeep(jump);
const ids = _.intersection(Object.keys(data), jumpIds);

const position = [];
const color = [];
ids.forEach((id, index) => {
  const [x, y, z] = data[id];
  position.push(x * scale, y * scale, -z * scale);
  new THREE.Color(d3.interpolateRainbow(regionScale(parent[id][1]))).toArray(
    color,
    index * 3
  );
});

const points = [];
jump.forEach(([source, target]) => {
  {
    const [x, y, z] = data[target];
    points.push(new THREE.Vector3(x * scale, y * scale, -z * scale));
  }
  {
    const [x, y, z] = data[source];
    points.push(new THREE.Vector3(x * scale, y * scale, -z * scale));
  }
});

const result = { position, color, points };
export default result;
export { position, color, points };
