const GLOBAL = {
  'url': process.env.NODE_ENV === 'development' ?
    'http://dev.api.geekshubsacademy.com:4000' :
    'https://api.geekshubsacademy.com'
}

export default GLOBAL;