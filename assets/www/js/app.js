'use strict';

angular.module('muzima', ['muzima.services', 'muzima.directives', 'muzima.filters']).
    config(function ($compileProvider, $routeProvider) {
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);

        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: LoginController});
        $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: HomeController});
        $routeProvider.when('/cohorts', {templateUrl: 'partials/cohorts.html', controller: CohortController});
        $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: SettingController});
        $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: AboutController});
        $routeProvider.when('/patients/:uuid', {templateUrl: 'partials/patients.html', controller: PatientsController});
        $routeProvider.when('/patient/:uuid', {templateUrl: 'partials/patient.html', controller: PatientController});
        $routeProvider.when('/observation/:uuid', {templateUrl: 'partials/observation.html', controller: ObservationController});
        $routeProvider.when('/summary/:uuid', {templateUrl: 'partials/summary.html', controller: SummaryController});
        $routeProvider.when('/reminder/:uuid', {templateUrl: 'partials/reminder.html', controller: ReminderController});
        $routeProvider.when('/forms/:uuid', {templateUrl: 'partials/forms.html', controller: FormsController});
        $routeProvider.when('/form/:uuid|:formUuid', {templateUrl: 'partials/form.html', controller: FormController});
        $routeProvider.otherwise({redirectTo: '/login'});
    }).
    factory('$deviceReady',function () {
        return function (fn) {
            var queue = [];
            var impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };
            document.addEventListener('deviceready', function () {
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);
            return function () {
                return impl.apply(this, arguments);
            };
        };
    }).
    factory('$userService',function ($rootScope, $deviceReady) {
        return {
            authenticate: $deviceReady(function (username, password, url, successCallback, errorCallback) {
                userService.authenticate(username, password, url, successCallback, errorCallback);
            }),
            getUserByUsername: $deviceReady(function (username, successCallback, errorCallback) {
                userService.getUserByUsername(username, successCallback, errorCallback);
            })
        }
    }).
    factory('$cohortService',function ($rootScope, deviceReady) {
        return {
            getAllCohorts: deviceReady(function (successCallback, errorCallback) {
                cohortService.getAllCohorts(successCallback, errorCallback);
            }),
            getCohortsByName: deviceReady(function (name, successCallback, errorCallback) {
                cohortService.getCohortsByName(name, successCallback, errorCallback);
            }),
            getCohortByUuid: deviceReady(function (uuid, successCallback, errorCallback) {
                cohortService.getCohortByUuid(uuid, successCallback, errorCallback);
            })
        }
    }).
    factory('$authentication',function () {
        var authentication = {};
        authentication.username = null;
        authentication.password = null;
        authentication.authenticated = false;
        return authentication;
    }).
    run(function ($rootScope, $location, $authentication) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            console.log("Route changes executed");
            if ($authentication.authenticated && next.templateUrl != 'partials/login.html') {
                $location.path("/login");
            }
        })
    });
