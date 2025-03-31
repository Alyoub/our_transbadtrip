// const { compareSync } = require('bcrypt');
// const cookie = require('cookie-parser');

// https://stackoverflow.com/questions/57100826/how-to-use-reduce-to-iterate-an-array

async function get_tokens(rawcookie) {

    //// console.log("start parsing  yaslam ");
    let i = 0;
    const cookies = rawcookie.split(';').reduce((acc, cookie) => {
        // //// console.log('call n ' ,i);
        i++;

        // //// console.log('acc = ',acc ,' cookie = ', cookie);
        const [key, value] = cookie.split('=').map(c => c.trim());
        if (key && value) {
            acc[key] = value;
        }
        // //// console.log('after split ');
        // //// console.log(acc);
        return acc;
    },{});

    return cookies;
}
 
async function handel_cookies(request, reply) {
    try {
        if(!request.headers.cookie)
            return '';
        const rawcookie = request.headers.cookie;
        // //// console.log(rawcookie);
        const tokens = await get_tokens(rawcookie);
        request.cookies = {};
        request.cookies.jwt = tokens['jwt'] || '';
        

    } catch (err) {
        //// console.log(err);
        return reply.code(500).send({
            error: err,
            badtrip: 'hadchi makhdamch'
        });

    }
}


module.exports = { handel_cookies };