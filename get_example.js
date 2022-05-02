import { client, path, getJwt } from './client.js';
import qs from "qs"


// check out the docuemtn
// https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html

export default function request(resource, data) {
    return client.get(`${path}${resource}`, {
        params: data || {
            pagination: {
                pageSize: 100000000,
                page: 1,
            },
            publicationState: 'live',
        },
        paramsSerializer: qs.stringify,
        headers: {
            Authorization: `Bearer ${getJwt()}`,
        },
    });
}

request("categories").then((res) => {
    console.log(res.data.data.length)
})