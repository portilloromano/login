export const localSetItem = (key, json) => (
  localStorage.setItem(key, JSON.stringify(json))
)

export const localGetItem = (key) => (
  JSON.parse(localStorage.getItem(key))
)

export const localRemoveItem = (key) => (
  localStorage.removeItem(key)
)

export const sessionSetItem = (key, json) => (
  sessionStorage.setItem(key, JSON.stringify(json))
)

export const sessionGetItem = (key) => (
  JSON.parse(sessionStorage.getItem(key))
)

export const sessionRemoveItem = (key) => (
  sessionStorage.removeItem(key)
)

export const getLocalUser = () => {
  let user = sessionGetItem('user') !== null ? sessionGetItem('user') : localGetItem('user');
  if (user !== null) {
    return user = {
      ...user,
      exist: true
    };
  } else {
    return user = {
      nickname: '',
      img_profile: null,
      rol: '',
      exist: false
    };
  };
}

export const getLocalJwt = () => {
  const user = sessionGetItem('user') !== null ? sessionGetItem('user') : localGetItem('user');
  if (user !== null) {
    return user.jwt;
  } else {
    return null;
  };
}