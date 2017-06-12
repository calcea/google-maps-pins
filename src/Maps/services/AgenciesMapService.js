/**
 * Created by george on 7/22/2016.
 */

var rawMarkers = {
    "subway": [
        {
            "latitude": 44.4339458,
            "longitude": 26.0351768
        }, {
            "latitude": 44.4343593,
            "longitude": 26.054056
        }
    ],
    "malls": [
        {
            "latitude": 44.4311601,
            "longitude": 26.053476
        }, {
            "latitude": 44.4285137,
            "longitude": 26.0353663
        }
    ]
};

var AgenciesMapService = function () {
    this.init();
};

AgenciesMapService.prototype.view = null;

AgenciesMapService.prototype.init = function(){
    this.view = new AgenciesMap(44.4600, 25.9733, rawMarkers);
};

var service = new AgenciesMapService();