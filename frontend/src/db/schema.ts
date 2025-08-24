import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  walletAddress: text('wallet_address').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  kycVerified: integer('kyc_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const creditProfiles = sqliteTable('credit_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  creditLimit: real('credit_limit').notNull(),
  borrowedAmount: real('borrowed_amount').default(0),
  utilizationPercentage: real('utilization_percentage').default(0),
  dueDate: text('due_date'),
  isOverdue: integer('is_overdue', { mode: 'boolean' }).default(false),
  usdcBalance: real('usdc_balance').default(0),
  isConnected: integer('is_connected', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  transactionType: text('transaction_type').notNull(),
  amount: real('amount').notNull(),
  transactionHash: text('transaction_hash').notNull().unique(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull(),
});