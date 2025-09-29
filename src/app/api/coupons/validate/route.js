import connectToDatabase from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { isAuthenticated } from '@/utils/auth';
import { handleApiRequest, createResponse } from '@/utils/api';

// POST /api/coupons/validate - Validate coupon for order
export async function POST(request) {
  return handleApiRequest(request, async () => {
    await connectToDatabase();

    const { code, orderAmount, cartItems } = await request.json();
    console.log('Coupon validation request:', { code, orderAmount, cartItems });

    if (!code) {
      throw new Error('Coupon code is required');
    }

    // Ensure code is uppercase for consistent lookup
    const couponCode = code.toUpperCase().trim();
    console.log('Processing coupon code:', couponCode);

    if (!orderAmount || orderAmount <= 0) {
      throw new Error('Valid order amount is required');
    }

    // Find coupon by code
    const coupon = await Coupon.findByCode(couponCode);
    console.log('Found coupon:', coupon);
    
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    // Check if coupon is currently valid
    console.log('Coupon validity check:', {
      isActive: coupon.isActive,
      isExpired: coupon.isExpired,
      hasReachedLimit: coupon.hasReachedLimit,
      isCurrentlyValid: coupon.isCurrentlyValid,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      now: new Date()
    });
    
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
      const user = await isAuthenticated(request);
      userId = user?._id;
      
      if (userId && !coupon.canUserUse(userId)) {
        const userUsage = coupon.usedByUsers.find(usage => 
          usage.user.toString() === userId.toString()
        );
        const usedCount = userUsage?.usedCount || 0;
        throw new Error(`You have already used this coupon ${usedCount}/${coupon.userUsageLimit} times`);
      }
    } catch (error) {
      // If authentication fails, continue as guest (non-authenticated user)
      // This is expected behavior for guest users trying to apply coupons
      if (error.message !== 'Not authenticated, no token' && error.message !== 'Authentication failed') {
        throw error;
      }
      // For guests, userId remains null and we continue with coupon validation
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
        _id: coupon._id,
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