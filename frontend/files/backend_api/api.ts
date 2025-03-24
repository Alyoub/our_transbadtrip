interface FetchParams {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    credentials?: RequestCredentials;
}

interface HeadersParams {
    authorization?: string;
}

class Api {
    constructor() {}

    headers(params: HeadersParams = {}): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'Authorization': params.authorization || '',
        };
    }

    getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }

    static async POST(params: FetchParams): Promise<any> {
        const instance = new Api();
        const response = await fetching({
            url: params.url,
            method: 'POST',
            body: params.body,
            headers: instance.headers({ authorization: `Bearer ${instance.getCookie('jwt')}` }),
            credentials: 'include'
        });
        return response;
    }

    static async DELETE(params: FetchParams): Promise<any> {
        const instance = new Api();
        const response = await fetching({
            url: params.url,
            method: 'DELETE',
            body: params.body,
            headers: instance.headers(params.headers),
            credentials: 'include'
        });
        return response;
    }

    static async GET(params: FetchParams): Promise<any> {
        const instance = new Api();
        const response = await fetching({
            url: params.url,
            method: 'GET',
            headers: instance.headers(params.headers),
            credentials: 'include'
        });
        return response;
    }

    static async PUT(params: FetchParams): Promise<any> {
        const instance = new Api();
        const response = await fetching({
            url: params.url,
            method: 'PUT',
            body: params.body,
            headers: instance.headers(params.headers),
            credentials: 'include'
        });
        return response;
    }

    static async custom(params: FetchParams): Promise<any> {
        const instance = new Api();
        const response = await fetching({
            url: params.url,
            method: params.method,
            body: params.body,
            headers: instance.headers(params.headers),
            credentials: 'include'
        });
        return response;
    }

    static async upload(): Promise<void> {
        // Implement upload functionality if needed
    }
}

async function fetching(params: FetchParams): Promise<any> {
    try {
        const response = await fetch(params.url, {
            method: params.method,
            headers: params.headers,
            body: JSON.stringify(params.body),
            credentials: params.credentials
        });
        return response.json();
    } catch (err) {
        console.log("error during fetch op !");
        console.log(err);
    }
}

export default Api;