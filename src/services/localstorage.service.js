export const localSet = (key, json) => (
  localStorage.setItem(key, JSON.stringify(json))
)

export const localGet = (key) => (
  JSON.parse(localStorage.getItem(key))
)