import connectToDatabase from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { isAuthenticated } from '@/utils/auth';
import { handleApiRequest, createResponse } from '@/utils/api';

// PUT /api/coupons/[id] - Update a coupon (admin only)
export async function PUT(request, { params }) {
  return handleApiRequest(async () => {
    const user = await isAuthenticated(request);
    
    if (!user.isAdmin) {
      throw new Error('Admin access required');
    }

    await connectToDatabase();

    const { id } = params;
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

    // Find and update the coupon
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Check if coupon code already exists (excluding current coupon)
    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findByCode(code);
      if (existingCoupon) {
        throw new Error('Coupon code already exists');
      }
    }

    // Update coupon fields
    coupon.code = code ? code.toUpperCase() : coupon.code;
    coupon.name = name || coupon.name;
    coupon.description = description || coupon.description;
    coupon.type = type || coupon.type;
    coupon.value = value !== undefined ? value : coupon.value;
    coupon.minimumOrderAmount = minimumOrderAmount !== undefined ? minimumOrderAmount : coupon.minimumOrderAmount;
    coupon.maximumDiscountAmount = maximumDiscountAmount !== undefined ? maximumDiscountAmount : coupon.maximumDiscountAmount;
    coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
    coupon.userUsageLimit = userUsageLimit !== undefined ? userUsageLimit : coupon.userUsageLimit;
    coupon.validFrom = validFrom ? new Date(validFrom) : coupon.validFrom;
    coupon.validUntil = validUntil ? new Date(validUntil) : coupon.validUntil;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
    coupon.applicableCategories = applicableCategories || coupon.applicableCategories;
    coupon.applicableProducts = applicableProducts || coupon.applicableProducts;
    coupon.excludedCategories = excludedCategories || coupon.excludedCategories;
    coupon.excludedProducts = excludedProducts || coupon.excludedProducts;

    await coupon.save();
    await coupon.populate('createdBy', 'name email');

    return createResponse(200, {
      coupon: {
        ...coupon.toObject(),
        isExpired: coupon.isExpired,
        hasReachedLimit: coupon.hasReachedLimit,
        isCurrentlyValid: coupon.isCurrentlyValid
      }
    }, 'Coupon updated successfully');
  }, 'PUT');
}

// DELETE /api/coupons/[id] - Delete a coupon (admin only)
export async function DELETE(request, { params }) {
  return handleApiRequest(async () => {
    const user = await isAuthenticated(request);
    
    if (!user.isAdmin) {
      throw new Error('Admin access required');
    }

    await connectToDatabase();

    const { id } = params;

    // Find and delete the coupon
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    return createResponse(200, null, 'Coupon deleted successfully');
  }, 'DELETE');
}