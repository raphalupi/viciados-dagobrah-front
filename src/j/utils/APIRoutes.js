const devRoutePrefix = '';
const prodRoutePrefix = 'https://ga-nalysis-api.herokuapp.com';

const baseRoutes = {
  FETCH_PLAYER_DATA: '/api/fetchPlayer' // /:allyCode
};

function getRoutesWithEnvPrefix(env) {
  console.log('getRoutesWithEnvPrefix', env);
  let prefix = devRoutePrefix;
  if (env === 'production') {
    prefix = prodRoutePrefix;
  }

  return Object.keys(baseRoutes).reduce((acc, key) => {
    acc[key] = `${prefix}${baseRoutes[key]}`;
    return acc;
  }, {});
}

const prefixedRoutes = getRoutesWithEnvPrefix(process.env.NODE_ENV);

export default prefixedRoutes;
