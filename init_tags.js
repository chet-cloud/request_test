import { client, path, getJwt } from './client.js';
import tags_json from './data/tags.js'

function request(resource, data) {
    return client.post(`${path}${resource}`, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`,
        },
    });
}

const tags_build = (name) => {
    return {
        "data": {
            "name": name,
            "categories": [

            ],
            "videos": [

            ],
            "createdAt": new Date().toJSON(),
            "updatedAt": new Date().toJSON(),
            "createdBy": "1",
            "updatedBy": "1"
        }
    }
}

const requests = tags_json.map(({ tag }) => {
    request("tags", tags_build(tag))
})

Promise.all(requests).then((res_array) => {
    console.log(JSON.stringify(res_array))
})


