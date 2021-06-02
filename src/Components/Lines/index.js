import React from "react";

export default function Points(props) {
  let { points } = props;
  return (
    <lineSegments>
      <bufferGeometry
        attach="geometry"
        ref={(geo) => geo?.setFromPoints?.(points)}
      ></bufferGeometry>
      <lineBasicMaterial attach="material" color={0xffffff} />
    </lineSegments>
  );
}
