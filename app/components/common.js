export function mapToArray (hash) {
  const arr = [];
  for (const id in hash) {
    if (Object.hasOwnProperty.call(hash, id)) {
      const item = hash[id];
      item.id = id;
      arr.push(item);
    }
  }
  return arr;
}
