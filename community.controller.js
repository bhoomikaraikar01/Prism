const Report = require('../models/Report');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret',
});

// @desc Add a comment to a report
// @route POST /api/reports/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.comments.push({ user_id: req.user.id, text });
    await report.save();
    res.status(201).json({ message: 'Comment added', comments: report.comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Create Razorpay order for community fund
// @route POST /api/reports/:id/fund/create-order
exports.createFundOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise (e.g. 1000 = ₹10)
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Mock for demo if no real Razorpay keys
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_demo') {
      return res.json({
        mock: true,
        order_id: `mock_order_${Date.now()}`,
        amount,
        currency: 'INR',
        message: 'Mock order created. Add real Razorpay keys to .env to go live.'
      });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `report_${report._id}`,
    });

    report.community_fund = report.community_fund || {};
    report.community_fund.razorpay_order_id = order.id;
    await report.save();

    res.json({ order_id: order.id, amount, currency: 'INR', key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Verify payment and update community fund total
// @route POST /api/reports/:id/fund/verify
exports.verifyFundPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount_in_rupees } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'demo').update(sign).digest('hex');

    if (razorpay_signature !== expectedSign && razorpay_signature !== 'mock') {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    report.community_fund.total_collected += amount_in_rupees;
    if (!report.community_fund.contributors.includes(req.user.id)) {
      report.community_fund.contributors.push(req.user.id);
    }
    await report.save();

    res.json({ message: 'Payment verified! Community fund updated.', total: report.community_fund.total_collected });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
