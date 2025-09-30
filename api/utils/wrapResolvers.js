export function wrapResolvers(resolvers, whitelist = ['login', 'createUser']) {
  // normalize: si resolvers est un array, fusionne les éléments en un seul objet
  const merged = Array.isArray(resolvers)
    ? resolvers.reduce((acc, r) => {
        if (!r || typeof r !== 'object') return acc
        for (const [typeName, typeObj] of Object.entries(r)) {
          if (!acc[typeName]) {
            acc[typeName] = typeObj
          } else if (typeObj && typeof typeObj === 'object') {
            acc[typeName] = { ...acc[typeName], ...typeObj }
          } else {
            acc[typeName] = typeObj
          }
        }
        return acc
      }, {})
    : { ...resolvers }

  const out = {}

  for (const [typeName, typeObj] of Object.entries(merged)) {
    if (typeObj == null || typeof typeObj !== 'object') {
      out[typeName] = typeObj
      continue
    }

    out[typeName] = { ...typeObj }

    if (typeName !== 'Query' && typeName !== 'Mutation' && typeName !== 'Subscription') {
      continue
    }

    for (const [fieldName, fieldResolver] of Object.entries(typeObj)) {
      if (typeof fieldResolver !== 'function') {
        out[typeName][fieldName] = fieldResolver
        continue
      }

      if (whitelist.includes(fieldName) || whitelist.includes(`${typeName}.${fieldName}`)) {
        out[typeName][fieldName] = fieldResolver
        continue
      }

      out[typeName][fieldName] = async (parent, args, ctx, info) => {
        if (!ctx || !ctx.user) throw new Error('Not authenticated')
        return fieldResolver(parent, args, ctx, info)
      }
    }
  }

  return out
}