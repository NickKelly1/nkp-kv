import { kv } from '.';

describe('kv should', () => {
  describe('print strings', () => {
    it('"hello"', () => {
      expect(kv('hello')).toBe('"hello"');
    });

    it('"world"', () => {
      expect(kv('world')).toBe('"world"');
    });

    it('"<empty>"', () => {
      expect(kv('')).toBe('""');
    });
  });

  describe('print numbers', () => {
    it('0', () => {
      expect(kv(0)).toBe('0');
    });

    it('1', () => {
      expect(kv(1)).toBe('1');
    });

    it('2', () => {
      expect(kv(2)).toBe('2');
    });

    it('Infinity', () => {
      expect(kv(Number.POSITIVE_INFINITY)).toBe('Infinity');
    });

    it('-Infinity', () => {
      expect(kv(Number.NEGATIVE_INFINITY)).toBe('-Infinity');
    });
  });

  describe('print booleans', () => {
    it('true', () => {
      expect(kv(true)).toBe('true');
    });

    it('false', () => {
      expect(kv(false)).toBe('false');
    });
  });

  describe('print symbols', () => {
    it('Symbol(hello)', () => {
      expect(kv(Symbol('hello'))).toBe('Symbol(hello)');
    });

    it('Symbol(world)', () => {
      expect(kv(Symbol('world'))).toBe('Symbol(world)');
    });
  });

  describe('print bigints', () => {
    it('BigInt(5)', () => {
      expect(kv(BigInt(5))).toBe('5n');
    });

    it('BigInt(99999999999999999999999)', () => {
      expect(kv(BigInt('99999999999999999999999'))).toBe('99999999999999999999999n');
    });
  });

  describe('print functions', () => {
    it('[Function hello]', () => {
      expect(kv(function hello() {})).toBe('[Function hello]');
    });

    it('[Function world]', () => {
      expect(kv(function world() {})).toBe('[Function world]');
    });

    it('[Function props] {  hello="world"  }', () => {
      function props() {}
      props.hello = 'world';
      const str = '[Function props] {  hello="world"  }';
      expect(kv(props)).toBe(str);
    });

    it('[Function props] {  hello="world"  lib="kv"  }', () => {
      function props() {}
      props.hello = 'world';
      props.lib = 'kv';
      const str = '[Function props] {  hello="world"  lib="kv"  }';
      expect(kv(props)).toBe(str);
    });

    it('[Function nested] {  hello="world"  nested={  prop="value"  }  }', () => {
      function nested() {}
      nested.hello = 'world';
      nested.nested = { prop: 'value', };
      const str = '[Function nested] {  hello="world"  nested={  prop="value"  }  }';
      expect(kv(nested)).toBe(str);
    });
  });

  describe('print objects', () => {
    it('hello=world', () => {
      const obj = {
        hello: 'world',
      };
      expect(kv(obj)).toBe('hello="world"');
    });
    it('hello=world  lib=kv', () => {
      const obj = {
        hello: 'world',
        lib: 'kv',
      };
      expect(kv(obj)).toBe('hello="world"  lib="kv"');
    });
    it('nested', () => {
      const obj = {
        nested1: 'value1',
        nested2: {
          nested21: 'value21',
          nested22: {},
        },
      };
      const str = 'nested1="value1"'
        + '  nested2={'
          + '  nested21="value21"'
          + '  nested22={}'
        + '  }'
      ;
      expect(kv(obj)).toBe(str);
    });

    it('nested nested', () => {
      const obj = {
        nested1: 'value1',
        nested2: {
          nested21: 'value21',
          nested22: {
            nested221: 'value221',
            nested222: {},
          },
          nested23: {},
        },
      };
      const str = 'nested1="value1"'
        + '  nested2={'
          + '  nested21="value21"'
          + '  nested22={'
            + '  nested221="value221"'
            + '  nested222={}'
          + '  }'
          + '  nested23={}'
        + '  }'
      ;
      expect(kv(obj)).toBe(str);
    });
  });
});