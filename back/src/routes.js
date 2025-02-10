// https://fastify.dev/docs/latest/Reference/Routes/

const { request } = require("http");
const {db} = require("../src/db_connector")
async function routes(fastify,options){
    fastify.get('/',async (request,reply) => {
        return {
            trip:'bad'
        }
    })
    fastify.post('/register',async (request,reply) => {
        const {email , name,password} = request.body;
        if(!email || !name || !password){
            return reply.code(400).send({error:'3amar l9lawi azbi'});
        }
        try{
            await db.run("")// creat user in the database
        } catch (err){
            reply.code(400).send({error:"database error azbi"})
        }
    })
    fastify.post('/login',async (request,reply)=>{
        const {email,password} =  request.body;
        if(!email || !password ){
            return reply.code(300).send({error:"wach mrid fe karek"})
        }
        try{
            let exist ;
            await db.run("") // test id the user is exist in the databse 
            if(exist == "no user")
                return reply.code(494).send({error:"no user with this email"})
            else if (exist == "invalid pass")
                return reply.code(873).send({error:"pass ghalet !"})
            else if (exist == "zeb")
                return reply.code(666).send({error:"zeb"})

        } catch (err){
            reply.code(440).send({error:"bad trip azbi bad trip"})
        }
    })
}

// export default routes;

module.exports = routes