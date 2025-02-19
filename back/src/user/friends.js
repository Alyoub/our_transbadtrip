async function add_friend(request, reply,prisma){
    const {friendId,login} = request.body;
    userId = await prisma.findUnique({
        where:{
            login
        }
    });
    if(userId == friendId)
        return reply.code(69).send({hahah:"wch nta hma9 baghi tzid rasek"});
    try{

    } catch (err){

    }
}
async function  cancel_friend(request, reply,prisma){

}

async function remove_friend(request, reply,prisma){

}

async function list_friends(request, reply,prisma ){

}

async function accept_friend(request, reply,prisma ){

}
async function friend_requests(request, reply,prisma ){

}

module.exports = {add_friend,remove_friend,list_friends,accept_friend,cancel_friend,friend_requests}