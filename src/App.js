import React from "react";
import * as THREE from "three";
import "./App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import data from "./systemPosition.json";
import jump from "./systemJump.json";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

const scale = 0.0001;

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
      const ids = Object.keys(data);
      const position = [];
      ids.forEach((id) => {
        const [x, y, z] = data[id];
        position.push(x * scale, y * scale, z * scale);
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(position, 3)
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0xffffff) },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      });
      const point = new THREE.Points(geometry, material);

      scene.add(point);
    }
    {
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
      });

      const points = [];
      console.log(jump);
      jump.forEach(([source, target]) => {
        {
          const [x, y, z] = data[target];
          points.push(new THREE.Vector3(x * scale, y * scale, z * scale));
        }
        {
          const [x, y, z] = data[source];
          points.push(new THREE.Vector3(x * scale, y * scale, z * scale));
        }
      });
      points.push(new THREE.Vector3(-10, 0, 0));
      points.push(new THREE.Vector3(0, 10, 0));
      points.push(new THREE.Vector3(10, 0, 0));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.LineSegments(geometry, material);
      scene.add(line);
    }

    camera.position.z = 5;

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
