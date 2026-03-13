"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../src/lib/prisma");
async function main() {
    const adminPassword = await bcrypt_1.default.hash("Admin123!", 10);
    const userPassword = await bcrypt_1.default.hash("User123!", 10);
    await prisma_1.prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@gmail.com",
            password: adminPassword,
            role: "ADMIN"
        }
    });
    await prisma_1.prisma.user.create({
        data: {
            name: "User",
            email: "user@gmail.com",
            password: userPassword,
            role: "USER"
        }
    });
    console.log("Seed terminé ");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
