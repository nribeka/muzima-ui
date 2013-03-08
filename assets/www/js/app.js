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
    factory('$adminService',function ($rootScope, $deviceReady) {
        var applyCallback = function (callback) {
            return function () {
                var that = this,
                    args = arguments;
                if (callback) {
                    $rootScope.$apply(function () {
                        callback.apply(that, args);
                    });
                }
            }
        }
        return {
            downloadAllForms: $deviceReady(function (successCallback) {
                adminService.downloadAllForms(
                    applyCallback(successCallback),
                    applyCallback(successCallback));
            }),
            downloadAllCohorts: $deviceReady(function (successCallback) {
                adminService.downloadAllCohorts(
                    applyCallback(successCallback),
                    applyCallback(successCallback));
            }),
            downloadPatientsForCohort: $deviceReady(function (cohortUuid, successCallback) {
                adminService.downloadPatientsForCohort(
                    cohortUuid,
                    applyCallback(successCallback),
                    applyCallback(successCallback));
            }),
            downloadObservationsForPatient: $deviceReady(function (patientUuid, successCallback) {
                adminService.downloadObservationsForPatient(
                    patientUuid,
                    applyCallback(successCallback),
                    applyCallback(successCallback));
            })
        }
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
    factory('$cohortService',function ($rootScope, $deviceReady) {
        return {
            getAllCohorts: $deviceReady(function (successCallback, errorCallback) {
                cohortService.getAllCohorts(successCallback, errorCallback);
            }),
            getCohortsByName: $deviceReady(function (name, successCallback, errorCallback) {
                cohortService.getCohortsByName(name, successCallback, errorCallback);
            }),
            getCohortByUuid: $deviceReady(function (uuid, successCallback, errorCallback) {
                cohortService.getCohortByUuid(uuid, successCallback, errorCallback);
            })
        }
    }).
    factory('$patientService',function ($rootScope, $deviceReady) {
        return {
            getAllPatients: $deviceReady(function (successCallback, errorCallback) {
                patientService.getAllPatients(successCallback, errorCallback);
            }),
            getPatientsByCohort: $deviceReady(function (cohortUuid, successCallback, errorCallback) {
                patientService.getPatientsByCohort(cohortUuid, successCallback, errorCallback);
            }),
            getPatientsByName: $deviceReady(function (partialName, successCallback, errorCallback) {
                patientService.getPatientsByName(partialName, successCallback, errorCallback);
            }),
            getPatientByIdentifier: $deviceReady(function (identifier, successCallback, errorCallback) {
                patientService.getPatientByIdentifier(identifier, successCallback, errorCallback);
            }),
            getPatientByUuid: $deviceReady(function (patientUuid, successCallback, errorCallback) {
                patientService.getPatientByUuid(patientUuid, successCallback, errorCallback);
            })
        }
    }).
    factory('$observationService',function ($rootScope, $deviceReady) {
        return {
            getObservationsForPatient: $deviceReady(function (patientUuid, successCallback, errorCallback) {
                observationService.getObservationsForPatient(patientUuid, successCallback, errorCallback);
            }),
            searchObservationsForPatient: $deviceReady(function (patientUuid, term, successCallback, errorCallback) {
                observationService.searchObservationsForPatient(patientUuid, term, successCallback, errorCallback);
            }),
            getObservationByUuid: $deviceReady(function (observationUuid, successCallback, errorCallback) {
                observationService.getObservationByUuid(observationUuid, successCallback, errorCallback);
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
            console.log("Executing route changes from: " + current.templateUrl + " to: " + next.templateUrl + "!");
            if (next.templateUrl != 'partials/settings.html') {
                if (!$authentication.authenticated && next.templateUrl != 'partials/login.html') {
                    $location.path("/login");
                }
            }
        })
    });
