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
    }

    return returnData;
});

app.controller('MainCtrl', function ($scope, WeatherApi) {
    $scope.Data = {};
    $scope.Data.unit = 'C';
    $scope.Data.sysChange = false;

    WeatherApi.getLoc()
              .success(function(data) {
                  $scope.Data.city = data.city;
                  $scope.Data.country = data.country;

                  WeatherApi.getWeatherInfo($scope.Data.city)
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
        $scope.Data.list = data.list;
        $scope.Data.list.map(function (item) {
            item.Fah = Math.round(item.temp.day * 9/5 +32);
            item.tmpDeg = Math.round(item.temp.day);
            return item;
        });
        $scope.Data.list.map(function (item) {
            var w = item.weather[0].main.toLowerCase();

            item.showCase = {
                'rain': false,
                'clear': false,
                'drizzle': false,
                'clouds': false,
                'snow': false,
                'thunderstorm': false
            };

            item.showCase[w] = true;

            return item.showCase;
        });
        console.log($scope.Data);
        return iconGen($scope.Data.list);
    }

    function iconGen(dayArr){
        //var w = w.toLowerCase();
        //console.log(w);
        dayArr.forEach(function (item) {
            var w = item.weather[0].main.toLowerCase();
            switch(w) {
                case 'drizzle':
                    addIcon(w);
                    break;
                case 'clouds':
                    addIcon(w)
                    break;
                case 'rain':
                    addIcon(w)
                    break;
                case 'snow':
                    addIcon(w)
                    break;
                case 'clear':
                    addIcon(w)
                    break;
                case 'thunderstorm':
                    addIcon(w)
                    break;
                default:
                    $('div.clouds').removeClass('hide');
                    break;
            }
        });
    }

    function addIcon(w) {
        //console.log(document.querySelectorAll('.' + w));
        /*$('div.row').delegate('div.' + w, 'click', function () {
         $(this).removeClass('hide');
         });*/
    }

    $scope.Data.sys = function(){
        if($scope.Data.sysChange){
            $scope.Data.unit ='C';
            $scope.Data.list.map(function (item) {
                return item.tmpDeg = Math.round(item.temp.day);
            });
            //$scope.Data.temp = $scope.Data.Cel;
            return $scope.Data.sysChange = false;
        }
        $scope.Data.unit ='F';
        $scope.Data.list.map(function (item) {
            return item.tmpDeg = item.Fah;
        });
        //$scope.Data.temp = $scope.Data.Fah;
        return $scope.Data.sysChange = true;
    }

    $scope.firstDay = function (item) {
        return item === $scope.Data.list[0];
    }

    $scope.remainDays = function (item) {
        return item !== $scope.Data.list[0];
    }
});
