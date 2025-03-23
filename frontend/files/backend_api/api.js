async function fetching(params) {
    try {
        const response = await fetch(params.url, {
            method: params.method,
            headers: params.headers,
            body: params.body,
        });
        return response.json();
    } catch (err) {
        console.log("error during fetch op !");
        console.log(err);
    }
}

class api {
    constructor() {}

    headers(params) {
        return {
            'Content-Type': 'application/json',
            '':''
        };
    }

    static async POST(params) {
        const instance = new api();
        const response = await fetching({
            url: params.url,
            method: 'POST',
            body: params.body,
            headers: instance.headers(params)
        });
        return response;
    }

    static async DELETE(params) {
        const instance = new api();
        const response = await fetching({
            url: params.url,
            method: 'DELETE',
            body: params.body,
            headers: instance.headers(params)
        });
        return response;
    }

    static async GET(params) {
        const instance = new api();
        const response = await fetching({
            url: params.url,
            method: 'GET',
            headers: instance.headers(params)
        });
        return response;
    }

    static async PUT(params) {
        const instance = new api();
        const response = await fetching({
            url: params.url,
            method: 'PUT',
            body: params.body,
            headers: instance.headers(params)
        });
        return response;
    }

    static async custom(params) {
        const instance = new api();
        const response = await fetching({
            url: params.url,
            method: params.method,
            body: params.body,
            headers: instance.headers(params)
        });
        return response;
    }

    static async upload() {
    }
}

export default api;