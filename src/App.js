import React, { Suspense, useRef } from "react";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, Loader } from "@react-three/drei";

import { position, color, points } from "./DataTrans";

import Points from "./Components/Points";
import Lines from "./Components/Lines";

function MainFrame({ camera }) {
  useFrame(() => {
    // console.log(camera.current);
  });
  return null;
}

function App() {
  const camera = useRef();
  return [
    <Canvas>
      <Suspense
        fallback={
          <Loader
            dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`} // Text
            initialState={(active) => active} // Initial black out state
          />
        }
      >
        <MainFrame camera={camera} />
        <color attach="background" args={["#000000"]} />
        <PerspectiveCamera
          makeDefault
          name="Camera"
          ref={camera}
          position={[0, 30, 70]}
        />
        <Points position={position} color={color} />
        <Lines points={points} />
        <OrbitControls
          camera={camera.current}
          enablePan
          enableZoom
          enableRotate
        />
      </Suspense>
    </Canvas>,
  ];
}

export default App;
