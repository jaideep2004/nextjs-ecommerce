import connectToDatabase from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { isAuthenticated } from '@/utils/auth';
import { handleApiRequest, createResponse } from '@/utils/api';

// GET /api/coupons - Get all coupons (admin only)
export async function GET(request) {
  return handleApiRequest(async () => {
    const user = await isAuthenticated(request);
    
    if (!user.isAdmin) {
      throw new Error('Admin access required');
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // all, active, inactive, expired

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    const now = new Date();
    switch (status) {
      case 'active':
        query.isActive = true;
        query.validFrom = { $lte: now };
        query.validUntil = { $gte: now };
        break;
      case 'inactive':
        query.isActive = false;
        break;
      case 'expired':
        query.validUntil = { $lt: now };
        break;
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Coupon.countDocuments(query)
    ]);

    return createResponse(200, {
      coupons: coupons.map(coupon => ({
        ...coupon.toObject(),
        isExpired: coupon.isExpired,
        hasReachedLimit: coupon.hasReachedLimit,
        isCurrentlyValid: coupon.isCurrentlyValid
      })),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  }, 'GET');
}

// POST /api/coupons - Create new coupon (admin only)
export async function POST(request) {
  return handleApiRequest(async () => {
    const user = await isAuthenticated(request);
    
    if (!user.isAdmin) {
      throw new Error('Admin access required');
    }

    await connectToDatabase();

    const data = await request.json();
    const {
      code,
      name,
      description,
      type,
      value,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      userUsageLimit,
      validFrom,
      validUntil,
      isActive,
      applicableCategories,
      applicableProducts,
      excludedCategories,
      excludedProducts
    } = data;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findByCode(code);
    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }

    // Create new coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      name,
      description,
      type,
      value,
      minimumOrderAmount: minimumOrderAmount || 0,
      maximumDiscountAmount: maximumDiscountAmount || null,
      usageLimit: usageLimit || null,
      userUsageLimit: userUsageLimit || 1,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      isActive: isActive !== false,
      applicableCategories: applicableCategories || [],
      applicableProducts: applicableProducts || [],
      excludedCategories: excludedCategories || [],
      excludedProducts: excludedProducts || [],
      createdBy: user._id
    });

    await coupon.populate('createdBy', 'name email');

    return createResponse(201, {
      coupon: {
        ...coupon.toObject(),
        isExpired: coupon.isExpired,
        hasReachedLimit: coupon.hasReachedLimit,
        isCurrentlyValid: coupon.isCurrentlyValid
      }
    }, 'Coupon created successfully');
  }, 'POST');
}