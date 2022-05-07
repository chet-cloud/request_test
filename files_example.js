import { client, path, getJwt } from './client.js';
import fs from 'fs'
import FormData from 'form-data';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);


function upload_request(filePath, name, jwt) {
    const url = `${path}upload`
    const form_data = new FormData();
    form_data.append("files", fs.createReadStream(filePath));
    form_data.append("fileInfo", JSON.stringify({
        name: name,
        caption: name,
        alternativeText: name
    }));
    const request_config = {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
            "Authorization": "Bearer " + jwt,
            ...form_data.getHeaders(),
        },
        data: form_data
    };
    return client.post(url, form_data, request_config);
}


upload_request('C:\\Users\\ChaoChen\\Downloads\\Display 3.mp4','bigfile', getJwt())
    .then((res) => {
        const response_example = [{
            "id": 5,
            "name": "test.zip",
            "alternativeText": "test.zip",
            "caption": "test",
            "width": null,
            "height": null,
            "formats": null,
            "hash": "test_4ffa179060",
            "ext": ".zip",
            "mime": "application/zip",
            "size": 211.02,
            "url": "https://arwebstore.blob.core.windows.net/wellness/assets/test_4ffa179060.zip",
            "previewUrl": null,
            "provider": "strapi-provider-upload-azure-storage",
            "provider_metadata": null,
            "createdAt": "2022-04-29T16:42:57.349Z",
            "updatedAt": "2022-04-29T16:42:57.349Z"
        }]
        console.log(JSON.stringify(res.data))
        return res.data
    }).catch((e) => {
        console.log("upload file exception" + e)
    }).then((data) => {
        const result = data.map((record) => {
            return client.delete(`${path}upload/files/${record.id}`, {
                headers: {
                    Authorization: `Bearer ${getJwt()}`,
                },
            });
        })
        return Promise.all(result)
    }).then((res) => {
        const result = res.map(d => d.data.id)
        console.log("deleted id of fils: " + result.join(","))
    })