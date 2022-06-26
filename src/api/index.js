const ROOT_URL = `https://jsonplaceholder.typicode.com/albums`;

const customFetch = async (url, { body, ...customConfig }) => {
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
  };

  const config = {
    ...customConfig,
    ...headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    // console.log("Fetched Data", data);
    return {
      success: true,
      data: data,
    };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

// fn to fetch albums from api
export const getAlbums = () => {
  return customFetch(ROOT_URL, {
    method: "GET",
  });
};

// fn to create new album
export const createAlbum = (album) => {
  return customFetch(ROOT_URL, {
    method: "POST",
    body: album,
  });
};

// fn to update album
export const updateAlbum = (album, id) => {
  return customFetch(`${ROOT_URL}/${id}`, {
    method: "PUT",
    body: album,
  });
};

// fn to delete album
export const deleteAlbum = (id) => {
  return customFetch(`${ROOT_URL}/${id}`, {
    method: "DELETE",
  });
};
