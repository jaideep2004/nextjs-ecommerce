import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxLength: [20, 'Coupon code must be less than 20 characters'],
    minLength: [3, 'Coupon code must be at least 3 characters']
  },
  name: {
    type: String,
    required: [true, 'Coupon name is required'],
    trim: true,
    maxLength: [100, 'Coupon name must be less than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description must be less than 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: ['percentage', 'fixed', 'free_shipping'],
    default: 'percentage'
  },
  value: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive'],
    validate: {
      validator: function(value) {
        if (this.type === 'percentage') {
          return value >= 1 && value <= 100;
        }
        return value >= 0;
      },
      message: 'Percentage discount must be between 1-100%, fixed amount must be positive'
    }
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount must be positive']
  },
  maximumDiscountAmount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount amount must be positive']
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  userUsageLimit: {
    type: Number,
    default: 1,
    min: [1, 'User usage limit must be at least 1']
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required'],
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
    validate: {
      validator: function(date) {
        return date > this.validFrom;
      },
      message: 'Valid until date must be after valid from date'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  usedByUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    usedCount: {
      type: Number,
      default: 1,
      min: 1
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ createdBy: 1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return this.validUntil < new Date();
});

// Virtual for checking if coupon has reached usage limit
couponSchema.virtual('hasReachedLimit').get(function() {
  return this.usageLimit && this.usageCount >= this.usageLimit;
});

// Virtual for checking if coupon is currently valid
couponSchema.virtual('isCurrentlyValid').get(function() {
  const now = new Date();
  return this.isActive && !this.isExpired && !this.hasReachedLimit && 
         this.validFrom <= now && this.validUntil >= now;
});

// Method to check if user can use this coupon
couponSchema.methods.canUserUse = function(userId) {
  if (!this.isCurrentlyValid) return false;
  
  const userUsage = this.usedByUsers.find(usage => usage.user.toString() === userId.toString());
  if (!userUsage) return true;
  
  return userUsage.usedCount < this.userUsageLimit;
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount, applicableAmount = null) {
  if (!this.isCurrentlyValid) return 0;
  if (orderAmount < this.minimumOrderAmount) return 0;
  
  const baseAmount = applicableAmount || orderAmount;
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = baseAmount * (this.value / 100);
      break;
    case 'fixed':
      discount = Math.min(this.value, baseAmount);
      break;
    case 'free_shipping':
      discount = 0; // Handled separately in shipping calculation
      break;
  }
  
  // Apply maximum discount limit if set
  if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
    discount = this.maximumDiscountAmount;
  }
  
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Method to apply coupon (increment usage)
couponSchema.methods.applyCoupon = async function(userId) {
  if (!this.canUserUse(userId)) {
    throw new Error('Coupon cannot be used by this user');
  }
  
  // Increment total usage count
  this.usageCount += 1;
  
  // Update user usage
  const userUsage = this.usedByUsers.find(usage => usage.user.toString() === userId.toString());
  if (userUsage) {
    userUsage.usedCount += 1;
    userUsage.lastUsed = new Date();
  } else {
    this.usedByUsers.push({
      user: userId,
      usedCount: 1,
      lastUsed: new Date()
    });
  }
  
  await this.save();
};

// Static method to find valid coupons
couponSchema.statics.findValidCoupons = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $or: [
      { usageLimit: null },
      { $expr: { $lt: ['$usageCount', '$usageLimit'] } }
    ]
  });
};

// Static method to find coupon by code
couponSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
