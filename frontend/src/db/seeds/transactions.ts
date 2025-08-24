import { db } from '@/db';
import { transactions } from '@/db/schema';

async function main() {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

    const generateRandomHash = () => {
        let result = '0x';
        const characters = 'abcdef0123456789';
        for (let i = 0; i < 64; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const generateRandomDate = (start: Date, end: Date) => {
        const diff = end.getTime() - start.getTime();
        const newDate = new Date(start.getTime() + Math.random() * diff);
        return newDate.toISOString();
    };

    const sampleTransactions = [
        // User 1 - Active Lender
        {
            userId: 1,
            transactionType: 'borrow',
            amount: 5000.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 1,
            transactionType: 'borrow',
            amount: 2500.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 1,
            transactionType: 'repay',
            amount: 2500.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 1,
            transactionType: 'interest',
            amount: 50.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 1,
            transactionType: 'borrow',
            amount: 1000.00,
            transactionHash: generateRandomHash(),
            status: 'pending',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 1,
            transactionType: 'repay',
            amount: 3000.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 1,
            transactionType: 'interest',
            amount: 45.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },

        // User 2 - Moderate Lender
        {
            userId: 2,
            transactionType: 'borrow',
            amount: 1500.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 2,
            transactionType: 'repay',
            amount: 1000.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 2,
            transactionType: 'borrow',
            amount: 7000.00,
            transactionHash: generateRandomHash(),
            status: 'pending',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 2,
            transactionType: 'borrow',
            amount: 100.00,
            transactionHash: generateRandomHash(),
            status: 'failed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 2,
            transactionType: 'interest',
            amount: 25.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },

        // User 3 - New User
        {
            userId: 3,
            transactionType: 'borrow',
            amount: 300.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 3,
            transactionType: 'borrow',
            amount: 150.00,
            transactionHash: generateRandomHash(),
            status: 'pending',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 3,
            transactionType: 'repay',
            amount: 200.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },

        // User 4 - Irregular Activity
        {
            userId: 4,
            transactionType: 'borrow',
            amount: 25000.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 4,
            transactionType: 'repay',
            amount: 10000.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 4,
            transactionType: 'interest',
            amount: 500.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 4,
            transactionType: 'borrow',
            amount: 10.00,
            transactionHash: generateRandomHash(),
            status: 'failed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },

        // User 5 - Repay heavy
        {
            userId: 5,
            transactionType: 'borrow',
            amount: 800.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 5,
            transactionType: 'repay',
            amount: 500.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 5,
            transactionType: 'repay',
            amount: 300.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
        {
            userId: 5,
            transactionType: 'interest',
            amount: 10.00,
            transactionHash: generateRandomHash(),
            status: 'completed',
            createdAt: generateRandomDate(threeMonthsAgo, now),
        },
    ];

    await db.insert(transactions).values(sampleTransactions);

    console.log('✅ Transactions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});