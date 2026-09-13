linear = (x) => x;
easeInQuad = (x) => x * x;
easeOutQuad = (x) => 1 - (1 - x) * (1 - x);
easeOutSine = (x) => sin((x * PI) / 2);
easeInSine = (x) => 1 - cos((x * PI) / 2);

