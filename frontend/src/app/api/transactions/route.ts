import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, users } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const TRANSACTION_TYPES = ['borrow', 'repay', 'interest'] as const;
const TRANSACTION_STATUSES = ['pending', 'completed', 'failed'] as const;

function isValidTransactionType(type: string): type is typeof TRANSACTION_TYPES[number] {
  return TRANSACTION_TYPES.includes(type as any);
}

function isValidTransactionStatus(status: string): status is typeof TRANSACTION_STATUSES[number] {
  return TRANSACTION_STATUSES.includes(status as any);
}

function isValidTransactionHash(hash: string): boolean {
  // Web3 transaction hash format: 0x followed by 64 hexadecimal characters
  const web3HashRegex = /^0x[a-fA-F0-9]{64}$/;
  return web3HashRegex.test(hash);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const transaction = await db.select()
        .from(transactions)
        .where(eq(transactions.id, parseInt(id)))
        .limit(1);

      if (transaction.length === 0) {
        return NextResponse.json({ 
          error: 'Transaction not found' 
        }, { status: 404 });
      }

      return NextResponse.json(transaction[0], { status: 200 });
    }

    // List transactions with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userIdParam = searchParams.get('userId');
    const transactionType = searchParams.get('transactionType');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(transactions);
    const conditions = [];

    // Filter by userId
    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (!isNaN(userId)) {
        conditions.push(eq(transactions.userId, userId));
      }
    }

    // Filter by transactionType
    if (transactionType && isValidTransactionType(transactionType)) {
      conditions.push(eq(transactions.transactionType, transactionType));
    }

    // Filter by status
    if (status && isValidTransactionStatus(status)) {
      conditions.push(eq(transactions.status, status));
    }

    // Apply filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderFn = order === 'asc' ? asc : desc;
    if (sort === 'createdAt') {
      query = query.orderBy(orderFn(transactions.createdAt));
    } else if (sort === 'amount') {
      query = query.orderBy(orderFn(transactions.amount));
    } else {
      query = query.orderBy(orderFn(transactions.createdAt));
    }

    const results = await query.limit(limit).offset(offset);
    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, transactionType, amount, transactionHash, status } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!transactionType) {
      return NextResponse.json({ 
        error: "transactionType is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ 
        error: "amount is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!transactionHash) {
      return NextResponse.json({ 
        error: "transactionHash is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate field formats
    if (isNaN(parseInt(userId.toString()))) {
      return NextResponse.json({ 
        error: "userId must be a valid integer",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    if (!isValidTransactionType(transactionType)) {
      return NextResponse.json({ 
        error: `transactionType must be one of: ${TRANSACTION_TYPES.join(', ')}`,
        code: "INVALID_TRANSACTION_TYPE" 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        error: "amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (!isValidTransactionHash(transactionHash.trim())) {
      return NextResponse.json({ 
        error: "transactionHash must be a valid Web3 transaction hash (0x followed by 64 hex characters)",
        code: "INVALID_TRANSACTION_HASH" 
      }, { status: 400 });
    }

    if (status && !isValidTransactionStatus(status)) {
      return NextResponse.json({ 
        error: `status must be one of: ${TRANSACTION_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate userId exists
    const user = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId.toString())))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Check transaction hash uniqueness
    const existingTransaction = await db.select()
      .from(transactions)
      .where(eq(transactions.transactionHash, transactionHash.trim()))
      .limit(1);

    if (existingTransaction.length > 0) {
      return NextResponse.json({ 
        error: "Transaction hash already exists",
        code: "DUPLICATE_TRANSACTION_HASH" 
      }, { status: 400 });
    }

    // Create new transaction
    const newTransaction = await db.insert(transactions)
      .values({
        userId: parseInt(userId.toString()),
        transactionType: transactionType,
        amount: amount,
        transactionHash: transactionHash.trim(),
        status: status || 'pending',
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newTransaction[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if transaction exists
    const existingTransaction = await db.select()
      .from(transactions)
      .where(eq(transactions.id, parseInt(id)))
      .limit(1);

    if (existingTransaction.length === 0) {
      return NextResponse.json({ 
        error: 'Transaction not found' 
      }, { status: 404 });
    }

    const updates: any = {};

    // Validate and prepare updates
    if (body.userId !== undefined) {
      if (isNaN(parseInt(body.userId.toString()))) {
        return NextResponse.json({ 
          error: "userId must be a valid integer",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }

      // Validate userId exists
      const user = await db.select()
        .from(users)
        .where(eq(users.id, parseInt(body.userId.toString())))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json({ 
          error: "User not found",
          code: "USER_NOT_FOUND" 
        }, { status: 400 });
      }

      updates.userId = parseInt(body.userId.toString());
    }

    if (body.transactionType !== undefined) {
      if (!isValidTransactionType(body.transactionType)) {
        return NextResponse.json({ 
          error: `transactionType must be one of: ${TRANSACTION_TYPES.join(', ')}`,
          code: "INVALID_TRANSACTION_TYPE" 
        }, { status: 400 });
      }
      updates.transactionType = body.transactionType;
    }

    if (body.amount !== undefined) {
      if (typeof body.amount !== 'number' || body.amount <= 0) {
        return NextResponse.json({ 
          error: "amount must be a positive number",
          code: "INVALID_AMOUNT" 
        }, { status: 400 });
      }
      updates.amount = body.amount;
    }

    if (body.transactionHash !== undefined) {
      if (!isValidTransactionHash(body.transactionHash.trim())) {
        return NextResponse.json({ 
          error: "transactionHash must be a valid Web3 transaction hash (0x followed by 64 hex characters)",
          code: "INVALID_TRANSACTION_HASH" 
        }, { status: 400 });
      }

      // Check transaction hash uniqueness (excluding current record)
      const existingHash = await db.select()
        .from(transactions)
        .where(and(
          eq(transactions.transactionHash, body.transactionHash.trim()),
          eq(transactions.id, parseInt(id))
        ))
        .limit(1);

      if (existingHash.length === 0) {
        const duplicateHash = await db.select()
          .from(transactions)
          .where(eq(transactions.transactionHash, body.transactionHash.trim()))
          .limit(1);

        if (duplicateHash.length > 0) {
          return NextResponse.json({ 
            error: "Transaction hash already exists",
            code: "DUPLICATE_TRANSACTION_HASH" 
          }, { status: 400 });
        }
      }

      updates.transactionHash = body.transactionHash.trim();
    }

    if (body.status !== undefined) {
      if (!isValidTransactionStatus(body.status)) {
        return NextResponse.json({ 
          error: `status must be one of: ${TRANSACTION_STATUSES.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      updates.status = body.status;
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingTransaction[0], { status: 200 });
    }

    // Update transaction
    const updated = await db.update(transactions)
      .set(updates)
      .where(eq(transactions.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if transaction exists
    const existingTransaction = await db.select()
      .from(transactions)
      .where(eq(transactions.id, parseInt(id)))
      .limit(1);

    if (existingTransaction.length === 0) {
      return NextResponse.json({ 
        error: 'Transaction not found' 
      }, { status: 404 });
    }

    // Delete transaction
    const deleted = await db.delete(transactions)
      .where(eq(transactions.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Transaction deleted successfully',
      deleted: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}