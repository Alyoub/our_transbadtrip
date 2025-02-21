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

async function  cancel_friend(request, reply){


}

async function remove_friend(request, reply){

}

async function list_friends(request, reply ){

}

async function accept_friend(request, reply ){
    const {userId} = request.user;
    const accept = await prisma.friendId.updateMany({
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

module.exports = {add_friend,remove_friend,list_friends,accept_friend,cancel_friend,friend_requests}