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

    it('BigInt(99,999,999,999,999,999,999,999)', () => {
      expect(kv(BigInt('99999999999999999999999'))).toBe('99,999,999,999,999,999,999,999n');
    });
  });

  describe('print functions', () => {
    it('[Function hello]', () => {
      expect(kv(function hello() {})).toBe('[Function hello]');
    });

    it('[Function world]', () => {
      expect(kv(function world() {})).toBe('[Function world]');
    });

    it('[Function props]', () => {
      function props() {}
      props.hello = 'world';
      const str = '[Function props]';
      expect(kv(props)).toBe(str);
    });

    it('[Function props]', () => {
      function props() {}
      props.hello = 'world';
      props.lib = 'kv';
      const str = '[Function props]';
      expect(kv(props)).toBe(str);
    });

    it('[Function nested]', () => {
      function nested() {}
      nested.hello = 'world';
      nested.nested = { prop: 'value', };
      const str = '[Function nested]';
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
        + '  nested2=[object Object]'
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
        + '  nested2=[object Object]'
      ;
      expect(kv(obj)).toBe(str);
    });

    it('emtpy', () => expect(kv({})).toBe('<empty Object>'));
  });

  describe('print null prototypes', () => {
    it('empty', () => expect(kv(Object.create(null))).toBe('<empty <null>>'));
    it('non-emtpy', () => {
      const obj = Object.create(null);
      obj.hello = 'world';
      expect(kv(obj)).toBe('hello="world"');
    });
  });

  describe('print maps', () => {
    it('empty', () => expect(kv(new Map())).toBe('<empty Map>'));
    it('non-empty', () => {
      const obj = new Map();
      obj.set('hello', 'world');
      obj.set('number', 1);
      expect(kv(obj)).toBe('hello=>"world"  number=>1');
    });
  });

  describe('print sets', () => {
    it('empty', () => expect(kv(new Set())).toBe('<empty Set>'));
    it('non-empty', () => {
      const obj = new Set();
      obj.add('world');
      obj.add(1);
      expect(kv(obj)).toBe('0->"world"  1->1');
    });
  });

  describe('print arrays', () => {
    it('empty', () => expect(kv([])).toBe('<empty Array>'));
    it('non-empty', () => {
      const obj = [];
      obj.push('world');
      obj.push(1);
      obj[3] = 5;
      expect(kv(obj)).toBe('0>>"world"  1>>1  3>>5');
    });
  });
});
