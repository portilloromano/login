export const localSetItem = (key, json) => (
  localStorage.setItem(key, JSON.stringify(json))
)

export const localGetItem = (key) => (
  JSON.parse(localStorage.getItem(key))
)

export const localRemoveItem = (key) => (
  localStorage.removeItem(key)
)