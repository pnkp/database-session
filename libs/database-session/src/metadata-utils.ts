export function copyMetadata(object: any): Array<{ key: string; value: any }> {
  const keys = Reflect.getMetadataKeys(object);
  return keys.map((key) => {
    return {
      key,
      value: Reflect.getMetadata(key, object),
    };
  });
}

export function assignMetadata(
  object: any,
  metadata: Array<{ key: string; value: any }>,
) {
  metadata.forEach(({ key, value }) => {
    Reflect.defineMetadata(key, value, object);
  });
}
