import Api from './api';

async function main() {
    try {
        let response = await Api.GET({
            url: 'http://localhost:3000/',
            body: {},
        });
        console.log(response);
        
        // Test register
        console.log('Testing register');
        response = await Api.POST({
            url: 'http://localhost:3000/register',
            body: {
                "login": "xxyaslam",
                "email": "xxyaslam@xxyaslam.com",
                "name": "xxyaslam",
                "password": "passwords1234",
            },
        });
        console.log(response);

        // Test login
        console.log('Testing login');
        response = await Api.POST({
            url: 'http://localhost:3000/login',
            body: {
                "email": "rrakman@xxyaslam.com",
                "password": "passwords1234",
            },
        });
        console.log(response);

        // Test profile
        console.log('Testing /profile');
        response = await Api.GET({
            url: 'http://localhost:3000/profile',
            body: {},
        });
        console.log(response);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();