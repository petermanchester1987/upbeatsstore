import { PrismaClient } from '../lib/generated/prisma';
import sampleData from "./sample-data";

async function main() {
    const prisma = new PrismaClient();
    
    // Clear existing data
    await prisma.product.deleteMany();
    
    
    // Create sample products
    await prisma.product.createMany({
        data: sampleData.products,
    });
    
    console.log("DB seeded successfully.");
}

main()