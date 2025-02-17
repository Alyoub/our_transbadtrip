const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// tips and tricks for using the prisma orm ==> https://www.paigeniedringhaus.com/blog/tips-and-tricks-for-using-the-prisma-orm
module.exports = {prisma}