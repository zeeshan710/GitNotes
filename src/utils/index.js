export const authenticateUser = () => {

  if (sessionStorage.getItem("user")) {
    return JSON.parse(sessionStorage.getItem("user"));
  }
  return false;

};

export const authenticateAccessToken = () => {

  if (sessionStorage.getItem("accessToken")) {
    return sessionStorage.getItem("accessToken");
  }
  return false;

};


export const fetchCall = async (url, options) => {

  let response = null;
  let error = null;
  let status = null;

  try {
    const res = await fetch(url, options);
    status = res.status
    const json = await res.json();
    response = json

  } catch (err) {
    error = err
  }

  return { response, error, status };
};






