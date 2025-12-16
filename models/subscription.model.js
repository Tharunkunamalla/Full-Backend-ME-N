import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Service Name is required"],
      trim: true,
      maxLength: [100, "Service Name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: [0, "Price cannot be less than 0"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"],
      default: "INR",
      trim: true,
      maxLength: [10, "Currency cannot exceed 10 characters"],
    },
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: [true, "Frequency is required"],
    },
    category: {
      type: String,
      enum: ["entertainment", "productivity", "education", "health", "other"],
      required: [true, "Category is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "other"],
      required: [true, "Payment Method is required"],
    },
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start Date is required"],
      validate: {
        validator: (value) => {
          return value <= new Date();
        },
        message: "Start Date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      required: [true, "Renewal Date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal Date cannot be in the future",
      },
    },
  },
  {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

//Autp calculate renewal date if missing

//Auto calculate renewalDate based on frequency
subscriptionSchema.pre("save", function (next) {
  if (this.isModified("startDate") || this.isModified("frequency")) {
    let renewalDate = new Date(this.startDate);
    switch (this.frequency) {
      case "weekly":
        renewalDate.setDate(renewalDate.getDate() + 7);
        break;
      case "monthly":
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;
      case "yearly":
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        break;
      default:
        break;
    }
    this.renewalDate = renewalDate;

    //Auto-update the status if renewal date has passed
    if (this.renewalDate <= new Date()) {
      this.status = "expired";
    }
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
