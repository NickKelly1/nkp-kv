/* eslint-disable @typescript-eslint/ban-types */
export type KvValue = unknown;

export type KvFormattable =
  | KvValue
  | Record<PropertyKey, KvValue>
;

export interface KvFormatOptions {
  spacing?: null | number;
  locale?: null | string,
  formatKey?(key: string): string;
}

export interface KvDefaultFormatOptions extends KvFormatOptions {
  spacing: number;
  formatKey(key: string): string;
}

export interface KvFormatContext {
  spacing: string;
  locale?: null | string,
  formatKey: (key: string) => string;
}

class KvFormatter {
  constructor(protected readonly ctx: KvFormatContext) {}

  /**
   * Format any input
   *
   * @param value
   * @returns
   */
  handleInput(value: unknown): string {
    if (value && typeof value === 'object') return this.handleObjectInput(value as any);
    return this.handleValue(value);
  }

  /**
   * Format an inputted object
   *
   * @param value
   * @returns
   */
  protected handleObjectInput(value: Record<PropertyKey, unknown>): string {
    const entries: [string, string][] = [];
    let items: string;

    // check map
    if (value instanceof Map) {
      for (const [key, element,] of value.entries()) {
        entries.push([this.handleKey(key), this.handleValue(element),]);
      }
      items = entries.map(([key, val,]) => `${key}=>${val}`).join(this.ctx.spacing);
    }

    else if (value instanceof Set) {
      let i = 0;
      for (const element of value.values()) {
        entries.push([this.handleKey(i), this.handleValue(element),]);
        i += 1;
      }
      items = entries.map(([key, val,]) => `${key}->${val}`).join(this.ctx.spacing);
    }

    else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        if (Object.prototype.hasOwnProperty.call(value, i)) {
          entries.push([this.handleKey(i), this.handleValue(value[i]),]);
        }
      }
      items = entries.map(([key, val,]) => `${key}>>${val}`).join(this.ctx.spacing);
    }
    else {
      for (const key in value) {
        const element = value[key];
        entries.push([this.handleKey(key), this.handleValue(element),]);
      }
      items = entries.map(([key, val,]) => `${key}=${val}`).join(this.ctx.spacing);
    }

    const proto: null | { new?(): unknown } = Object.getPrototypeOf(value);
    const ctor = proto?.constructor;
    const name = ctor?.name;
    return items || `<empty ${name ?? '<null>'}>`;
  }

  /**
   * Format any key
   *
   * @param value
   * @returns
   */
  protected handleKey(value: unknown): string {
    switch (typeof value) {
      case 'string': return this.ctx.formatKey(this.handleStringKey(value));
      case 'number': return this.ctx.formatKey(this.handleNumberKey(value));
      case 'boolean': return this.ctx.formatKey(this.handleBooleanKey(value));
      case 'bigint': return this.ctx.formatKey(this.handleBigIntKey(value));
      case 'undefined': return this.ctx.formatKey(this.handleUndefinedKey(value));
      case 'symbol': return this.ctx.formatKey(this.handleSymbolKey(value));
      case 'function': return this.ctx.formatKey(this.handleFunctionKey(value));
      case 'object': {
        if (value === null) return this.ctx.formatKey(this.handleNullKey(value));
        return this.ctx.formatKey(this.handleObjectKey(value as Record<PropertyKey, unknown>));
      }
      default: return this.ctx.formatKey(this.handleUnhandledKey(value));
    }
  }

  /**
   * Format any value
   *
   * @param value
   * @returns
   */
  protected handleValue(value: unknown): string {
    switch (typeof value) {
      case 'string': return this.handleStringValue(value);
      case 'number': return this.handleNumberValue(value);
      case 'boolean': return this.handleBooleanValue(value);
      case 'bigint': return this.handleBigIntValue(value);
      case 'undefined': return this.handleUndefinedValue(value);
      case 'symbol': return this.handleSymbolValue(value);
      case 'function': return this.handleFunctionValue(value);
      case 'object': {
        if (value === null) return this.handleNullValue(value);
        return this.handleObjectValue(value as Record<PropertyKey, unknown>);
      }
      default: return this.handleUnhandledValue(value);
    }
  }

  /**
   * Format an `object` key
   *
   * @param value
   * @returns
   */
  protected handleObjectKey(value: Record<PropertyKey, unknown>): string {
    return this.handleObjectValue(value);
  }

  /**
   * Format an `object` value
   *
   * @param value
   * @returns
   */
  protected handleObjectValue(value: Record<PropertyKey, unknown>): string {
    const proto: null | { constructor?: { new(): unknown } } = Object.getPrototypeOf(value);
    const ctor = proto?.constructor;
    const name = ctor?.name;

    // object with null prototype (eg. Object.create(null))
    if (!ctor) return '[Object: null prototype]';

    return `[object ${name}]`;
  }

  /**
   * Format an unhandled key
   *
   * @param key
   * @returns
   */
  protected handleUnhandledKey(key: unknown): string {
    return this.handleUnhandledValue(key);
  }

  /**
   * Format an unhandled value
   *
   * @param value
   * @returns
   */
  protected handleUnhandledValue(value: unknown): string {
    const str = `_unhandled (${typeof value})_`;
    try {
      if (!value) return str;
      if (!('toString' in <any>value)) return str;
      if (!(typeof <any>value === 'function')) return str;
      return `_unhandled (${typeof value}) { ${(<any>value).toString()} }_`;
    } catch (err) {
      return `_unhandled (${typeof value})_`;
    }
  }

  /**
   * Format a `Function` key
   *
   * @param value
   * @returns
   */
  protected handleFunctionKey(value: Function): string {
    return this.handleFunctionValue(value);
  }


  /**
   * Format a `Function` value
   *
   * @param value
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected handleFunctionValue(value: Function): string {
    const name = value.name;
    return `[Function ${name}]`;
  }


  /**
   * Format a `string` key
   *
   * @param value
   * @returns
   */
  protected handleStringKey(value: string): string {
    return value.toString();
  }


  /**
   * Format a `string` value
   *
   * @param value
   * @returns
   */
  protected handleStringValue(value: string): string {
    return '"' + value.toString() + '"';
  }


  /**
   * Format a `number` key
   *
   * @param value
   * @returns
   */
  protected handleNumberKey(value: number): string {
    return this.handleNumberValue(value);
  }


  /**
   * Format a `number` value
   *
   * @param value
   * @returns
   */
  protected handleNumberValue(value: number): string {
    // infinite / NaN / ...
    if (!Number.isFinite(value)) return value.toString();
    if (this.ctx.locale) return value.toLocaleString(this.ctx.locale);
    return value.toString();
  }


  /**
   * Format a `boolean` key
   *
   * @param value
   * @returns
   */
  protected handleBooleanKey(value: boolean): string {
    return this.handleBooleanValue(value);
  }


  /**
   * Format a `boolean` value
   *
   * @param value
   * @returns
   */
  protected handleBooleanValue(value: boolean): string {
    return String(value);
  }


  /**
   * Format a `BigInt` key
   *
   * @param value
   * @returns
   */
  protected handleBigIntKey(value: BigInt): string {
    return this.handleBigIntValue(value);
  }


  /**
   * Format a `BigInt` value
   *
   * @param value
   * @returns
   */
  protected handleBigIntValue(value: BigInt): string {
    if (this.ctx.locale) return value.toLocaleString(this.ctx.locale) + 'n';
    return value.toString() + 'n';
  }


  /**
   * Format a `null` key
   *
   * @param _
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleNullKey(_: null): string {
    return this.handleNullValue(_);
  }


  /**
   * Format a `null` value
   *
   * @param _
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleNullValue(_: null): string {
    return 'null';
  }


  /**
   * Format an `undefined` key
   *
   * @param _
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleUndefinedKey(_: undefined): string {
    return this.handleUndefinedValue(_);
  }


  /**
   * Format an `undefined` value
   *
   * @param _
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleUndefinedValue(_: undefined): string {
    return 'undefined';
  }


  /**
   * Format a `symbol` key
   *
   * @param symbol
   * @returns
   */
  protected handleSymbolKey(symbol: symbol): string {
    return this.handleSymbolValue(symbol);
  }


  /**
   * Format a `symbol` value
   *
   * @param symbol
   * @returns
   */
  protected handleSymbolValue(symbol: symbol): string {
    return `Symbol(${symbol.description})`;
  }
}

/**
 * Format a primitive or the first level of an object's enumerable key-values
 *
 * @param value
 * @param options
 * @returns
 */
export function kv(value: KvFormattable, options?: KvFormatOptions) {
  const ctx: KvFormatContext = {
    spacing: ' '.repeat(options?.spacing ?? kv.defaults.spacing),
    formatKey: options?.formatKey ?? kv.defaults.formatKey,
    locale: options?.locale ?? kv.defaults.locale,
  };
  const formatter = new KvFormatter(ctx);
  const output = formatter.handleInput(value);
  return output;
}

export namespace kv {
  // "let" makes the namespace export reassignable by the consumer
  // eslint-disable-next-line prefer-const
  export let defaults: KvDefaultFormatOptions = {
    spacing: 2,
    locale: 'en-us',
    formatKey: (key) => key,
  };
}