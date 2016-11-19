export default function teamList () {
  return function() {  

    var abbreviations = {
      "GSW": "Golden State Warriors",
      "LAC": "Los Angeles Clippers",
      "LAL": "Los Angeles Lakers",
      "SAC": "Sacramento Kings",
      "PHX": "Phoenix Suns",
      "SAS": "San Antonio Spurs",
      "HOU": "Houston Rockets",
      "MEM": "Memphis Grizzlies",
      "DAL": "Dallas Mavericks",
      "NOP": "New Orleans Pelicans",
      "OKC": "Oklahoma City Thunder",
      "POR": "Portland Trailblazers",
      "UTA": "Utah Jazz",
      "DEN": "Denver Nuggets",
      "MIN": "Minnesota Timberwolves",
      "TOR": "Toronto Raptors",
      "BOS": "Boston Celtics",
      "NYK": "New York Knicks",
      "BKN": "Brooklyn Nets",
      "PHI": "Philadelphia 76ers",
      "CLE": "Cleveland Cavaliers",
      "CHI": "Chicago Bulls",
      "DET": "Detroit Pistons",
      "IND": "Indiana Pacers",
      "MIL": "Milwaukee Bucks",
      "ATL": "Atlanta Hawks",
      "CHA": "Charlotte Hornets",
      "ORL": "Orlando Magic",
      "WSH": "Washington Wizards",
      "MIA": "Miami Heat"

    }

    // var productList = [];

    // var addProduct = function(newObj) {
    //   productList.push(newObj);
    // };

    // var getProducts = function(){
    //   return productList;
    // };

    return {
      abbreviations: abbreviations
    }
  }
}

