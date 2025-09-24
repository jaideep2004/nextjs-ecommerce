import connectToDatabase from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { isAuthenticated } from '@/utils/auth';
import { handleApiRequest, createResponse } from '@/utils/api';

// POST /api/coupons/validate - Validate coupon for order
export async function POST(request) {
  return handleApiRequest(async () => {
    await connectToDatabase();

    const { code, orderAmount, cartItems } = await request.json();

    if (!code) {
      throw new Error('Coupon code is required');
    }

    if (!orderAmount || orderAmount <= 0) {
      throw new Error('Valid order amount is required');
    }

    // Find coupon by code
    const coupon = await Coupon.findByCode(code);
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    // Check if coupon is currently valid
    if (!coupon.isCurrentlyValid) {
      if (coupon.isExpired) {
        throw new Error('This coupon has expired');
      }
      if (coupon.hasReachedLimit) {
        throw new Error('This coupon has reached its usage limit');
      }
      if (!coupon.isActive) {
        throw new Error('This coupon is not active');
      }
      throw new Error('This coupon is not valid at this time');
    }

    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderAmount) {
      throw new Error(`Minimum order amount of $${coupon.minimumOrderAmount.toFixed(2)} is required`);
    }

    // Check if user can use this coupon (if authenticated)
    let userId = null;
    try {
      const user = await isAuthenticated(request, false); // Don't throw error if not authenticated
      userId = user?._id;
      
      if (userId && !coupon.canUserUse(userId)) {
        const userUsage = coupon.usedByUsers.find(usage => 
          usage.user.toString() === userId.toString()
        );
        const usedCount = userUsage?.usedCount || 0;
        throw new Error(`You have already used this coupon ${usedCount}/${coupon.userUsageLimit} times`);
      }
    } catch (error) {
      // If authentication fails, continue as guest
      if (error.message !== 'Not authenticated, no token') {
        throw error;
      }
    }

    // Calculate applicable amount for product/category restrictions
    let applicableAmount = orderAmount;
    
    if (coupon.applicableCategories.length > 0 || coupon.applicableProducts.length > 0) {
      // This would require cart items to check against specific categories/products
      // For now, we'll use the full order amount
      // TODO: Implement product/category filtering
    }

    if (coupon.excludedCategories.length > 0 || coupon.excludedProducts.length > 0) {
      // This would require cart items to exclude specific categories/products
      // TODO: Implement product/category filtering
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(orderAmount, applicableAmount);
    
    let freeShipping = false;
    if (coupon.type === 'free_shipping') {
      freeShipping = true;
    }

    return createResponse(200, {
      valid: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maximumDiscountAmount: coupon.maximumDiscountAmount
      },
      discount: {
        amount: discountAmount,
        freeShipping
      },
      message: `Coupon applied successfully! You save $${discountAmount.toFixed(2)}${freeShipping ? ' plus free shipping' : ''}`
    });

  }, 'POST');
}