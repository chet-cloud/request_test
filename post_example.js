import { client, path, getJwt } from './client.js';


function request(resource, data) {
    return client.post(`${path}${resource}`, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`,
        },
    }).catch((e) => {
        console.log(`request ${path}${resource} error`)
    })
}


request("coins", {
    "data": {
        "userId": "1212",
        "amount": 0,
        "streaks": 0,
        "createdAt": "2022-05-05T19:54:49.326Z",
        "updatedAt": "2022-05-05T19:54:49.326Z",
        "publishedAt": "2022-05-05T19:54:49.326Z",
        "createdBy": "string or id",
        "updatedBy": "string or id"
    }
}).then(console.log)