// Load models
const TodayMatches = require("../models/today-matches");
const Fixtures = require("../models/fixtures");
const LatestScores = require('../models/latest-scores') 
const Matches = require("../models/matches");
const Standings = require("../models/standings");
const Summary = require("../models/summary");
const RefsStats = require("../models/refs-stats");
const RefsSummary = require("../models/refs-summary");

// Load constants
const leagues = require("../constants/leagues-list");
const champs = require("../constants/champ-list");
const flag_url = require("../constants/flag-url");
const statsPages = require("../constants/stats-pages");

// Middleware and utils
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-respons");
const {
  convert, convertStats, convertSelect, convertStatsSelect, activeMenu, splitMatches, createSummaryData,  topLeagues, createRefereesStatsData, createRefInfoData
} = require("../utils/response-dtos");


// @desc      Get main page
// @route     GET /
// @access    Private (except demo)
exports.getStatsPage  = asyncHandler(async (req, res, next) => {
  let pageData = {
    menu: statsPages.menu,
    data: statsPages.index,
    level: "index",
    top: topLeagues()
  } 
  const todayMatches = await TodayMatches.find()
  const fixtures = await Fixtures.find()
  
  res.render('main', {todayMatches, fixtures,  pageData});
});


// @desc      Get leagues summary page
// @route     GET /summary
// @access    Private (except demo)
exports.getSummaryPage  = asyncHandler(async (req, res, next) => {
  let pageData = {
    menu: statsPages.menu,
    data: statsPages.index,
    level: "summary",
  } 

  const summary = await Summary.find()
  const summaryData = createSummaryData(summary)

  res.render('summary', { summary, summaryData, pageData});
});

// @desc      Get referees stats page
// @route     GET /referees?name
// @access    Private (except demo)
exports.getRefereesPage  = asyncHandler(async (req, res, next) => {
  const refName  = req.query.name;
  let refereesStats, refStats, refInfo, query;
  let pageData = {
    menu: statsPages.menu,
    data: statsPages.index,
    level: refName? "refName" : "referee",
    top: topLeagues()
  } 

  if (refName) {
    query = {_id: 0, refsStats: {$elemMatch: {name: refName}}}
    refStats = await RefsStats.find({}, query)
    refInfo = createRefInfoData(refStats)
    res.render('refName', { refInfo, pageData});
  } else {
    refereesStats =  await RefsSummary.find()
    res.render('referees', { refereesStats, pageData});
  }
});

// @desc      Get stats page by league ID
// @route     GET /:country/:leagueId
// @access    Private (except demo)
exports.getLeagueStatsPage  = asyncHandler(async (req, res, next) => {
  const {country, leagueId} = req.params;
  const champ = champs.filter(champ=>champ.id===leagueId)[0]

  let table = null;
  let pageData = {
    menu: activeMenu(statsPages.menu, leagueId),
    data: statsPages[leagueId],
    level: "league"
  }
  const todayMatches = await TodayMatches.find({id:leagueId});
  const fixtures = await Fixtures.find({id:leagueId});
  const latestScores = await LatestScores.find({id:leagueId});

  if (champ.standings==="on") {
    const standings = await Standings.find({ 
      country: {'$regex': country, $options:'i'},
      id: leagueId 
    });

    table = {
      overall: standings[0].standings.overall,
      home: standings[0].standings.home,
      away: standings[0].standings.away,
      info: JSON.parse(standings[0].standings.info)
    }
  }

  res.render('league', {todayMatches, fixtures, latestScores, table, pageData, country, leagueId});
});

// @desc      Get MatchStats by ID Page 
// @route     GET /matchStats/:id
// @req.query select = [home_Team, away_Team, h2h]
//            stats = [cornerKicks, shotsOnGoal, yellowCards, ... etc ]
// @access    Private (except demo)
exports.getMatchStatsPage = asyncHandler(async (req, res, next) => {
  const { country, leagueId } = req.params;
  const { id, select, stats } = req.query;
  
  let query, filter_stats, summary=false, statistics;

  let pageData = {
    menu: activeMenu(statsPages.menu, leagueId),
    data: statsPages[leagueId],
    level: "match"
  }
  
  if (select) query = {_id: 0, matchId:1, matchInfo:1, matchStats: {$elemMatch: {statsFor: select}}}
  let result = await Matches.find({matchId:id}, query)
  
  if (!result.length) {
    return next(
      new ErrorResponse(`Statistics not found for match with ID: ${id} `, 404)
    );
  }

  // GET /matchStats/A5WasEE6?stats=cornerKicks&select=awayTeam
  if (select && stats) {statistics = convertStatsSelect(result, stats) }
  
  // GET /matchStats/A5WasEE6?stats=cornerKicks
  if (!select && stats) {statistics = convertStats(result, stats) }

  // GET /matchStats/A5WasEE6?select=awayTeam
  if (select && !stats) {statistics = convertSelect(result) }

  if (!select && !stats) {
    console.log("result",result[0].matchStats[0].matches[0])
    statistics = convert(result)
    summary=true
  }

  // console.log("statistics", statistics)
  res.render('matchStats', {
    leagueId,
    country,
    pageData, 
    flag_url,
    stats,
    data: {
      matchId: result[0].matchId, 
      matchInfo: result[0].matchInfo, 
      matchStats: statistics 
    },
    summary
  });
});


