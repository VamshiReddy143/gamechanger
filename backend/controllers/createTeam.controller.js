const Team = require("../models/createteam.model");
const logger = require("../utils/logger");
const { validationResult } = require('express-validator');
const { APIError } = require('../utils/apiError');
const metrics = require('../utils/metrics');

/**
 * @desc    Create a new team
 * @route   POST /api/v1/teams
 * @access  Private
 */
const createTeam = async (req, res, next) => {
    const startTime = process.hrtime();
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new APIError('Validation Error', 400, errors.array());
        }

        const { sport, teamType, ageGroup, location, teamName, season } = req.body;

        const existingTeam = await Team.findOne({ teamName });
        if (existingTeam) {
            throw new APIError('Team with this name already exists', 409);
        }

        const team = await Team.create({
            sport,
            teamType,
            ageGroup,
            location,
            teamName,
            season,
            createdBy: req.user.id
        });

        logger.info(`Team created: ${teamName}`, { 
            teamId: team._id,
            userId: req.user.id 
        });

        metrics.increment('team.created');

        const responseTime = process.hrtime(startTime);
        const durationMs = responseTime[0] * 1000 + responseTime[1] / 1000000;
        metrics.teamCreationDuration.labels('create').observe(durationMs);

        return res.status(201).json({
            success: true,
            data: team,
            message: "Team created successfully"
        });

    } catch (error) {
        logger.error('Team creation failed', {
            error: error.message,
            stack: error.stack,
            body: req.body
        });

        metrics.increment('team.creation_error');

        next(error);
    }
};

/**
 * @desc    Get all teams with pagination and filtering
 * @route   GET /api/v1/teams
 * @access  Private
 */
const getTeams = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;

    const query = req.user?.organization ? { organization: req.user.organization } : {};
    
    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }


    const teams = await Team.find(query)
    .populate('createdBy', 'name')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .lean();

    const total = await Team.countDocuments(query);

    res.status(200).json({
      success: true,
      data: teams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch teams', {
      error: error.message,
      stack: error.stack,
      query: req.query
    });
    metrics.increment('team.fetch_error');
    next(error);
  }
};

/**
 * @desc    Get a single team by ID
 * @route   GET /api/v1/teams/:id
 * @access  Private
 */
const getTeamById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find team by ID with optional organization filter
        const query = { _id: id };
        if (req.user?.organization) {
            query.organization = req.user.organization;
        }

        const team = await Team.findOne(query).populate('createdBy', 'name').lean();

        if (!team) {
            throw new APIError('Team not found', 404);
        }

        logger.info(`Team fetched: ${team.teamName}`, { 
            teamId: id,
            userId: req.user.id 
        });

        metrics.increment('team.fetched');

        res.status(200).json({
            success: true,
            data: team,
            message: "Team fetched successfully"
        });
    } catch (error) {
        logger.error('Failed to fetch team by ID', {
            error: error.message,
            stack: error.stack,
            teamId: req.params.id
        });
        metrics.increment('team.fetch_by_id_error');
        next(error);
    }
};

module.exports = {
    createTeam,
    getTeams,
    getTeamById
};