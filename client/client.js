var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl:'views/login.html',
            controller: 'MainController'
        })
        .when('/index', {
            templateUrl:'views/index.html',
            controller: 'signupCtrl'
        })
        .when('/gametime', {
            templateUrl:'views/gametime.html',
            controller: 'GameTime'
        })
        .when('/createplayer', {
            templateUrl:'views/createplayer.html',
            controller: 'CreatePlayer'
        })
        .when('/stats', {
        templateUrl:'views/stats.html',
        controller: 'statsController'
    });

    $locationProvider.html5Mode(true);
}]);

//Controller for User's login
app.controller('signupCtrl', ['$scope','$http', '$location', function($scope, $http, $location) {

    $scope.username = "";
    $scope.password = "";
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.email = "";

    $scope.signupSubmit = function(){
        $http.post('/newEntry', {username: $scope.username, password: $scope.password, firstname: $scope.firstname, lastname: $scope.lastname, email: $scope.email})
            .then(function(response){
            if(response.status === 200){
                //$location.path('/index');
                console.log('Registered successfully');
            } else {
                console.log("ERROR");
            }
        });
    };
}]);
//controller for login/
app.controller('MainController',['$scope', '$http','$location','pitchService', function($scope, $http, $location, pitchService){
    $scope.showLogIn = true;
    $scope.showMainPage = false;
    $scope.username = "";
    $scope.password = "";

    $scope.loginSubmit = function(){
        $http.post('/logIn', {username: $scope.username, password: $scope.password})
            .then(function(response){
                if(response.status ===200){
                    console.log('Did we hit the got response?');
                    $scope.showLogIn = false;
                    $scope.showMainPage = true;
                    //$location.path('/mainpage');
                } else {
                    console.log("ERROR");
                }
            });
    };
    //Color of the baseball in relation to the pitch type selected
    $scope.changeColor = function(color){
        ballColor = color;
        console.log(ballColor);
        return ballColor;
    };
    //The content inside the Pitch
    $scope.pitchResult = function(pitch){
        ballIcon = pitch;
        return ballIcon;
    };
    //Concatenate function response into query for facing lefty or righty table
    $scope.pitcherHand = function(throws){
        throwsWith = throws;
        return throwsWith;
    };
    $scope.names = function(){
        $http.get("/getPlayer")
            .then(function (response) {
                $scope.batterNames = response.data;
            });//response.data.records
    };
}]);

app.controller('GameTime', ['$scope', '$http', 'pitchService', function($scope, $http, pitchService){

    var baseball = {};

    $scope.fireClickEvent = function(evt){
        getBaseballPos(canvas, evt);
        var plotX = baseball.x;
        var plotY = baseball.y;
        createBaseball(canvas, plotX, plotY);
    };

    var canvas = document.getElementById('myCanvas');
    var createBaseball = function (canvas, color, pitch) {
        var context = canvas.getContext('2d');
        if (canvas.getContext) {
            var w = 16;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.fillStyle = ballColor;
            console.log(ballColor);
            //console.log(changeColor);
            context.arc(baseball.x, baseball.y, w/2, 0, 2*Math.PI);
            context.fill();

            context = canvas.getContext("2d");
            context.font = '8pt Calibri';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.fillText(ballIcon, baseball.x, baseball.y + 4);//"0", should be a variable that will change the Pitch Results
        }
    };

    var getBaseballPos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        baseball.x = evt.clientX - rect.left;
        baseball.y = evt.clientY - rect.top;
    };
}]);

//Controller for creating a player
app.controller('CreatePlayer', ['$scope', '$http', 'pitchService', function($scope, $http, pitchService){
    //$scope.player = "";
    $scope.hitsfrom = function(bats){
        console.log('You have reached the hits from', bats);
        sideOfPlate = bats;// for some reason can't understand this
        console.log(sideOfPlate);
        //trying to see if this function will fire on the lefty or righty buttons
        return sideOfPlate;
    };
    $scope.throwsFrom = function(hand){
        console.log('You have reached the throwing', hand);
        pitchesWith = hand;
        //trying to see if this function will fire on the lefty or righty buttons
        return pitchesWith;
    };

    $scope.teamname = "";
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.primaryPosition = "";
    $scope.secondaryPosition = "";
    //$scope.bats = sideOfPlate;//can't
    //$scope.throws = pitchesWith;

    $scope.submitPlayer = function(){
        $http.post('/newPlayer', {teamname: $scope.teamname, firstname: $scope.firstname, lastname: $scope.lastname, primaryPosition: $scope.primaryPosition, secondaryPosition: $scope.secondaryPosition, hitsfrom: sideOfPlate, throws: pitchesWith})
            .then(function(response){
                if(response.status === 200){
                    //$location.path('/index');
                    console.log('Registered successfully');
                } else {
                    console.log("ERROR");
                }
            });
    };
}]);

app.controller('statsController', ['$scope', '$http', function($scope, $http){
//this will be filled in with manipulation of stats

}]);

app.factory('pitchService', ['$http', function($http) {

    var batter = "";

    var atBat = {
        pitcher: "",//lefty or righty?
        hit: "",//was it a hit? what kind?
        out: "" //was it an out? what kind?
    };
    var pitches = {
        pitch_type: [],//What type of pitch was it?
        pitch_result: []//Was it a ball, strike, or foul?
    };

    var getPitchInfo = function() {
        $http.get('/index').then(function(response){
            data.pitchInfo = response.data;
        });
    };

    var data = {};

    return {
        batter: batter,
        atBat: atBat,
        pitches: pitches,
        getPitchInfo: getPitchInfo
    };
}]);