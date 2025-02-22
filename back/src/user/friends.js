const {prisma} = require('./db')


async function add_friend(request, reply){

        const {friendId} = request.body;
        const {userId} = request.user;

        if(userId == friendId)
            return reply.code(69).send({hahah:"wch nta hma9 baghi tzid rasek"});
        is_rquested = await prisma.friends.findFirst({
            where:{
                userId: userId,
                friendId: friendId,
            }
        });
        if(is_rquested)
            return reply.code(400).send({haha:'deja sifti ya zebi'});
        const friend_request = await prisma.friends.create({
            data:{
                userId : userId,
                friendId : friendId,
                accepted : false,
                date: Math.floor(Date.now()/1000),
            }
        });
        return reply.code(200).send({haha:'request tsiftat',friend_request});
}

async function friend_requests(request, reply ){
    const {userId} = request.user;
    const requests = await prisma.friends.findMany({
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

async  function list_requests(request,reply){
    const {userId} =  request.user;
    const requests = await prisma.friends.findMany({
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

async function  cancel_friend(request, reply){


}

async function remove_friend(request, reply){

}

async function list_friends(request, reply ){

}

async function accept_friend(request, reply ){
    const {userId} = request.user;
    const {friendId} = request.body;
    const accept = await prisma.friends.updateMany({
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

async function friends (request, reply){
    try{
        const {action} = request.params;
        switch(action){
            case 'add':
                return await add_friend(request,reply);
            case 'cancel':
                return await cancel_friend(request,reply);
            case 'remove':
                return await remove_friend(request,reply);
            case 'list':
                return await list_friends(request,reply);
            case 'requests':
                return await friend_requests(request,reply);
            case 'accept':
                    return await accept_friend(request,reply);
            case 'my_requests':
                    return await list_requests(request,reply);
            default:
                return reply.code(69).send({haha: "ka3ka3"});
        }


    } catch (err){
        console.error("error: ",err);
        return reply.code(222).send({err:"failed to add friend! :( "})
    }
}


module.exports = {friends}