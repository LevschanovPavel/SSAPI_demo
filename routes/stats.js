const express = require('express');
const {
  getStatsPage, getMatchStatsPage, getLeagueStatsPage, getSummaryPage, getRefereesPage
} = require('../controllers/stats');

const router = express.Router({ mergeParams: true });

// // const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin','user'));

router.get('/', getStatsPage);
router.get('/summary', getSummaryPage);
router.get('/referees', getRefereesPage);
router.get('/:country/:leagueId', getLeagueStatsPage);
router.get('/:country/:leagueId/match', getMatchStatsPage);


module.exports = router;  