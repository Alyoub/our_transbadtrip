async function add_friend(request, reply,prisma){

        const {friendId} = request.body;
        const {userId} = request.user;

        userId = await prisma.user.findFirst({
        });
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

async function friend_requests(request, reply,prisma ){
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
    

    
}

async function  cancel_friend(request, reply,prisma){


}

async function remove_friend(request, reply,prisma){

}

async function list_friends(request, reply,prisma ){

}

async function accept_friend(request, reply,prisma ){

}

module.exports = {add_friend,remove_friend,list_friends,accept_friend,cancel_friend,friend_requests}