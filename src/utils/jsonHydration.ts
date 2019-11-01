import { camelCase, forOwn, forIn, isBoolean, isUndefined, isArray } from 'lodash';
import { Collection, makeCollection } from '../lib/entities/Collection';

export type AnyObject = { [key: string]: any };

// W3C timestamp format: yyyy-mm-ddThh:ii:ss+zz:zz
const TIMESTAMP_REGEX_W3C: RegExp = /^\d{4}-\d{2}-\d{2}((T| )\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})*|)$/;

/**
 * Takes in a collection or array. If it's an array, make it into a collection.
 * Since the array is in JSON it is assumed that all the internal objects
 * are in snake case case instead of camelCase. The purpose of this function
 * is to hydrate the passed in collection with the appropriate entity.
 * @param {Collection<object> | object[]} valueß
 * @param {C} collection
 * @param {() => T} entityCreator
 * @param {{ignoreErrors: boolean}} options
 * @returns {C}
 */
export const jsonHydrateCollection = <T extends {}, C extends Collection<T>>(
  value: Collection<object> | object[],
  collection: C,
  entityCreator: () => T,
  options: { ignoreErrors: boolean } = { ignoreErrors: false }
): C => {
  let newValue;
  let newCollection = { ...collection };
  // make it a collection if it's not a collection.
  if (isArray(value)) {
    newValue = makeCollection<object>(value);
  } else {
    newValue = { ...value };
  }
  forOwn(newValue, (v, k) => {
    if (v !== null) {
      newCollection = {
        ...newCollection,
        [k]: v
      };
    }
  });
  const data: T[] = [];
  newCollection.data.forEach((v: object) => {
    try {
      data.push(jsonHydrateEntity(v, entityCreator()));
    } catch (e) {
      if (!options.ignoreErrors) {
        throw e;
      }
    }
  });
  newCollection = {
    ...newCollection,
    data
  };
  return newCollection;
};

/**
 * Hydrates an entity from a JSON object. Since the object is in JSON it is assumed that the keys
 * are all snake cased instead of camel cased.
 */
export const jsonHydrateEntity = <T extends AnyObject>(value: object, entity: T): T => {
  const serialized: AnyObject = serialize(value);
  // The typeof entity makes this work because of black magic.
  const o: AnyObject = {};
  forIn(entity, (defaultV, k) => {
    if (
      Object.prototype.hasOwnProperty.call(serialized, k) &&
      defaultV !== undefined &&
      serialized[k] !== null &&
      !isSameType(defaultV, serialized[k])
    ) {
      throw new TypeError(
        `\`${k}\` value: \`${JSON.stringify(serialized[k])}\` has default value \`${JSON.stringify(defaultV)}\`.`
      );
    }
    const v = coerceTypes(serialized[k], defaultV);
    o[k] = v === null ? defaultV : v;
  });
  return o as T;
};

/**
 * Decides if we should attempt to serialize a value. It will only attempt to serialize values
 * that are of type Array and Object. Anything else gets the original value back.
 */
export const serialize = (value: any, transform: (key: string) => string = camelCase): any => {
  const vT: string = getRealType(value);
  if (vT === 'object') {
    return serializeObject(value, transform);
  } else if (vT === 'array') {
    return serializeArray(value, transform);
  }
  return value;
};

/**
 * Serializes the value of an array. If the type of value in the array is an object then the object keys
 * will be turned into camel case.
 */
const serializeArray = (value: any[], transform: (key: string) => string): any[] => {
  return value.map(v => serialize(v, transform));
};

/**
 * Converts all keys for an object into [camelCase]. Additionally it will do a serialize pass on the value.
 * If the value is an object or an array of objects it will also convert those keys into [camel case].
 */
const serializeObject = (value: any, transform: (key: string) => string): AnyObject => {
  const ret: AnyObject = {};
  forOwn(value, function(v: any, k: string) {
    ret[transform(k)] = serialize(v, transform);
  });
  return ret;
};

/**
 * Will check if control and value are of the same type. Note due to number and string wonkiness
 * a value that is a integer against a proto is a string will be case to a string.
 */
const isSameType = (control: any, value: any): boolean => {
  const controlType: string = getRealType(control);
  let valueType: string = getRealType(value);

  if (valueType === 'string' && !isNaN(+value) && value !== '') {
    valueType = 'number';
  }
  if (controlType === 'string' && valueType === 'number') {
    value = value.toString();
    valueType = typeof value;
  }
  if (controlType === 'boolean' && isBooleanesque(value)) {
    valueType = 'boolean';
  }
  if (valueType === 'string' && isTimestampesque(value)) {
    valueType = 'date';
  }
  return controlType === valueType;
};

/**
 * Returns whether or not a string value represents a valid
 * timestamp value.
 */
const isTimestampesque = (value: string): boolean => {
  return !!value.match(TIMESTAMP_REGEX_W3C);
};

/**
 * Returns whether or not the value is a true boolean,
 * boolean string, or boolean number
 */
const isBooleanesque = (value: any): boolean => {
  if (isBoolean(value)) {
    return true;
  }
  const boolyStringies: { [k: string]: true } = {
    true: true,
    false: true
  };
  const n = +value;
  return n === 1 || n === 0 || boolyStringies[value];
};

/**
 * Casts a given value (v) to an empty entity value's interpreted value. e.g. entityField: boolean, v: '1' returns
 * value v of true.
 */
const coerceTypes = (value: any, typeTarget: any): any => {
  if (isUndefined(value)) {
    return typeTarget;
  }

  const type = getRealType(typeTarget);

  switch (type) {
    case 'string': {
      return value !== null ? value.toString() : '';
    }
    case 'number': {
      return +value;
    }
    case 'boolean': {
      if (!isBooleanesque(value)) {
        throw TypeError(`Cannot coerce ${value} to boolean`);
      }
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      return !!Number(value);
    }
    case 'date': {
      return new Date(value);
    }
    default: {
      return value;
    }
  }
};

/**
 * Will try to get the actual type of the variable given.
 * getRealType(5);          // Will return 'number'
 * getRealType("5");        // Will return 'string'
 * getRealType("asdf");     // Will return 'string'
 * getRealType("{}");       // Will return 'string'
 * getRealType("[]");       // Will return 'string'
 * getRealType({});         // Will return 'object'
 * getRealType([]);         // Will return 'array'
 * getRealType(new Date()); // Will return 'date'
 * getRealType(null);       // Will return 'null'
 * @param value
 * @returns {string}
 */
const getRealType = (value: any): string => {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value instanceof Date) {
    return 'date';
  }
  if (value === null) {
    return 'null';
  }
  return typeof value;
};
