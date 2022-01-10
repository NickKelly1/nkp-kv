export interface ValueFormatter<T = unknown> {
  (unknown: T, options: KvFormatterOptions): string;
}

export interface KvOptions {
  key?(key: string): string;
  value?(value: string): string;
  spacing?: number;
  prefix?: string;
  formatValue?: ValueFormatter<unknown>;
  formatObject?: ValueFormatter<object | Record<PropertyKey, unknown>>;
}

export interface KvFormatterOptions extends Required<KvOptions> {
  seen: Set<any>;
}

/**
 * Turn an object into key-value pairs
 *
 * @param obj
 * @returns
 */
export function kv(obj: unknown, options?: KvOptions): string {
  const _options = kv.getOptions(options) as KvFormatterOptions;
  _options.seen = new Set();
  return _options.formatValue(obj, _options);
}

export namespace kv {
  export function getOptions(options?: KvOptions): Required<KvOptions> {
    return {
      formatObject: options?.formatObject ?? kv.defaults.formatObject,
      formatValue: options?.formatValue ?? kv.defaults.formatValue,
      key: options?.key ?? kv.defaults.key,
      value: options?.value ?? kv.defaults.value,
      prefix: options?.prefix ?? kv.defaults.prefix,
      spacing: options?.spacing ?? kv.defaults.spacing,
    };
  }

  export const defaults: Required<KvOptions> = {
    spacing: 2,
    key(key: string): string { return key; },
    value(value: string): string { return value; },
    prefix: '',
    formatObject(object: object | Record<PropertyKey, unknown>, options: KvFormatterOptions): string {
      // const entries: [string, string[]] = [];
      const str: string[] = [];
      for (const enumerable in object) {
        const value = (object as Record<PropertyKey, unknown>)[enumerable];
        const nextOptions = {
          ...options,
          prefix: options.prefix
            ? options.prefix + '.' + enumerable
            : enumerable,
        };
        str.push(options.formatValue(value, nextOptions));
      }
      return str.join(' '.repeat(options.spacing));
    },
    formatValue(unknown: unknown, options: KvFormatterOptions): string {
      if (unknown === null) return options.prefix + 'null';
      switch (typeof unknown) {

        case 'boolean': {
          const valueStr = options.value(unknown.toString());
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr;
        }

        case 'number': {
          const valueStr = options.value(unknown.toString());
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr;
        }

        case 'undefined': {
          const valueStr = options.value('undefined');
          if (!options.prefix) return valueStr;
          return options.prefix
            + '='
            + valueStr;
        }

        case 'string': {
          const valueStr = '"' + options.value(unknown) + '"';
          if (!options.prefix) return  valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr
          ;
        }

        case 'symbol': {
          const valueStr = options.value(unknown.toString());
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr;
        }

        case 'bigint': {
          const valueStr = options.value(unknown.toString() + 'n');
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr;
        }

        case 'object': {
          const nextOptions = {
            ...options,
            prefix: '',
          };
          const valueStr = options.seen.has(unknown)
            ? '<seen>'
            : options.formatObject(unknown as object, nextOptions)
          ;
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + '{'
            + (valueStr.length ? ' '.repeat(options.spacing) : '')
            + valueStr
            + (valueStr.length ? ' '.repeat(options.spacing) : '')
            + '}'
          ;
        }

        case 'function':  {
          const nextOptions = {
            ...options,
            prefix: '',
          };
          let valueStr = options.value(`[Function ${unknown.name}]`);
          let objectStr = options.formatObject(unknown, nextOptions);
          if (objectStr) {
            objectStr = '{'
              + ' '.repeat(options.spacing)
              + objectStr
              + ' '.repeat(options.spacing)
              + '}'
            ;
            valueStr = valueStr + ' ' + objectStr;
          }
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr;
          ;
        }

        default: {
          const valueStr = options.value(String(unknown))
          if (!options.prefix) return valueStr;
          return options.key(options.prefix)
            + '='
            + valueStr;
        }
      }
    },
  }
}
