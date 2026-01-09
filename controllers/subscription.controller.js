import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    console.time("mongo");
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    let workflowRunId;
    try {
      const result = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          "content-type": "application/json",
        },
        retries: 0,
      });
      workflowRunId = result.workflowRunId;
    } catch (error) {
      console.error("Failed to trigger workflow:", error);
      // Proceed without failing the request
    }

    console.timeEnd("mongo");

    res.status(201).json({success: true, data: {subscription, workflowRunId}});
  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({user: req.params.id});

    res.status(200).json({success: true, data: subscriptions});
  } catch (e) {
    next(e);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    // This might be an admin only route in real world
    const subscriptions = await Subscription.find();
    res.status(200).json({success: true, data: subscriptions});
  } catch (e) {
      next(e);
  }
}

export const getSubscriptionDetails = async (req, res, next) => {
  try {
      const subscription = await Subscription.findById(req.params.id);
      if(!subscription) {
          const error = new Error('Subscription not found');
          error.status = 404;
          throw error;
      }
       res.status(200).json({success: true, data: subscription});
  } catch (e) {
      next(e);
  }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({success: true, data: subscription});
    } catch (e) {
        next(e);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        
        if(!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({success: true, message: 'Subscription deleted successfully'});
    } catch (e) {
        next(e);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        
         if(!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        
        subscription.status = 'cancelled';
        await subscription.save();

        res.status(200).json({success: true, data: subscription, message: 'Subscription cancelled successfully'});
    } catch (e) {
        next(e);
    }
}

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const subscriptions = await Subscription.find({
            renewalDate: {
                $gte: new Date(),
                $lte: threeDaysFromNow
            },
            status: 'active'
        });

        res.status(200).json({success: true, data: subscriptions});
    } catch (e) {
        next(e);
    }
}
