
const statsPages = require("../constants/stats-pages");

const resultObject = (match) => {
  console.log(match.homeTeamShortName)
  return {
    matchId: match.matchId,
    matchInfo: {
      country: match.country,
      flag:match.flag,
      league: match.league,
      status: match.status,
      fullDate: match.fullDate,
      matchDate: match.matchData,
      matchTime: match.matchTime,
      matchDate: match.matchData,
      matchTime: match.matchTime,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeTeamShortName: match.homeTeamShortName,
      awayTeamShortName: match.awayTeamShortName,
      match: `${match.homeTeam} - ${match.awayTeam}`,
      score: match.score,
      tooltip:match.tooltip,
    },
    stats: match.stats,
    summary: match.summary,
    odds:match.odds
  };
};


// Convert statistics object without select options
exports.convertAllStats = (matchStats, stats) => {
  return matchStats.map((select) => {
    return {
      [select.statsFor]: convertMatches(select.matches, stats),
    };
  });
};

// Convert statistics object with select options (homeTeam, awayTeam, h2h)
const resultObjectStatsSelect = (match, stats, selectTeam) => {
  let modifyStats;

  let compareHT = match.homeTeam.replace("*", '').trim()
  let compareAT = match.awayTeam.replace("*", '').trim()
  let compareST = selectTeam.replace("*", '').trim()

  // let compareHT = match.homeTeam.replace(/[^a-zа-яё\s]/gi, '').trim()
  // let compareAT = match.awayTeam.replace(/[^a-zа-яё\s]/gi, '').trim()
  // let compareST = selectTeam.replace(/[^a-zа-яё\s]/gi, '').trim()
  let compareH2H = compareST.split("   ")[0]
  let compareATh2H = compareST.split("   ")[1]
      
    if (compareHT=== compareST) {
       modifyStats = {
        match: {
          ...match.stats[stats].match, 
          selectTeam:match.stats[stats].match.homeTeam,
          opponent:match.stats[stats].match.awayTeam,
        },
        firstHalf: {
          ...match.stats[stats].firstHalf, 
          selectTeam:match.stats[stats].firstHalf.homeTeam,
          opponent:match.stats[stats].firstHalf.awayTeam,          
        },
        secondHalf: {
          ...match.stats[stats].secondHalf, 
          selectTeam:match.stats[stats].secondHalf.homeTeam,
          opponent:match.stats[stats].secondHalf.awayTeam,
        }
      }

     } else if (compareAT === compareST) {
      modifyStats = {
        match: {
          ...match.stats[stats].match, 
          selectTeam:match.stats[stats].match.awayTeam,
          opponent:match.stats[stats].match.homeTeam,
        },
        firstHalf: {
          ...match.stats[stats].firstHalf, 
          selectTeam:match.stats[stats].firstHalf.awayTeam,
          opponent:match.stats[stats].firstHalf.homeTeam,          
        },
        secondHalf: {
          ...match.stats[stats].secondHalf, 
          selectTeam:match.stats[stats].secondHalf.awayTeam,
          opponent:match.stats[stats].secondHalf.homeTeam,
        }
      }
     } else {

      if (compareHT=== compareH2H) {
        modifyStats = {
         match: {
           ...match.stats[stats].match, 
           [compareHT]:match.stats[stats].match.homeTeam,
           [compareAT]:match.stats[stats].match.awayTeam,
         },
         firstHalf: {
           ...match.stats[stats].firstHalf, 
           [compareHT]:match.stats[stats].firstHalf.homeTeam,
           [compareAT]:match.stats[stats].firstHalf.awayTeam,          
         },
         secondHalf: {
           ...match.stats[stats].secondHalf, 
           [compareHT]:match.stats[stats].secondHalf.homeTeam,
           [compareAT]:match.stats[stats].secondHalf.awayTeam,
         }
       }
 
      } else  {
        modifyStats = {
          match: {
            ...match.stats[stats].match, 
            [compareAT]:match.stats[stats].match.awayTeam,
            [compareHT]:match.stats[stats].match.homeTeam,
          },
          firstHalf: {
            ...match.stats[stats].firstHalf, 
            [compareAT]:match.stats[stats].firstHalf.awayTeam,
            [compareHT]:match.stats[stats].firstHalf.homeTeam,          
          },
          secondHalf: {
            ...match.stats[stats].secondHalf, 
            [compareAT]:match.stats[stats].secondHalf.awayTeam,
            [compareHT]:match.stats[stats].secondHalf.homeTeam,
          }
        }
       }
      //  modifyStats=match.stats[stats]
     }

      
  
  return {
    matchId: match.matchId,
    matchInfo: {
      country: match.country,
      flag:match.flag,
      league: match.league,
      status: match.status,
      fullDate: match.fullDate,
      matchDate: match.matchData,
      matchTime: match.matchTime,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      match: `${match.homeTeam} - ${match.awayTeam}`,
      score: match.score,
      tooltip:match.tooltip,
    },
    [stats]: modifyStats,
  };
};

exports.convertStatsSelect = (result, stats) => {
  const { matches } = result[0].matchStats[0];
  return matches.map((match,idx) => {
    return resultObjectStatsSelect(match, stats, idx);
  });
};


// Convert statistics object without select options
const convertMatches = (matches, stats, selectTeam) => {
  return matches.map((match) => {
    return resultObjectStatsSelect(match, stats, selectTeam);
  });
};

