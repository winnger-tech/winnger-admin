const Driver = require('../models/Driver');
const Restaurant = require('../models/Restaurant');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const json2csv = require('json2csv').parse;

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check admin exists
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      drivers: {
        total: await Driver.countDocuments(),
        pending: await Driver.countDocuments({ status: 'pending' }),
        approved: await Driver.countDocuments({ status: 'approved' }),
        rejected: await Driver.countDocuments({ status: 'rejected' }),
        paymentCompleted: await Driver.countDocuments({ 'payment.status': 'completed' })
      },
      restaurants: {
        total: await Restaurant.countDocuments(),
        pending: await Restaurant.countDocuments({ status: 'pending' }),
        approved: await Restaurant.countDocuments({ status: 'approved' }),
        rejected: await Restaurant.countDocuments({ status: 'rejected' }),
        paymentCompleted: await Restaurant.countDocuments({ 'payment.status': 'completed' })
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all drivers with filters and pagination
// @route   GET /api/admin/drivers
// @access  Private/Admin
exports.getAllDrivers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build filter conditions
    const whereClause = {};
    if (req.query.status) {
      whereClause.status = req.query.status;
    }
    if (req.query.paymentStatus) {
      whereClause.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.startDate && req.query.endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
      };
    }

    // Get total count for pagination
    const total = await Driver.count({ where: whereClause });

    // Get drivers with pagination
    const drivers = await Driver.findAll({
      where: whereClause,
      attributes: { 
        exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] 
      },
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: drivers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all restaurants with filters and pagination
// @route   GET /api/admin/restaurants
// @access  Private/Admin
exports.getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build filter conditions
    const whereClause = {};
    if (req.query.status) {
      whereClause.status = req.query.status;
    }
    if (req.query.paymentStatus) {
      whereClause.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.startDate && req.query.endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
      };
    }

    // Get total count for pagination
    const total = await Restaurant.count({ where: whereClause });

    // Get restaurants with pagination
    const restaurants = await Restaurant.findAll({
      where: whereClause,
      attributes: { 
        exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] 
      },
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update driver status
// @route   PUT /api/admin/drivers/:id/status
// @access  Private/Admin
exports.updateDriverStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Update status
    driver.status = status;
    if (remarks) {
      driver.remarks = remarks;
    }
    await driver.save();

    // Send email notification
    const emailSubject = `Your Driver Application Status Update - ${status.toUpperCase()}`;
    const emailContent = `
      Dear ${driver.name},

      Your driver application status has been updated to: ${status.toUpperCase()}
      ${remarks ? `\nRemarks: ${remarks}` : ''}

      ${status === 'approved' ? 
        '\nCongratulations! You can now log in to your account and start accepting orders.' :
        status === 'rejected' ? 
        '\nWe regret to inform you that your application has been rejected. Please contact support for more information.' :
        '\nYour application is being reviewed. We will notify you of any updates.'}

      Best regards,
      PR Launch Team
    `;

    await sendEmail({
      email: driver.email,
      subject: emailSubject,
      message: emailContent
    });

    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update restaurant status
// @route   PUT /api/admin/restaurants/:id/status
// @access  Private/Admin
exports.updateRestaurantStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Update status
    restaurant.status = status;
    if (remarks) {
      restaurant.remarks = remarks;
    }
    await restaurant.save();

    // Send email notification
    const emailSubject = `Your Restaurant Application Status Update - ${status.toUpperCase()}`;
    const emailContent = `
      Dear ${restaurant.name},

      Your restaurant application status has been updated to: ${status.toUpperCase()}
      ${remarks ? `\nRemarks: ${remarks}` : ''}

      ${status === 'approved' ? 
        '\nCongratulations! You can now log in to your account and start managing your restaurant profile.' :
        status === 'rejected' ? 
        '\nWe regret to inform you that your application has been rejected. Please contact support for more information.' :
        '\nYour application is being reviewed. We will notify you of any updates.'}

      Best regards,
      PR Launch Team
    `;

    await sendEmail({
      email: restaurant.email,
      subject: emailSubject,
      message: emailContent
    });

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export data (CSV/Excel)
// @route   GET /api/admin/export
// @access  Private/Admin
exports.exportData = async (req, res) => {
  try {
    const { type, format = 'csv', status, paymentStatus, startDate, endDate } = req.query;

    if (!['drivers', 'restaurants'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid export type. Must be either drivers or restaurants'
      });
    }

    // Build filter conditions
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (paymentStatus) {
      whereClause.paymentStatus = paymentStatus;
    }
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get data
    const Model = type === 'drivers' ? Driver : Restaurant;
    const data = await Model.findAll({
      where: whereClause,
      attributes: { 
        exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] 
      },
      order: [['createdAt', 'DESC']]
    });

    // Format data for export
    const formattedData = data.map(item => ({
      ID: item.id,
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Status: item.status,
      'Payment Status': item.paymentStatus,
      'Created At': item.createdAt.toISOString().split('T')[0],
      'Updated At': item.updatedAt.toISOString().split('T')[0],
      ...(type === 'drivers' ? {
        'License Number': item.licenseNumber,
        'Vehicle Type': item.vehicleType
      } : {
        'Restaurant Type': item.restaurantType,
        'Cuisine Type': item.cuisineType,
        Address: item.address
      })
    }));

    if (format === 'excel') {
      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));

      // Add headers
      const headers = Object.keys(formattedData[0]);
      worksheet.addRow(headers);

      // Add data
      formattedData.forEach(item => {
        worksheet.addRow(Object.values(item));
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Set column widths
      worksheet.columns.forEach(column => {
        column.width = 15;
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${type}_${new Date().toISOString().split('T')[0]}.xlsx`
      );

      await workbook.xlsx.write(res);
      return;
    } else {
      // CSV export
      const csv = json2csv(formattedData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${type}_${new Date().toISOString().split('T')[0]}.csv`
      );
      res.send(csv);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
