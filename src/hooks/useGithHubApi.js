import { fetchCall } from '../utils/index';

const useGithHubApi = (initialState = '') => {

    const getAccessToken = async (token) => {

        const data = await fetchCall(`http://localhost:9000/oauthToken?code=${token}`, {
            mode: 'cors',
            method: "get",
            headers: {
                Accept: "application/json",
            }
        });

        return data.response;

    };

    const getUserData = async (accesstoken) => {

        const data = await fetchCall(`https://api.github.com/user`, {
            method: "get",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accesstoken}`
            }
        });
        return data.response;
    }

    const getGistById = async (id) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}`, {
            method: "get",
            headers: {
                Accept: "application/json"
            }
        });

        return data.response;

    }

    const myGistsData = async (username, token) => {

        const data = await fetchCall(`https://api.github.com/users/mirzazeeshan-emumba/gists`, {
            method: "get",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return data.response;
    }

    const forkGist = async (id, token) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}/forks`, {
            method: "POST",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
            },
        });
        return data.response;
    }

    const starGist = async (id, token) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}/star`, {
            method: "PUT",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
                "Content-Length": '0'
            },
        });

        return data.status;
    }

    const unStarGist = async (id, token) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}/star`, {
            method: "DELETE",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
                "Content-Length": '0'
            },
        });
        return data.status;
    }

    const checkstarredGist = async (id, token) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}/star`, {
            method: "GEt",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
                "Content-Length": '0'
            },
        });
        return data.status;
    }

    const deleteGist = async (id, token) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
            },
        });
        return data.status;
    }

    const updateGist = async (id, token, filename, content) => {

        const data = await fetchCall(`https://api.github.com/gists/${id}`, {
            mode: 'cors',
            method: "PATCH",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                "files": {
                    [filename]: {
                        "content": content
                    }
                }
            })
        })

        return data.status;
    }

    const createGist = async (token, filename, content, description) => {

        const data = await fetchCall(`https://api.github.com/gists`, {
            method: "POST",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                "files": {
                    [filename]: {
                        "content": content
                    }
                },
                "description": description
            })
        });

        return data.status;
    }

    const getGistContent = async (url) => {

        return fetch(`${url}`, {
            method: "get",

        }).then(res => {

            return res.text();
        }).catch(err => console.log(err));

    }

    return { getAccessToken, getUserData, getGistById, starGist, forkGist, myGistsData, getGistContent, checkstarredGist, unStarGist, deleteGist, updateGist, createGist };
}

export default useGithHubApi