(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [ {
            id: "station",
            dataType: tableau.dataTypeEnum.string
        },  {
            id: "pm2_5",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "pm10",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "time",
            dataType: tableau.dataTypeEnum.datetime
        }];

        var tableSchema = {
            id: "cameomotion",
            alias: "get pm25 data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
     console.log("=====PRINT=====");

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://iotai-dev.cameo.tw/api/v2/epa_station/aqi_prediction_jsonp?time=2021-01-08%2014:00&jsoncallback=myFunc", function(resp) {
            var feat = resp.data,
                tableData = [];

            console.log("=====PRINT2=====");
            console.log(feat);
            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "station": feat[i].station,
                    "pm2_5": feat[i].pm2_5,
                    "pm10": feat[i].pm10,
                    "time": new Date (feat[i].date.local)
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "CameoMotion"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