exports.convertStats = (result, stats) => {
  const matchStats = result[0].matchStats
  return matchStats.map((select) => {
    let selectTeam = select.title
    return {
      statsFor: select.statsFor,
      title: select.title,
      statsType: stats,
      matches: convertMatches(select.matches, stats, selectTeam),
    };
  });
};

// Convert all statistics object 
exports.convert = (result) => {
  const matchStats = result[0].matchStats
  return matchStats.map((select) => {
    
    return {
      statsFor: select.statsFor,
      title: select.title,
      matches: select.matches.map((match) => resultObject(match)),
    };
  });
};

exports.convertSelect = (result) => {
  const { matches } = result[0].matchStats[0];
  return matches.map((match) => {
    return resultObject(match);
  });
};

exports.activeMenu  = (menu, leagueId) => {
  let result = []

  for (let i=0; i<menu.length; i++){
    if (menu[i].submenu.filter(s=>s.id===leagueId).length>0) {
      result.unshift(menu[i])
    } else {
      result.push(menu[i])
    }
  }

  return result
};


exports.convertRefereeStats = (refData) => {
  return refData[0].refsStats[0];
};

exports.convertLegueReferes = (refData) => {
  return refData[0];
};

exports.convertAverageRefStats = (refData) => {
  return refData[0].refsStats;
};

// exports.splitMatches  = (nationalMatches) => {
//     // let result = []
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//     let date =new Date().getDate() + ' ' + monthNames[new Date().getMonth()]
//     let todayNational = []
//     let fixturesNational = []

//     nationalMatches.map(league=>{
//       let todayObj = { id: league.id,
//                   num: league.num,
//                   league: league.league,
//                   logo: league.logo,
//                   matches: league.matches.filter(f=>f.matchData===date)
//                 }
//       let fixturesObj = { id: league.id,
//         num: league.num,
//         league: league.league,
//         logo: league.logo,
//         matches: league.matches.filter(f=>f.matchData!==date)
//       }                     
//       if (todayObj.matches.length !== 0) todayNational.push(todayObj)
//       if (fixturesObj.matches.length !== 0) fixturesNational.push(fixturesObj)
//     })

//     return  [todayNational, fixturesNational]
// };


exports.topLeagues = () => {
  return [
    {...statsPages.dYlOSQOD, id:"dYlOSQOD"},
    {...statsPages.W6BOzpK2, id:"W6BOzpK2"},
    {...statsPages.QVmLl54o, id:"QVmLl54o"},
    {...statsPages.COuk57Ci, id:"COuk57Ci"},
    {...statsPages.KIShoMk3, id:"KIShoMk3"},
    {...statsPages.xGrwqq16, id:"xGrwqq16"},
  ]
}

exports.createSummaryData = (summary) => {
  const foulsSummary = summary.map(s=>{
    return {
      country:s.country,  
      league:s.league,
      num:s.num,
      penalties: s.champStats.penalties,
      fouls: s.champStats.fouls,
      yellowCards: s.champStats.yellowCards,
      redCards: s.champStats.redCards,
    }
  })
  const totalSummary = summary.map(s=>{
    return {
      country:s.country,  
      league:s.league,
      num:s.num,
      goals: s.champStats.goals,
      bothToScore: s.champStats.bothToScore,
      totalUnder: s.champStats.totalUnder,
      totalOver: s.champStats.totalOver,
    }
  })
  const otherSummary = summary.map(s=>{
    return {
      country:s.country,  
      league:s.league,
      num:s.num,
      cornerKicks: s.champStats.cornerKicks,
      shotsOnGoal: s.champStats.shotsOnGoal,
      goalAttempts: s.champStats.goalAttempts,      
      offsides: s.champStats.offsides,
    }
  })

  return {foulsSummary, totalSummary, otherSummary}
}



exports.createRefereesStatsData = (RefsStats) => {
  function sortRefStats(refStats) {
    function order( a, b ) {
      if ( a.countMatches < b.countMatches ) return 1;
      if ( a.countMatches > b.countMatches ) return -1;
      return 0;
    }
    return refStats.sort(order).filter(s=>s.countMatches > 9)
  }

  return RefsStats.map(champ=>{
    return {
      id: champ.id,
      country: champ.country,
      league: champ.league,
      refsStats: sortRefStats(champ.refsStats.map(ref=>{
        return {
          name: ref.name,
          countMatches: ref.countMatches,
          fouls: ref.average.fouls,
          yellowCards: ref.average.yellowCards,
          penalties: ref.average.penalties,
          redCards: ref.average.redCards,
        }
      }))
    }
  })

}
  

exports.createRefInfoData = (refStats) => {
  let season = {}
  let data = refStats.filter(ref=>ref.refsStats.length>0)[0].refsStats[0]
  
  function getAge(dateString) {
    let format = dateString.split("/")
    let today = new Date();
    let birthDate = new Date(`${format[2]}-${format[1]}-${format[0]}`);
    console.log("birthDate",birthDate)
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    console.log("age",age)
    return age;
  }

  data.matches.forEach(match=>{
    if (!season[match.season]) {
      season[match.season]=[match]
    }
    else {
      season[match.season].push(match)
    }
  })

  return {
    name: data.name, 
    country: data.country, 
    countMatches: data.countMatches, 
    fullName: data.fullName, 
    fotoUrl: data.fotoUrl, 
    birthDate: data.birthDate,
    age: getAge(data.birthDate),
    birthPlace: data.birthPlace,
    birthCountry: data.birthCountry,
    birthCountryFlag: data.birthCountryFlag,
    average: data.average, 
    matches: Object.values(season),
    nextMatch: data.nextMatch
  }
}