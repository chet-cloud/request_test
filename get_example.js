import { client, path, getJwt }  from './client.js' ;
import qs from "qs"

function request(resource, data) {
    return client.get(`${path}${resource}`, {
        params: data,
        paramsSerializer: qs.stringify,
        headers: {
            Authorization: `Bearer ${getJwt()}`,
        },
    });
}

request("categories", { pagination: { withCount: true } }).then((res) => {
    console.log(JSON.stringify(res.data))
})