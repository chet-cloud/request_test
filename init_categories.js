import { client, path, getJwt } from './client.js';
import categories_json from './data/categories.js'

function request(resource, data) {
    return client.post(`${path}${resource}`, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`,
        },
    });
}

const builder = (name, des, background, icon) => {
    return {
        "data": {
            "name": name,
            "des": des,
            "background": background,
            "icon": icon,
            "tags": [

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

const requests = categories_json.map(({ name, des, background, icon }) => {
    request("categories", builder(name, des, background, icon))
})

Promise.all(requests).then((res_array) => {
    console.log(JSON.stringify(res_array))
})

// Not test

