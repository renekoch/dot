/**
 * Get {val} or result of {val} if val is a function
 * @param {function|*} val
 * @param {array|object} obj
 * @return {*}
 */
export function value(val, obj) {
  switch (typeof val) {
    case 'function': return val(obj);
    case 'string': return isNaN(Number(val)) ? val : Number(val);
    default: return val;
  }
}

/**
 * Get {key} in {obj} with dot notaion, if {key} does not exist in {obj} return value of {def}
 * @param {object|array} obj
 * @param {string}key
 * @param {function|*} def
 * @return {*}
 */
export function get(obj, key, def) {
  const sections = ('' + (key ?? '')).split('.');

  if (!obj || !sections.length) return obj;

  let sub = obj;
  while (sections.length && sub != null) sub = obj[sections.shift()];
  return sub ?? value(def, obj);
}


/**
 * Set {key} in {obj} with dot notaion to value of {val}
 * @param {object|array} obj
 * @param {string}key
 * @param {function|*} val
 * @return {object|array}
 */
export function set(obj, key, val) {
  if (!obj || !key) return obj;

  let sub = obj;
  const sections = ('' + key).split('.');

  if (!sections.length) return obj;

  while (sections.length > 1) {
    const key = sections.shift();
    sub = obj[key] ?? (obj[key] = {});
  }

  sub[sections[0]] = value(val, obj);

  return obj;
}

/**
 * Get {key} in {obj} with dot notaion, if {key} does not exist in {obj} set key to- and return value of {def}
 * @param {object|array} obj
 * @param {string}key
 * @param {function|*} def
 * @return {*}
 */
export function remember(obj, key, def) {
  return get(obj, key, () => {
    const val = value(def, obj);
    set(obj, key, val);
    return val;
  });
}

export default {
  get,
  set,
  remember,
  value,
};
