import axios from "axios"
let basePath = "https://strapiareit.azurewebsites.net/api/"
basePath = "http://localhost:1337/api/"

let jwt = null
export const doAuth = async () => {
    const response = await axios.post(`${basePath}auth/local`, {
        identifier: 'test@test.com',
        password: 'cC123456',
    })
    jwt = response.data.jwt
}

try {
    await doAuth()
} catch (e) {
    console.log(e)
}

export const getJwt = () => jwt
export const path = basePath
export const client = axios