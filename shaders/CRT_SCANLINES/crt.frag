#version 300 es
precision mediump float;

in vec2 vTexCoord;
out vec4 FragColor;

uniform sampler2D tex;
uniform float time;
uniform float curvature;
uniform float vignette;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 curve(vec2 uv, float curv) {
    uv -= 0.5;
    uv *= 1.05;

    uv.x *= 1.0 + pow(abs(uv.y) * curv, 2.0);
    uv.y *= 1.0 + pow(abs(uv.x) * curv * 0.6, 2.0);

    uv += 0.5;

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)
        return vec2(-1.0);

    return uv;
}

float scanlines(vec2 uv) {
    float y = uv.y * 720.0;
    float s = sin(y * 3.14159);
    return mix(0.75, 1.0, s);
}

vec3 shadowMask() {
    float triadSize = 1.0;
    float x = floor(gl_FragCoord.x / triadSize);
    float phase = mod(x, 3.0);

    vec3 mask = vec3(0.0);
    if (phase == 0.0) mask.r = 1.0;
    if (phase == 1.0) mask.g = 1.0;
    if (phase == 2.0) mask.b = 1.0;

    return mix(vec3(1.0), mask, 0.35);
}

void main() {
    vec2 uv = vTexCoord;

    vec2 cuv = curve(uv, curvature);
    if (cuv.x < 0.0) {
        FragColor = vec4(0.0);
        return;
    }

    vec3 col = texture(tex, cuv).rgb;

    vec3 blur = texture(tex, cuv + vec2(1.0 / 1280.0, 0.0)).rgb;
    col = mix(col, blur, 0.15);

    col *= scanlines(cuv);
    col *= shadowMask();

    float flicker = 1.0
    + 0.015 * sin(time * 60.0)
    + 0.010 * sin(time * 23.0);
    col *= flicker;

    col += (rand(cuv + time) - 0.5) * 0.01;

    float vig = 16.0 * cuv.x * cuv.y * (1.0 - cuv.x) * (1.0 - cuv.y);
    vig = pow(vig, 0.4);
    col *= mix(1.0, vig, vignette);

    FragColor = vec4(col, 1.0);
}
