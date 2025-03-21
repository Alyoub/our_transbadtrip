// https://codeculturepro.medium.com/implementing-google-login-in-a-node-js-application-b6fbd98ce5e
// https://github.com/atultyagi612/Google-Authentication-nodejs?tab=readme-ov-file
const axios = require('axios');

// https://medium.com/@dhananjay_yadav/implementing-google-authentication-with-react-js-and-node-js-f72e306f26c9

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = '';

// mohim kasni n9rah hadchi :
// https://github.com/fastify/fastify-cookie?tab=readme-ov-file#importing-serialize-and-parse
// https://www.npmjs.com/package/@fastify/passport
// https://camo.githubusercontent.com/f35bf5748b0b04ae72930beacbf93634ff1e0a8f31a1ac9d54b606ea88ba22c7/68747470733a2f2f6465762d746f2d75706c6f6164732e73332e616d617a6f6e6177732e636f6d2f75706c6f6164732f61727469636c65732f66697767796c74736578306a357872316c726f722e706e67
// https://github.com/atultyagi612/Google-Authentication-nodejs?tab=readme-ov-file#configure-passports-google-startegy

// https://fastify.dev/docs/latest/Reference/Hooks/

async function google_login_flow(request , reply){
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email` ;
    reply.redirect(url);
    
}

async function google_login_response(request,reply){
    const { code } = req.query;
    console.log(code);
    try {
        const {data} = await axios.post('https://oauth2.googleapis.com/token',{
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });
        console.log(data);
        const {access_token} = data;
        const {data:profile} = await axios.get('https://oauth2.googleapis.com/token',{
            headers: { Authorization: `Bearer ${access_token}` },
        });
        console.log(profile);
        reply.redirect('/');
    
    } catch (err) {
    console.log(err);
    reply.redirect('/');
    return reply.code(500).send({
        error: err,
        badtrip :"hadchi makhdamch"
    })
    }
    
}


module.exports =  {google_login_flow,google_login_response}
