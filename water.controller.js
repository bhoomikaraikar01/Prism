const WaterUsage = require('../models/WaterUsage');
const emailService = require('../services/email.service');

// @desc Log daily water usage for a household
// @route POST /api/water/log
exports.logUsage = async (req, res) => {
  try {
    const { household_id, ward_id, liters_used, limit_liters, contact_email } = req.body;
    const recorded_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
 
    let usage = await WaterUsage.findOne({ household_id, recorded_date });

    if (usage) {
      usage.liters_used += liters_used;
    } else {
      usage = new WaterUsage({ household_id, ward_id, liters_used, recorded_date, limit_liters: limit_liters || 150, reported_by: req.user?.id });
    }

    const limit = usage.limit_liters;

    // Trigger alert if limit exceeded and not already sent today
    if (usage.liters_used > limit && !usage.alert_sent && contact_email) {
      await emailService.sendWaterAlert(contact_email, household_id, usage.liters_used, limit);
      usage.alert_sent = true;
    }

    await usage.save();
    res.status(200).json({
      message: 'Usage logged',
      used: usage.liters_used,
      limit: usage.limit_liters,
      exceeded: usage.liters_used > usage.limit_liters
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get usage history for a household
// @route GET /api/water/:household_id
exports.getUsageHistory = async (req, res) => {
  try {
    const { household_id } = req.params;
    const history = await WaterUsage.find({ household_id }).sort({ recorded_date: -1 }).limit(30);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
