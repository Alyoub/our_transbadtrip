import api from './api.js';

async function main() {
    try {
        const response = await api.POST({
            url: 'http://localhost:3000/',
            body: {},
        });

        console.log(response);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();