#version 120

uniform vec3 iResolution;
uniform vec2 mouseDelta;
uniform float zoomMultiplier;
vec2 squareComplex(vec2 z)
{
    vec2 zSquared;
    zSquared.x = (z.x * z.x) - (z.y * z.y);
    zSquared.y = 2.0 * z.x * z.y;
    return zSquared;
}
vec2 addComplex(vec2 z, vec2 c)
{
    vec2 zAdded;
    zAdded.x = z.x + c.x;
    zAdded.y = z.y + c.y;
    return zAdded;
}
float magnitude(vec2 z)
{
    return sqrt((z.x * z.x) + (z.y * z.y));
}

void main()
{
    vec2 uv = gl_FragCoord.xy /iResolution.xy;
    vec2 c = 4.0 * uv - 2.0;
    c = c / zoomMultiplier;
    c = c - mouseDelta;


    vec4 color = vec4(52.0/255.0, 204.0/235.0, 235.0/255.0, 1.0);

    vec2 z = vec2(0.0, 0.0);

    for(int i = 0; i< 200; i++)
    {
        z = addComplex( squareComplex(z), c);
        if(magnitude(z) > 2.0)
        {
            color = vec4(float(i)/200.0, float(i)/200.0, 0.0, 1.0);
            break;
        }
    }
    gl_FragColor = color;
}


