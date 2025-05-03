# Math Syntax Comparison Across Software



## table

| Operation  | Mathematica | SageMath | Maxima | Scilab | GNU Octave | Maple |
| --- | --- | --- | --- | --- | --- | --- |
| $\int x^2 \, dx$ | `Integrate[x^2, x]` | `integrate(x^2, x)` | `integrate(x^2, x)` | Not built-in (symbolic) | `int(sym('x^2'), x)` (symbolic package) | `int(x^2, x)` |
| $\int_0^1 x^2 \, dx$ | `Integrate[x^2, {x, 0, 1}]` | `integrate(x^2, (x, 0, 1))` | `integrate(x^2, x, 0, 1)` | `integrate('x^2', 'x', 0, 1)` (numerical) | `int(sym('x^2'), [0, 1])` | `int(x^2, 0..1)` |
| Solve $x + 2 = 3$ for $x$ | `Solve[x + 2 == 3, x]` | `solve(x + 2 == 3, x)` | `solve(x + 2 = 3, x)` | Not built-in (symbolic) | `solve(sym('x + 2 = 3'), x)` | `solve(x + 2 = 3, x)` |
| Solve $x^2 - 4 = 0$ for $x$ | `Solve[x^2 - 4 == 0, x]` | `solve(x^2 - 4 == 0, x)` | `solve(x^2 - 4 = 0, x)` | `roots([1, 0, -4])` (numerical) | `solve(sym('x^2 - 4 = 0'), x)` | `solve(x^2 - 4 = 0, x)` |
| $\frac{d}{dx} x^2$ | `D[x^2, x]` | `diff(x^2, x)` | `diff(x^2, x)` | Not built-in (symbolic) | `diff(sym('x^2'), x)` | `diff(x^2, x)` |
