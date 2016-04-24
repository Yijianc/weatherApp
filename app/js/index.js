/**
 * Created by Boyce on 2016/4/22.
 */

var app = angular.module('Weather', []);

app.factory('WeatherApi', function ($http) {
    var returnData = {};
    
    returnData.getLoc = function () {
        return $http.get('http://ipinfo.io/json');
    };

    returnData.getWeatherInfo = function (city) {
        var api = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=',
            units = '&units=metric',
            appid = '&appid=1b58b5fc13a2395ddc4c832486784ef0',
            cnt = '&cnt=' + 7;

        return $http.get(api +  city + cnt + units + appid);
    };

    return returnData;
});

app.controller('MainCtrl', function ($scope, WeatherApi) {
    $scope.Data = {};

    WeatherApi.getLoc()
              .success(function(data) {
                  WeatherApi.getWeatherInfo(data.city)
                            .success(function(data) {
                              currentWeather(data);
                          })
                            .error(function(error) {
                              console.log('error');
                          });
              })
              .error(function(error) {
             console.log('error');
         });

    function currentWeather(data) {
        $scope.Data.unit      = 'C';
        $scope.Data.sysChange = false;
        $scope.Data.city      = data.city.name;
        $scope.Data.country   = data.city.country;
        $scope.Data.list      = data.list;
        $scope.Data.list.map(function (item) {
            var w = item.weather[0].main.toLowerCase();

            item.showCase = {
                'rain'        : false,
                'clear'       : false,
                'drizzle'     : false,
                'clouds'      : false,
                'snow'        : false,
                'thunderstorm': false
            };

            item.showCase[w] = true;

            item.tmpDeg = Math.round(item.temp.day);
            item.Fah = Math.round(item.temp.day * 9/5 +32);

            return item;
        });
    }

    $scope.Data.sys = function(){
        if($scope.Data.sysChange){
            $scope.Data.unit ='C';

            $scope.Data.list.map(function (item) {
                return item.tmpDeg = Math.round(item.temp.day);
            });

            return $scope.Data.sysChange = false;
        }

        $scope.Data.unit ='F';
        $scope.Data.list.map(function (item) {
            return item.tmpDeg = item.Fah;
        });

        return $scope.Data.sysChange = true;
    };

    $scope.firstDay = function (item) {
        return item === $scope.Data.list[0];
    };

    $scope.remainDays = function (item) {
        return item !== $scope.Data.list[0];
    };

    $scope.update = function (city) {
        var city = angular.copy(city);
        WeatherApi.getWeatherInfo(city)
                  .success(function (data) {
                      console.log(data);
                      currentWeather(data);
                  })
                  .error(function (error) {
                      console.log('error');
                  });
        console.log($scope.Data);
    };

    console.log($scope.Data);
});