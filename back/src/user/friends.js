// const { CONSTRAINT } = require('sqlite3');


class handle_friends{
    constructor(request,reply,prisma){
        this.request = request;
        this.reply =  reply;
        this.prisma = prisma;
    }


    async handle_request(){
        try{
        const {action} = this.request.params;
        switch(action){
            case 'add':
                // add friend
                this.#add_friend();
            case 'cancel':
                // cancel friend request
            case 'remove':
                // remove friend 
            case 'list':
                // list friends
            case 'requests':
                // friend requests 
                this.#friend_requests();
            case 'accept':
                // accept friend request 
                this.#accept_friend();
            case 'my_requests':
                // list all the requests that i send 
                this.#list_requests();
            default:
                // error
                return this.reply.code(69).send({error:"zamel"})
        }

        
    } catch (err){
        console.error('error failed');
        return this.reply.code(500).send({error:"zeb"});
    }
    }

    async  #friend_requests(){
        const {userId} = this.request.user;
        const requests = await this.prisma.friends.findMany({
            where :{
                friendId : userId,
                accepted : false,
            },
            include:{
                user : true,
            },
        })
        if(!requests)
            return reply.code(777).send({haha:"zebiii "})
        return reply.code(200).send({yaslam:"tysrat",requests})
    }

    async #accept_friend(){
        const {userId} = this.request.user;
        const {friendId} = this.request.body;
        const accept = await this.prisma.friends.updateMany({
            where:{
                userId: friendId,
                friendId: userId,
                accepted: false,
            },
            data:{
                accepted: true,
                date: Math.floor(Date.now() / 1000),
            }
        })
        if(accept.count === 0)
            return reply.code(69).send({haha:"haha bad trip"});
        return reply.code(200).send({haha:"good trip yaslam"});
    }

    async #add_friend(){

        const {friendId} = this.request.body;
        const {userId} = this.request.user;

        if(userId === friendId)
            return reply.code(69).send({hahah:"wch nta hma9 baghi tzid rasek"});
        is_rquested = await this.prisma.friends.findFirst({
            where:{
                userId: userId,
                friendId: friendId,
            }
        });
        if(is_rquested)
            return reply.code(400).send({haha:'deja sifti ya zebi'});
        const friend_request = await this.prisma.friends.create({
            data:{
                userId : userId,
                friendId : friendId,
                accepted : false,
                date: Math.floor(Date.now()/1000),
            }
        });
        return reply.code(200).send({haha:'request tsiftat',friend_request});
    }


    async #list_requests(){
        const {userId} =  this.request.user;
        const requests = await this.prisma.friends.findMany({
            where :{
                userId : userId,
                accepted : false, 
            },
            include:{
                user : true,
            }
        })
        console.log("zeb",requests);
        return reply.code(69).send({
            haha: "zeb",
            requests,
        })
    
    }

    async  #cancel_friend(){


    }
    
    async  #remove_friend(){
    
    }
    
    async  #list_friends(){
    
    }
}



module.exports = {handle_friends}