import APIRoutes from '../utils/APIRoutes';

const fetchPlayerData = (allyCode, onSuccess, onError) => {
  const endpoint = `${APIRoutes.FETCH_PLAYER_DATA}/${allyCode}`;

  fetch(endpoint)
    .then(r => {
      if (!r.ok) throw r;
      return r.json();
    })
    .then(r => onSuccess(r))
    .catch(e => {
      if (typeof e.json === 'function') {
        e.json().then(errorData => {
          onError(errorData);
        });
        return;
      }

      console.error(e);
    });
};

export default { fetchPlayerData };
