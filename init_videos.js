import { client, path, getJwt } from './client.js';
// {
//     "name": "How not to take things personally?",
//     "url": "https://www.youtube.com/watch?v=LnJwH_PZXnM",
//     "mainCategory": "Emotional",
//     "tag1": "Resilience",
//     "tag2": "",
//     "tag3": ""
//   }
import videos_json from './data/videos.js'
import get_list from './get_example.js'

function request(resource, data) {
    return client.post(`${path}${resource}`, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`,
        },
    }).catch((e)=>{
        console.log(`request ${path}${resource} error`)
    })
}

const builder = ({ title, des, categories, tags, cdn_url, url, status }) => {
    return {
        "data": {
            "url": url,
            "title": title,
            "des": des,
            "category": categories, //["string or id","string or id"],
            "cdn_url": cdn_url,
            "status": status,
            "tags": tags, //["string or id","string or id"],
            "createdAt": new Date().toJSON(),
            "updatedAt": new Date().toJSON(),
            "createdBy": "1",
            "updatedBy": "1"
        }
    }
}

const setCategory = (categories) => {
    const dic = {}
    categories.map(({ id, attributes: { name } }) => {
        dic[name.trim()] = id
    })
    return (video) => {
        // video =  {mainCategory,name,tag1,tag2,tag3,url}
        // ==>
        // { title, des, categories, tags, cdn_url, url, status }
        const title = video.name
        const des = video.name
        let categories = []
        if (dic.hasOwnProperty(video.mainCategory.trim())) {
            categories.push(dic[video.mainCategory.trim()])
        } else {
            console.log("Can't find category for this vide : " + video.url)
        }
        const tags_str = [video.tag1, video.tag2, video.tag3]
        const cdn_url = ""
        const status = ""
        const url = video.url
        return { title, des, categories, cdn_url, url, status, tags_str }
    }
}

const setTag = (tags) => {
    const dic = {}
    tags.map(({ id, attributes: { name } }) => {
        dic[name.trim()] = id
    })

    return (video) => {
        // video =  { title, des, categories, cdn_url, url, status, tags_str }
        // ==>
        //          { title, des, categories,  cdn_url, url, status, tags}
        const tags = []
        Array.from([0, 1, 2]).forEach(i => {
            if (dic.hasOwnProperty(video.tags_str[i])) {
                tags.push(dic[video.tags_str[i]])
            }
        });
        video['tags'] = tags
        delete video['tags_str']
        return video
    }
}

const filterExistVideos = (existVideos) => {
    const dic = {}
    existVideos.map(({ id, attributes: { url } }) => {
        dic[url.trim()] = id
    })
    return (item) => {
        // video =  { title, des, categories,  cdn_url, url, status, tags}
        return !dic.hasOwnProperty(item.url.trim())
    }
}

Promise.all([
    get_list("categories"), get_list("tags"), get_list("videos")
]).then(([{ data: { data: categories } }, { data: { data: tags } }, { data: { data: videos } }]) => {
    const result = videos_json.filter(filterExistVideos(videos)).map(setCategory(categories)).map(setTag(tags))
    return result
}).then((data) => {
    const requests = data.map((params) => {
        request("videos", builder(params))
    })
    console.log("requests lenght: " + data.length)
    return Promise.all(requests)
})
