import React from "react";
import * as THREE from "three";
import * as d3 from "d3";
import _ from "lodash";
import "./App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import data from "./systemPosition.json";
import jump from "./systemJump.json";
import regions from "./regions.json";
import parent from "./systemParent.json";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

const regionScale = d3
  .scaleQuantize()
  .range(regions.map((_, index) => index / (regions.length - 1)))
  .domain(regions);

const scale = 0.0001;
const jumpIds = _.flattenDeep(jump);
const ids = _.intersection(Object.keys(data), jumpIds);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.getRef = this.getRef.bind(this);
  }

  render() {
    return <div className="App" ref={(box) => (this.box = box)}></div>;
  }

  componentDidMount() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const control = new OrbitControls(camera, renderer.domElement);

    {
      const position = [];
      const colors = [];
      ids.forEach((id, index) => {
        const [x, y, z] = data[id];
        position.push(x * scale, y * scale, -z * scale);
        new THREE.Color(
          d3.interpolateRainbow(regionScale(parent[id][1]))
        ).toArray(colors, index * 3);
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(position, 3)
      );

      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
      });
      const point = new THREE.Points(geometry, material);

      scene.add(point);
    }
    {
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
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

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.LineSegments(geometry, material);
      scene.add(line);
    }

    camera.position.y = 40;
    camera.position.z = 70;

    this.box.appendChild(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      control.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  getRef(box) {
    this.box = box;
  }
}

export default App;
