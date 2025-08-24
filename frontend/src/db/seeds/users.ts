import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            walletAddress: '0x742d35Cc6636C0532925a3b8D8C60d0356f48556',
            email: 'alice.crypto@protonmail.com',
            name: 'Alice Cipher',
            kycVerified: true,
            createdAt: new Date('2024-03-01T10:00:00Z').toISOString(),
            updatedAt: new Date('2024-03-01T10:00:00Z').toISOString(),
        },
        {
            walletAddress: '0x8ba1f109551bD432803012645Hac136c02BdF7c9',
            email: 'bob_builder@gmail.com',
            name: 'Bob Dex',
            kycVerified: false,
            createdAt: new Date('2024-02-15T11:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-15T11:00:00Z').toISOString(),
        },
        {
            walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            email: 'charlie.vortex@outlook.com',
            name: 'Charlie Vortex',
            kycVerified: true,
            createdAt: new Date('2024-01-20T12:00:00Z').toISOString(),
            updatedAt: new Date('2024-01-20T12:00:00Z').toISOString(),
        },
        {
            walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            email: 'defi_diana@yahoo.com',
            name: 'Diana Block',
            kycVerified: true,
            createdAt: new Date('2023-12-25T13:00:00Z').toISOString(),
            updatedAt: new Date('2023-12-25T13:00:00Z').toISOString(),
        },
        {
            walletAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
            email: 'ether_emily@web3.com',
            name: 'Emily Token',
            kycVerified: false,
            createdAt: new Date('2024-04-05T14:00:00Z').toISOString(),
            updatedAt: new Date('2024-04-05T14:00:00Z').toISOString(),
        },
        {
            walletAddress: '0xB6c4fC53B2D6A123E784a0c8b67C19D82F2D17F9',
            email: 'web3.frank@company.com',
            name: 'Frank Satoshi',
            kycVerified: true,
            createdAt: new Date('2024-03-10T15:00:00Z').toISOString(),
            updatedAt: new Date('2024-03-10T15:00:00Z').toISOString(),
        },
        {
            walletAddress: '0xEdA18f88Cc2D07C0F4F24c6Fb2D1E1FeC8B2C4F6',
            email: 'genesis.george@crypto.com',
            name: 'George Liquidity',
            kycVerified: false,
            createdAt: new Date('2024-02-28T16:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-28T16:00:00Z').toISOString(),
        },
        {
            walletAddress: '0xDc64a140Aa3A7F48d7c9c0F9aCb6E8cD00D3643C',
            email: 'hash_hanna@mail.eth',
            name: 'Hanna Yield',
            kycVerified: true,
            createdAt: new Date('2024-01-05T17:00:00Z').toISOString(),
            updatedAt: new Date('2024-01-05T17:00:00Z').toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});