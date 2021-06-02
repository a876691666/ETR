attribute vec3 color;
attribute float scale;

varying vec3 vColor;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.0 * 100.0 / -mvPosition.z, 3.0);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
}