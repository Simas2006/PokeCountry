var flags = [
  `440440070`, // US
  `602602602`, // Germany
  `740740740`, // Russia
  `200000000`, // China
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`, // Vietnam
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`, // Vietnam
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`, // Vietnam
  `070777070`  // Switzerland
].map(item => item.split("").map(jtem => parseInt(jtem)));
var names =  ["USA","Germany","Russia","China","Canada","France","Belarus","Vietnam","Canada","France","Belarus","Vietnam","Canada","France","Belarus","Vietnam","Switzerland"];
var groups = [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,-1];
var moves = [
  {
    name: "WWI",
    power: [3,2,1,2],
    selfInflict: 0,
    missChance: 0.25,
    onUse: function(object,party,player) {}
  },
  {
    name: "WWII",
    power: [3,2,1,2],
    selfInflict: 0,
    missChance: 0.25,
    onUse: function(object,party,player) {}
  },
  {
    name: "DIVIDE",
    power: [3,2,1,2],
    selfInflict: 0.5,
    missChance: 0,
    onUse: function(object,party,player) {
      if ( party.length < 8 ) party.push(player);
      battleFreeze = true;
    }
  },
  {
    name: "EU",
    power: [2,3,1,2],
    selfInflict: 0,
    missChance: 0.33,
    onUse: function(object,party,player) {}
  },
  {
    name: "FREE FRANCE",
    power: [3,3,1,3],
    selfInflict: 0.25,
    missChance: 0.5,
    onUse: function(object,party,player) {}
  },
  {
    name: "GUILLOTINE",
    power: [3,1,1,1],
    selfInflict: 0,
    missChance: 0,
    onUse: function(object,party,player) {}
  },
  {
    name: "SURRENDER",
    power: [3,3,3,3],
    selfInflict: 1,
    missChance: 1,
    onUse: function(object,party,player) {}
  }
];
var initialBattleData = [
  {
    country: 0,
    visibleCountry: 0,
    faintedCountries: 0,
    active: -1,
    hp: [100],
    pp: [100,100,100,100],
    hexaballs: [0,0,0],
    party: [
      {
        country: 0,
        group: 1,
        moves: [
          [0,1],
          [1,2],
          [2,3],
          [3,4]
        ],
        hp: [100],
        pp: [100,100,100,100]
      }
    ]
  }
];
var maps = [
  `0000000000000000000000000
  0000000001111111000000000
  0000000014444444100000000
  0000000014444444100000000
  0000000014444444100000000
  0000000014444444100000000
  0000000014444444100000000
  0000000014444444100000000
  0000000001444441000000000
  0000000000144410000000000
  0000000000166610000000000
  0000000000144410000000000
  0000000000166610000000000
  0000000000144410000000000
  0000000011222331100000000
  0000000122222333310000000
  0000001222222333331000000
  0000001222222333331000000
  0011112222222333333111100
  0144444444444444444444410
  0144444444444444444444410
  0144444444444444444444410
  0144444444444444444444410
  0011115555555555555111100
  0000001555555555551000000
  0000001555555555551000000
  0000000155555555510000000
  0000000011550551100000000
  0000000000111110000000000
  0000000000000000000000000`,
  `000000000000000
  011111111111110
  012222232222210
  013333333333310
  012222222222210
  012222222222210
  012222222222210
  012222222222210
  012222222222210
  010222222222210
  011111111111110
  000000000000000`,
  `00000000000000000000
  02222222222222222220
  02222222222222222220
  02222222222222222220
  02222222222222222220
  02222222222222222220
  02222222222222222220
  02222222222222222220
  02222222222222222220
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  01111111111111111110
  03333333333333333330
  03333333333333333330
  03333333333333333330
  03333333333333333330
  03333333333333333330
  03333333333333333330
  03333333333333333330
  03333333333333333330
  00000000000000000000`,
  `00000000000000000000000000000000000000000000000000000000000000000000000000
  01111111111111111111111111111111111111111111111111111111111111111111111000
  01222222233323232333223332333233232232232222332223223332333232223332222100
  01222222223223232322223222232232332323232222323232322322232232223222222210
  01222222223223332333223322232232332323232222332232322322232232223332222210
  01222222223223232322223222232232332333232222323233322322232232223222222210
  01222222223223232333223222333232232323233322332232322322232233323332222100
  01111111111111111111111111111111111111111111111111111111111111111111111000
  00000000000000000000000000000000000000000000000000000000000000000000000000`
].map(item => item.split("\n").map(jtem => jtem.trim().split("").map(ktem => parseInt(ktem))));
var mapMetadata = [
  [
    {
      trainers: [],
      warps: [
        {
          world: 1,
          inloc: [12,27],
          outloc: [2,8],
          metaID: 0
        }
      ],
      tileData: {
        tileset: ["black","cyan","#80bfff","#ff6666","white","#ff6666","brown"],
        walls: [1,6]
      },
      onScreenObjects: {
        gym: {x: -1,y: -1},
        pc: {x: -1,y: -1}
      }
    },
    {
      trainers: [],
      warps: [
        {
          world: 1,
          inloc: [12,27],
          outloc: [2,8],
          metaID: 0
        }
      ],
      tileData: {
        tileset: ["black","yellow","black","black","#fdcf04","#ff6666","brown"],
        walls: [1,6]
      },
      onScreenObjects: {
        gym: {x: -1,y: -1},
        pc: {x: -1,y: -1}
      }
    },
  ],
  [
    {
      trainers: [],
      warps: [
        {
          world: 2,
          inloc: [2,9],
          outloc: [1,1],
          metaID: 0
        }
      ],
      tileData: {
        tileset: ["black","cyan","#80bfff","brown"],
        walls: [1,3]
      },
      onScreenObjects: {
        gym: {x: -1,y: -1},
        pc: {x: -1,y: -1}
      }
    },
  ],
  [
    {
      trainers: [
        {
          country: 0,
          x: 4,
          y: 4,
          direction: 0,
          colored: true,
          exists: true,
          battleData: {
            trigger: true,
            country: 0,
            visibleCountry: 0,
            faintedCountries: 0,
            active: -1,
            hp: [100],
            pp: [100,100,100,100],
            hexaballs: [0,0,0],
            party: [
              {
                country: 0,
                group: 1,
                moves: [
                  [0,1],
                  [1,2],
                  [2,3],
                  [3,4]
                ],
                hp: [100],
                pp: [100,100,100,100]
              }
            ],
            onDefeat: function() {
              console.log("here")
            }
          }
        }
      ],
      warps: [],
      tileData: {
        tileset: ["lightblue","green","white","#f1d2ab"],
        walls: [0]
      },
      onScreenObjects: {
        gym: {x: -1,y: -1},
        pc: {x: -1,y: -1}
      }
    },
  ],
  [
    {
      trainers: [
        {
          country: 0,
          x: 69,
          y: 4,
          direction: 0,
          colored: true,
          exists: true,
          battleData: {
            trigger: false
          },
          npcData: {
            trigger: false
          },
          enterBossFight: true
        }
      ],
      warps: [],
      tileData: {
        tileset: ["black","brown","black","white"],
        walls: [1]
      },
      onScreenObjects: {
        gym: {x: -1,y: -1},
        pc: {x: -1,y: -1}
      }
    }
  ]
];
var mapCheckTriggerMaps = [1,2];
