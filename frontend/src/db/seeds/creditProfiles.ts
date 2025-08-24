import { db } from '@/db';
import { creditProfiles } from '@/db/schema';

async function main() {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 15); // 15 days in the future
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 10); // 10 days in the past

    const sampleCreditProfiles = [
        // User 1: Low risk, connected, current loan
        {
            userId: 1,
            creditLimit: 20000.00,
            borrowedAmount: 4000.00,
            utilizationPercentage: (4000 / 20000) * 100,
            dueDate: futureDate.toISOString().split('T')[0],
            isOverdue: false,
            usdcBalance: 15000.00,
            isConnected: true,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-06-01').toISOString(),
        },
        // User 2: Medium risk, connected, current loan
        {
            userId: 2,
            creditLimit: 10000.00,
            borrowedAmount: 5000.00,
            utilizationPercentage: (5000 / 10000) * 100,
            dueDate: futureDate.toISOString().split('T')[0],
            isOverdue: false,
            usdcBalance: 7500.00,
            isConnected: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-06-05').toISOString(),
        },
        // User 3: High risk, connected, overdue loan
        {
            userId: 3,
            creditLimit: 5000.00,
            borrowedAmount: 4500.00,
            utilizationPercentage: (4500 / 5000) * 100,
            dueDate: pastDate.toISOString().split('T')[0],
            isOverdue: true,
            usdcBalance: 1200.00,
            isConnected: true,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-05-28').toISOString(),
        },
        // User 4: Low risk, connected, no borrowed amount
        {
            userId: 4,
            creditLimit: 50000.00,
            borrowedAmount: 0.00,
            utilizationPercentage: 0,
            dueDate: null,
            isOverdue: false,
            usdcBalance: 40000.00,
            isConnected: true,
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-06-01').toISOString(),
        },
        // User 5: Medium risk, not connected, current loan
        {
            userId: 5,
            creditLimit: 15000.00,
            borrowedAmount: 7500.00,
            utilizationPercentage: (7500 / 15000) * 100,
            dueDate: futureDate.toISOString().split('T')[0],
            isOverdue: false,
            usdcBalance: 3000.00,
            isConnected: false,
            createdAt: new Date('2024-03-01').toISOString(),
            updatedAt: new Date('2024-06-03').toISOString(),
        },
        // User 6: High risk, connected, very high utilization, overdue loan
        {
            userId: 6,
            creditLimit: 8000.00,
            borrowedAmount: 7200.00,
            utilizationPercentage: (7200 / 8000) * 100,
            dueDate: pastDate.toISOString().split('T')[0],
            isOverdue: true,
            usdcBalance: 800.00,
            isConnected: true,
            createdAt: new Date('2024-03-15').toISOString(),
            updatedAt: new Date('2024-05-29').toISOString(),
        },
        // User 7: Experienced user, high limit, low utilization, connected
        {
            userId: 7,
            creditLimit: 100000.00,
            borrowedAmount: 20000.00,
            utilizationPercentage: (20000 / 100000) * 100,
            dueDate: futureDate.toISOString().split('T')[0],
            isOverdue: false,
            usdcBalance: 50000.00,
            isConnected: true,
            createdAt: new Date('2023-11-01').toISOString(),
            updatedAt: new Date('2024-06-04').toISOString(),
        },
        // User 8: New user, small limit, not connected, no loan
        {
            userId: 8,
            creditLimit: 5000.00,
            borrowedAmount: 0.00,
            utilizationPercentage: 0,
            dueDate: null,
            isOverdue: false,
            usdcBalance: 500.00,
            isConnected: false,
            createdAt: new Date('2024-05-01').toISOString(),
            updatedAt: new Date('2024-05-01').toISOString(),
        },
    ];

    await db.insert(creditProfiles).values(sampleCreditProfiles);

    console.log('✅ CreditProfiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});