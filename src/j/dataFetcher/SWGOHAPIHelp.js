import APIRoutes from '../utils/APIRoutes';

const fetchPlayerData = (allyCode, onSuccess, onError) => {
  console.log('fetchPlayerData', allyCode);

  const endpoint = `${APIRoutes.FETCH_PLAYER_DATA}/${allyCode}`;

  fetch(endpoint)
    .then(r => r.json())
    .then(r => {
      console.log(r);
      onSuccess(r);
    })
    .catch(e => {
      console.error(e);
      onError(e);
    });
};

export default { fetchPlayerData };
