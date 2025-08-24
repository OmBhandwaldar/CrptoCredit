import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { creditProfiles, users } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(creditProfiles)
        .where(eq(creditProfiles.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Credit profile not found' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const isOverdue = searchParams.get('isOverdue');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(creditProfiles);

    // Build filters
    const filters = [];
    
    if (userId) {
      filters.push(eq(creditProfiles.userId, parseInt(userId)));
    }
    
    if (isOverdue !== null && isOverdue !== undefined) {
      const overdueValue = isOverdue === 'true';
      filters.push(eq(creditProfiles.isOverdue, overdueValue));
    }

    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

    // Apply sorting
    const sortColumn = (creditProfiles as any)[sort] || creditProfiles.createdAt;
    query = order === 'asc' 
      ? query.orderBy(asc(sortColumn))
      : query.orderBy(desc(sortColumn));

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);
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
    
    // Validate required fields
    if (!body.userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!body.creditLimit) {
      return NextResponse.json({ 
        error: "creditLimit is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate creditLimit is positive
    if (body.creditLimit <= 0) {
      return NextResponse.json({ 
        error: "creditLimit must be a positive number",
        code: "INVALID_CREDIT_LIMIT" 
      }, { status: 400 });
    }

    // Validate borrowedAmount is non-negative
    const borrowedAmount = body.borrowedAmount || 0;
    if (borrowedAmount < 0) {
      return NextResponse.json({ 
        error: "borrowedAmount must be non-negative",
        code: "INVALID_BORROWED_AMOUNT" 
      }, { status: 400 });
    }

    // Validate userId references existing user
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(body.userId)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Calculate utilization percentage
    const utilizationPercentage = (borrowedAmount / body.creditLimit) * 100;

    // Prepare data with defaults and calculated fields
    const creditProfileData = {
      userId: parseInt(body.userId),
      creditLimit: body.creditLimit,
      borrowedAmount: borrowedAmount,
      utilizationPercentage: utilizationPercentage,
      dueDate: body.dueDate || null,
      isOverdue: body.isOverdue !== undefined ? body.isOverdue : false,
      usdcBalance: body.usdcBalance || 0,
      isConnected: body.isConnected !== undefined ? body.isConnected : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRecord = await db.insert(creditProfiles)
      .values(creditProfileData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
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
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(creditProfiles)
      .where(eq(creditProfiles.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Credit profile not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const currentRecord = existingRecord[0];

    // If userId is being updated, validate it exists
    if (body.userId && body.userId !== currentRecord.userId) {
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.id, parseInt(body.userId)))
        .limit(1);

      if (existingUser.length === 0) {
        return NextResponse.json({ 
          error: "User not found",
          code: "USER_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Validate creditLimit if provided
    if (body.creditLimit !== undefined && body.creditLimit <= 0) {
      return NextResponse.json({ 
        error: "creditLimit must be a positive number",
        code: "INVALID_CREDIT_LIMIT" 
      }, { status: 400 });
    }

    // Validate borrowedAmount if provided
    if (body.borrowedAmount !== undefined && body.borrowedAmount < 0) {
      return NextResponse.json({ 
        error: "borrowedAmount must be non-negative",
        code: "INVALID_BORROWED_AMOUNT" 
      }, { status: 400 });
    }

    // Prepare updates
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Copy valid fields from body
    if (body.userId !== undefined) updates.userId = parseInt(body.userId);
    if (body.creditLimit !== undefined) updates.creditLimit = body.creditLimit;
    if (body.borrowedAmount !== undefined) updates.borrowedAmount = body.borrowedAmount;
    if (body.dueDate !== undefined) updates.dueDate = body.dueDate;
    if (body.isOverdue !== undefined) updates.isOverdue = body.isOverdue;
    if (body.usdcBalance !== undefined) updates.usdcBalance = body.usdcBalance;
    if (body.isConnected !== undefined) updates.isConnected = body.isConnected;

    // Recalculate utilization percentage if creditLimit or borrowedAmount changed
    const newCreditLimit = updates.creditLimit || currentRecord.creditLimit;
    const newBorrowedAmount = updates.borrowedAmount !== undefined ? updates.borrowedAmount : currentRecord.borrowedAmount;
    
    if (updates.creditLimit !== undefined || updates.borrowedAmount !== undefined) {
      updates.utilizationPercentage = (newBorrowedAmount / newCreditLimit) * 100;
    }

    const updated = await db.update(creditProfiles)
      .set(updates)
      .where(eq(creditProfiles.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
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
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(creditProfiles)
      .where(eq(creditProfiles.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Credit profile not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(creditProfiles)
      .where(eq(creditProfiles.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Credit profile deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}