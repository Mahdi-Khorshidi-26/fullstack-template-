export async function mutationPrismaHelper(prisma, model, method, args) {
  return await prisma[model][method](args);
}
