import api from './api.js';

async function main() {
    try {
        let response = await api.GET({
            url: 'http://localhost:3000/',
            body: {},
        });
        console.log(response);
        // test register 
        console.log('testig register');
        response = await api.POST({
            url:'http://localhost:3000/register',
            body:{
                "login": "xxyaslam",
                "email": "xxyaslam@xxyaslam.com",
                "name": "xxyaslam",
                "password": "passwords1234",
            },         
        });
        console.log(response);
        console.log('testig login');
        response = await api.POST({
            url:'http://localhost:3000/login',
            body:{
                "email": "xxyaslam@xxyaslam.com",
                "password": "passwords1234",
            },
        });
        console.log(response);
        console.log('testing /profile');
        response = await api.GET({
            url:'http://localhost:3000/profile',
            body:{},         
        });
        console.log(response);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();