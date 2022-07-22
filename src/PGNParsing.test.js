import {parse} from '@mliebelt/pgn-parser'

test('PGN', () => {
    const pgn = '[Event "?"]\n' +
        '[Site "?"]\n' +
        '[Date "????.??.??"]\n' +
        '[Round "?"]\n' +
        '[White "?"]\n' +
        '[Black "?"]\n' +
        '[Result "1-0"]\n' +
        '\n' +
        '1. e4 e5 ';
    const json = parse(pgn);
    var moves = json[0]['moves']
    expect(moves.length).toBe(2);
})

test('another PGN', () => {
    const pgn = '[Event "?"]\n' +
        '[Site "?"]\n' +
        '[Date "????.??.??"]\n' +
        '[Round "?"]\n' +
        '[White "?"]\n' +
        '[Black "?"]\n' +
        '[Result "*"]\n' +
        '\n' +
        '1. a4 a5 2. b4 (2. c4 c5) 2... b5 *'
    const json = parse(pgn);
    console.log(JSON.stringify(json));
})
