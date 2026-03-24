const Report = require('../models/Report');
const User = require('../models/User');
const crypto = require('crypto');
const { categorizeIssue } = require('../services/ai.service');
const { generateComplaintPDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../services/email.service');

// Utility logic for simple hash chaining (blockchain feature)
const generateHash = (data, prev_hash) => {
  return crypto.createHash('sha256').update(JSON.stringify(data) + prev_hash).digest('hex');
};

// @desc Create a new report
// @route POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { title, category, subcategory, description, location, ward_id, photos } = req.body;
    
    // Create initial status history entry
    const initialHistory = {
      status: 'REPORTED',
      actor_id: req.user.id,
      note: 'Issue reported by citizen',
      timestamp: new Date(),
      prev_hash: '0'
    };
    initialHistory.ledger_hash = generateHash(initialHistory, initialHistory.prev_hash);

    // Call AI Categorization Service
    const aiResult = await categorizeIssue(description);
    const finalCategory = category || aiResult.category;
    const finalSubcategory = subcategory || aiResult.subcategory;
    const urgency_score = aiResult.urgency;
    const sla_deadline = new Date(Date.now() + aiResult.sla_hours * 60 * 60 * 1000);


    const finalPhotos = (photos && Array.isArray(photos)) 
      ? photos.map(p => ({ url: p.url || p, type: 'before', uploaded_at: new Date() }))
      : [];

    const report = await Report.create({
      title,
      category: finalCategory,
      subcategory: finalSubcategory,
      ai_suggested_category: aiResult.category,
      urgency_score,
      sla_deadline,
      description,
      location,
      ward_id,
      photos: finalPhotos,
      created_by: req.user.id,
      status_history: [initialHistory]
    });

    // Auto-Generate Formal PDF & Send to Authority
    try {
      const dbUser = await User.findById(req.user.id);
      const userForPdf = dbUser || { name: 'CivicPulse Citizen' };
      const pdfBuffer = await generateComplaintPDF(report, userForPdf);
      
      let authorityEmail = "hdmc@karnataka.gov.in";
      if (finalCategory.includes('Water')) authorityEmail = "water@hdmc.gov.in";
      if (finalCategory.includes('Garbage') || finalCategory.includes('Waste')) authorityEmail = "sanitation@hdmc.gov.in";
      if (finalCategory.includes('Power')) authorityEmail = "hescom@karnataka.gov.in";

      await sendEmail({
        to: process.env.CORPORATOR_DEMO_EMAIL || authorityEmail,
        subject: `Official Complaint Lodged - CP-${report._id.toString().slice(-6).toUpperCase()}`,
        html: `
          <h2>CivicPulse Automated Legal Escalation</h2>
          <p>A new citizen complaint has been formally registered in Ward ${ward_id || '14'}.</p>
          <p>Please find the attached formal legal complaint document generated securely by the CivicPulse Immutable Ledger.</p>
          <p><strong>Status:</strong> Officially Registered & Time-Stamped</p>
        `,
        attachments: [{ filename: `CivicPulse_Complaint_${report._id}.pdf`, content: pdfBuffer }]
      });
    } catch (pdfErr) {
      console.error('Failed to generate/send PDF on report creation:', pdfErr.message);
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get all reports (with optional filters)
// @route GET /api/reports
exports.getReports = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.ward_id) filters.ward_id = req.query.ward_id;
    if (req.query.category) filters.category = req.query.category;

    const reports = await Report.find(filters).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get single report
// @route GET /api/reports/:id
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('created_by', 'name role')
      .populate('field_officer_id', 'name mobile')
      .populate('status_history.actor_id', 'name role');

    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Update report status
// @route PATCH /api/reports/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, note, photos } = req.body;
    const report = await Report.findById(req.params.id);
    
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    const prevHistory = report.status_history[report.status_history.length - 1];
    
    const newHistory = {
      status,
      actor_id: req.user.id,
      note,
      timestamp: new Date(),
      prev_hash: prevHistory.ledger_hash
    };
    newHistory.ledger_hash = generateHash(newHistory, newHistory.prev_hash);

    report.status = status;
    report.status_history.push(newHistory);
    
    
    if (photos && Array.isArray(photos)) {
      const typedPhotos = photos.map(p => ({
        url: p.url || p, // handle both object and string
        type: (status === 'RESOLVED') ? 'after' : 'before',
        uploaded_at: new Date()
      }));
      report.photos.push(...typedPhotos);
    }
    
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Upvote a report
// @route PATCH /api/reports/:id/upvote
exports.upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Check if user already upvoted
    if (report.upvoted_by.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already upvoted this report' });
    }

    report.upvoted_by.push(req.user.id);
    report.upvotes += 1;

    // High Priority flag functionality
    if (report.upvotes > 10 && report.urgency_score < 7) {
        report.urgency_score += 2; // Bump urgency based on community demand
        
        // Ledger entry for transparency
        const prevHistory = report.status_history[report.status_history.length - 1];
        const newHistory = {
          status: report.status,
          note: 'Community Escalation: Upvote threshold reached.',
          timestamp: new Date(),
          prev_hash: prevHistory.ledger_hash
        };
        newHistory.ledger_hash = generateHash(newHistory, newHistory.prev_hash);
        report.status_history.push(newHistory);
    }

    await report.save();
    res.json({ message: 'Upvoted successfully', upvotes: report.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Download formal PDF
// @route GET /api/reports/:id/pdf
exports.downloadReportPDF = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    // Fetch user for name, fallback to generic if deleted
    const user = await User.findById(report.created_by) || { name: 'CivicPulse Citizen' };
    
    const pdfBuffer = await generateComplaintPDF(report, user);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Formal_Complaint_CP-${report._id.toString().slice(-6).toUpperCase()}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating PDF', error: error.message });
  }
};
// @desc Get current user's reports
// @route GET /api/reports/me
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ created_by: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
