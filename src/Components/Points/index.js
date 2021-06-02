import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export default function Points(props) {
  let { position, color } = props;
  position = new Float32Array(position);
  color = new Float32Array(color);
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={position.length / 3}
          array={position}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "color"]}
          count={color.length / 3}
          array={color}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </points>
  );
}
