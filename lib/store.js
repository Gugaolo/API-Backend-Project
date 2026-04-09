const store = globalThis.__weatherFavoritesStore ?? {
  users: [],
  favorites: [],
  nextUserId: 1,
  nextFavoriteId: 1,
};

globalThis.__weatherFavoritesStore = store;

function nextUserId() {
  const id = store.nextUserId;
  store.nextUserId += 1;
  return id;
}

function nextFavoriteId() {
  const id = store.nextFavoriteId;
  store.nextFavoriteId += 1;
  return id;
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

export function findUserByUsername(username) {
  return store.users.find((user) => user.username === username) || null;
}

export function createUser({ username, passwordHash }) {
  const user = {
    id: nextUserId(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  return user;
}

export function getFavoritesForUser(username) {
  return store.favorites.filter((favorite) => favorite.createdBy === username);
}

export function createFavorite({ city, country, latitude, longitude, createdBy }) {
  const favorite = {
    id: nextFavoriteId(),
    city,
    country,
    latitude,
    longitude,
    createdBy,
  };

  store.favorites.push(favorite);
  return favorite;
}

export function findFavoriteByIdForUser(id, username) {
  return (
    store.favorites.find((favorite) => favorite.id === id && favorite.createdBy === username) || null
  );
}

export function updateFavorite(id, username, updates) {
  const favorite = findFavoriteByIdForUser(id, username);

  if (!favorite) {
    return null;
  }

  Object.assign(favorite, updates);
  return favorite;
}

export function deleteFavorite(id, username) {
  const index = store.favorites.findIndex(
    (favorite) => favorite.id === id && favorite.createdBy === username
  );

  if (index === -1) {
    return false;
  }

  store.favorites.splice(index, 1);
  return true;
}
