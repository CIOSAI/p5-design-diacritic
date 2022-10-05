#ifdef GL_ES
precision mediump float;
#endif

#define layer 3.
#define PI acos(-1.)
#define amp 0.14
#define amt 12.

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 col1;
uniform vec3 col2;

/*https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83*/
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(in vec3 p){
  float sum = 0.;

  for(float i=0.; i<layer; i++){
    sum += noise(p*(1.+pow(2., i)))/pow(3., i);
  }

  return sum;
}
/*------------------------------------------------------------*/

void main()
{
    vec4 col_1 = vec4(col1, 1.);
    vec4 col_2 = vec4(col2, 1.);

    vec2 uv = gl_FragCoord.xy/u_resolution;
    uv -= 1.;
    uv.x *= u_resolution.x/u_resolution.y;

    float t = u_time + .5*sin(u_time); t*=0.1;

    /* TILT 45 DEGREES */
    uv *= mat2(
      cos(PI*3./4.), -sin(PI*3./4.),
      sin(PI*3./4.), cos(PI*3./4.)
    );

    /* PUSH A BIT TOWARD TOP LEFT */
    uv.y += 0.3;

    /* DISTORTION */

    float a = fbm(vec3(uv.x, uv.y-t*10., -999.)/4.)*6.*PI;
		float ext = fbm(vec3(uv.x, uv.y-t*10., 2999.)/4.);

    uv += vec2(cos(a), sin(a))*ext*amp;

    vec4 col = vec4(0.);

    for(float i=0.; i<amt; i++){
      float pos = fbm(vec3(i*999., t, 66999.))*2.-1.;
      float thicc = fbm(vec3(i*999., t, 99999.))*0.2;
      float reach = fbm(vec3(i*999., t, 23999.)); 
      reach = 1.+pow(abs(pos*sqrt(2.)), 2.)-reach;
      float linear = sqrt(2.)-uv.y-reach;

      float within = step(
        abs(uv.x+pos)/thicc, 
        linear
      );
      col = mix(
        col, 
        mix(
          col_2,
          col_1,
          pow(1.-linear/3., .3)*i/amt
        ), 
        within
      );
    }

    gl_FragColor = col;
}