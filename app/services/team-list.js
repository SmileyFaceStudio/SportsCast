export default function teamList () {
  return function() {  

    var abbreviations = [
      {name: "GSW", value: "Golden State Warriors"},
      {name: "LAC", value: "Los Angeles Clippers"},
      {name: "LAL", value: "Los Angeles Lakers"},
      {name: "SAC", value: "Sacramento Kings"},
      {name: "PHO", value: "Phoenix Suns"},
      {name: "SAN", value: "San Antonio Spurs"},
      {name: "HOU", value: "Houston Rockets"},
      {name: "MEM", value: "Memphis Grizzlies"},
      {name: "DAL", value: "Dallas Mavericks"},
      {name: "NOP", value: "New Orleans Pelicans"},
      {name: "OKC", value: "Oklahoma City Thunder"},
      {name: "POR", value: "Portland Trailblazers"},
      {name: "UTA", value: "Utah Jazz"},
      {name: "DEN", value: "Denver Nuggets"},
      {name: "MIN", value: "Minnesota Timberwolves"},
      {name: "TOR", value: "Toronto Raptors"},
      {name: "BOS", value: "Boston Celtics"},
      {name: "NYK", value: "New York Knicks"},
      {name: "BRO", value: "Brooklyn Nets"},
      {name: "PHI", value: "Philadelphia 76ers"},
      {name: "CLE", value: "Cleveland Cavaliers"},
      {name: "CHI", value: "Chicago Bulls"},
      {name: "DET", value: "Detroit Pistons"},
      {name: "IND", value: "Indiana Pacers"},
      {name: "MIL", value: "Milwaukee Bucks"},
      {name: "ATL", value: "Atlanta Hawks"},
      {name: "CHA", value: "Charlotte Hornets"},
      {name: "ORL", value: "Orlando Magic"},
      {name: "WSH", value: "Washington Wizards"},
      {name: "MIA", value: "Miami Heat"}

    ]

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

