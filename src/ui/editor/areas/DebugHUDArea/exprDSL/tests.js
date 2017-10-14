const tests = [
    ['0', '0'],
    ['x', 'x'],
    ['abc123', 'abc123'],
    ['ABC', 'ABC'],
    ['abc_', 'abc_'],
    ['ab_c', 'ab_c'],
    ['_abc', '_abc'],
    ['1abc', undefined],
    ['123a', undefined],
    ['longSTRINGwithCASEchanges', 'longSTRINGwithCASEchanges'],

    ['()', undefined],
    ['...', undefined],
    ['.[]', undefined],
    [' . ', undefined],
    [' [] ', undefined],
    ['[]()', undefined],
    ['', undefined],
    ['=', undefined],
    ['A=', undefined],
    ['=A', undefined],

    ['func()', 'func()'],
    ['func( )', 'func()'],
    ['FUNC( )', 'FUNC()'],

    ['func(0)', 'func(0)'],
    ['func( 0)', 'func(0)'],
    ['func(0 )', 'func(0)'],
    ['func( 0 )', 'func(0)'],
    ['func (0)', 'func(0)'],
    ['func ( 0 )', 'func(0)'],

    ['func(a)', 'func(a)'],
    ['func( a)', 'func(a)'],
    ['func(a )', 'func(a)'],
    ['func( a )', 'func(a)'],
    ['func(a,b)', 'func(a,b)'],
    ['func(a,b,c)', 'func(a,b,c)'],
    ['func(a, b, c)', 'func(a,b,c)'],
    ['func ( a , b , c )', 'func(a,b,c)'],

    ['func(a,0)', 'func(a,0)'],
    ['func ( a , 0 )', 'func(a,0)'],

    ['func(a,)', undefined],
    ['func(,a)', undefined],
    ['func(a),', undefined],
    ['func(a))', undefined],
    ['func((a)', undefined],

    ['f()()', 'f()()'],
    ['f()(a)(b,c)', 'f()(a)(b,c)'],

    ['array[]', undefined],
    ['array[ ]', undefined],
    ['array []', undefined],

    ['array[0]', 'array[0]'],
    ['array[1]', 'array[1]'],
    ['array[454654]', 'array[454654]'],
    ['array[ 0 ]', 'array[0]'],
    ['array[ 0]', 'array[0]'],
    ['array[0 ]', 'array[0]'],
    ['array [0]', 'array[0]'],
    ['array [ 0 ]', 'array[0]'],

    ['array[a]', 'array[a]'],
    ['array[0,0]', undefined],
    ['array[a,b]', undefined],
    ['array[0][0]', 'array[0][0]'],
    ['array[0][1][2]', 'array[0][1][2]'],
    ['array [0] [1] [2]', 'array[0][1][2]'],

    ['a.b', 'a.b'],
    ['a.b.c.d.e', 'a.b.c.d.e'],

    ['a .b', undefined],
    ['a. b', undefined],
    ['a . b', undefined],

    ['f()[0]', 'f()[0]'],
    ['f() [0]', 'f()[0]'],
    ['f[0]()', 'f[0]()'],
    ['f[0] ()', 'f[0]()'],

    ['f().x', 'f().x'],
    ['f ().x', 'f().x'],
    ['f.x()', 'f.x()'],
    ['f.x ()', 'f.x()'],

    ['a[0].x', 'a[0].x'],
    ['a [0].x', 'a[0].x'],
    ['x.a[0]', 'x.a[0]'],
    ['x.a [0]', 'x.a[0]'],

    ['a.b() () [0].c', 'a.b()()[0].c'],
    ['a.b() [1] [0].c', 'a.b()[1][0].c'],
    ['a.b() () [0] .c', undefined],
    ['a. b() () [0].c', undefined],
    ['a. b() () [0] .c', undefined],
    ['a.b().c()[0][5454]', 'a.b().c()[0][5454]'],
    ['a.b ( ).c ( ) [0] [5454]', 'a.b().c()[0][5454]'],
    ['a(0,x2,5,c(r[0].nn5)).y', 'a(0,x2,5,c(r[0].nn5)).y'],
    ['a(0, x2,5,c(r[0].nn5,tt_(x(), x(x(x()[45454])))) ).y', 'a(0,x2,5,c(r[0].nn5,tt_(x(),x(x(x()[45454]))))).y'],
];

export default tests;