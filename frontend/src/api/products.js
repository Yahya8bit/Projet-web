const BASE = 'http://localhost/gy_sole/backend/api'

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams()
  if (params.brand)      qs.set('brand', params.brand)
  if (params.collection) qs.set('collection', params.collection)
  if (params.type)       qs.set('type', params.type)
  if (params.prix_max)   qs.set('prix_max', params.prix_max)
  if (params.search)     qs.set('search', params.search)
  const url = `${BASE}/products/${qs.toString() ? '?' + qs : ''}`
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error(`products ${res.status}`)
  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error(`product ${res.status}`)
  return res.json()
}
