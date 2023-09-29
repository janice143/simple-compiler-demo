import { tokenize } from './front/lexer.ts';
import { parse } from './front/parser.ts';

repl();

function repl() {
  console.log('\nRepl v0.1');

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt('> ');
    // Check for no user input or exit keyword.
    if (!input || input.includes('exit')) {
      Deno.exit(1);
    }

    const program = parse(tokenize(input));
    console.log(program);
    // Deno.stdout.writeSync(
    //   new TextEncoder().encode(JSON.stringify(program, null, 2) + '\n')
    // );
  }
}
