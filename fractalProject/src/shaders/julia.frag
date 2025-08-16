uniform vec3 iResolution;
uniform vec2 mouseDelta;
uniform float zoomMultiplier;
uniform vec2 mousePos;
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
    vec2 z = 4.0 * uv - 2.0;
    z = z / zoomMultiplier;
    z = z - mouseDelta;
    vec2 c;
    c.x = mousePos.x;
    c.y = mousePos.y;

    vec4 color = vec4(51.0/255.0, 102.0/255.0, 153.0/255.0, 1.0);
    vec4 purple = vec4(0.0/255.0, 0.0/255.0, 0.0/255.0, 1.0);
    //vec2 z = vec2(0.0, 0.0);

    for(int i = 0; i< 200; i++)
    {
        z = addComplex( squareComplex(z), c);
        if(magnitude(z) > 2.0)
        {
            float r = (float(i*i) / (255.0 * 255.0));
            float g = (float(i) / 255.0);
            float b = purple.b;
            color = vec4(r,g,b, 1.0);
            break;
        }
    }
    gl_FragColor = color;
}


