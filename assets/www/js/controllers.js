'use strict';

/* Controllers */

var cohorts = [
    {
        "uuid": "c1",
        "name": "Cohort A"
    },
    {
        "uuid": "c2",
        "name": "Cohort B"
    },
    {
        "uuid": "c3",
        "name": "Cohort C"
    },
    {
        "uuid": "c4",
        "name": "Cohort D"
    }
];

var patients = {
    "p1": {
        "identifier": "99KT-4",
        "givenName": "Testarius",
        "middleName": "Paul",
        "familyName": "Kungu",
        "birth": "16-04-1984",
        "gender": "Male",
        "uuid": "p1"
    },
    "p2": {
        "identifier": "757KT-5",
        "givenName": "Testarius",
        "middleName": "Kapkiyei",
        "familyName": "Bowen",
        "birth": "10-04-1988",
        "gender": "Male",
        "uuid": "p2"
    },
    "p3": {
        "identifier": "2857KT-9",
        "givenName": "Testarius",
        "middleName": "Ambote",
        "familyName": "Indakasi",
        "birth": "15-10-1982",
        "gender": "Female",
        "uuid": "p3"
    },
    "p4": {
        "identifier": "243KT-3",
        "givenName": "Nyoman",
        "middleName": "Winardi",
        "familyName": "Ribeka",
        "birth": "16-04-1990",
        "gender": "Male",
        "uuid": "p4"
    }
};

var cohort_members = {
    "c1": ["p1", "p2", "p3"],
    "c2": ["p2", "p4"],
    "c3": ["p3", "p4"],
    "c4": ["p2"]
};

var observations = [
    {
        "name": "CD4 COUNT",
        "value": "300",
        "datetime": "10-12-2009"
    },
    {
        "name": "PREGNANCY STATUS",
        "value": "UNKNOWN",
        "datetime": "10-12-2009"
    },
    {
        "name": "WEIGHT (KG)",
        "value": "80",
        "datetime": "10-12-2009"
    },
    {
        "name": "HEIGHT (CM)",
        "value": "189",
        "datetime": "10-12-2009"
    }
];

var forms = [
    {
        "uuid": "f1",
        "name": "Form A"
    },
    {
        "uuid": "f2",
        "name": "Form B"
    },
    {
        "uuid": "f3",
        "name": "Form C"
    },
    {
        "uuid": "f4",
        "name": "Form D"
    },
    {
        "uuid": "f5",
        "name": "Form E"
    }
];

/**
 * Controller for the login page.
 * @param $scope
 * @param $location
 * @param $userService
 * @param $authentication
 * @constructor
 */
function LoginController($scope, $location, $userService, $authentication) {
    var handleFailure = function (message) {
        $scope.message = message;
    }
    var updateAuthentication = function (username, password, authenticated) {
        $authentication.username = username;
        $authentication.password = password;
        $authentication.authenticated = authenticated;
    }
    var handleAuthenticationSuccess = function () {
        updateAuthentication($scope.username, $scope.password, true);
        $location.path("/home");
    }
    $scope.validate = function () {
        $userService.authenticate($scope.username, $scope.password,
            "http://192.168.1.74:8081/openmrs-standalone", handleAuthenticationSuccess, handleFailure);
    }
}
LoginController.$inject = ['$scope', '$location', '$userService', '$authentication'];

/**
 * Controller for the home page.
 * @param $scope
 * @param $userService
 * @param $authentication
 * @constructor
 */
function HomeController($scope, $userService, $authentication) {
    var handleFailure = function (message) {
        $scope.message = message;
    }
    var handleSearchUser = function (user) {
        $scope.user = user;
    }
    $userService.getUserByUsername($authentication.username, handleSearchUser, handleFailure);
}
HomeController.$inject = ['$scope', '$userService', '$authentication'];

/**
 * Controller for the cohort list page.
 * @param $scope
 * @param $adminService
 * @param $cohortService
 * @constructor
 */
function CohortController($scope, $adminService, $cohortService) {
    $scope.loading = true;
    var handleFailure = function (message) {
        $scope.message = message;
    }
    var handleSearchCohort = function (cohorts) {
        $scope.cohorts = cohorts;
    }
    var handleDownloadCohort = function () {
        $cohortService.getAllCohorts(handleSearchCohort, handleFailure);
        $scope.loading = false;
    }
    $adminService.downloadAllCohorts(handleDownloadCohort);
}
CohortController.$inject = ['$scope', '$adminService', '$cohortService'];

/**
 * Controller for the settings page.
 * @param $scope
 * @param $authentication
 * @constructor
 */
function SettingController($scope, $authentication) {
    $scope.authenticated = $authentication.authenticated;
    $scope.message = "This message is sent from the setting controller, not from the html.";
}
SettingController.$inject = ['$scope', '$authentication'];

/**
 * Controller for the about page.
 * @param $scope
 * @constructor
 */
function AboutController($scope) {
    $scope.message = "This message is sent from the setting controller, not from the html.";
}

/**
 * Controller for the patient list page.
 * @param $scope
 * @param $routeParams
 * @param $adminService
 * @param $cohortService
 * @param $patientService
 * @constructor
 */
function PatientsController($scope, $routeParams, $adminService, $cohortService, $patientService) {
    $scope.loading = true;

    var uuid = $routeParams.uuid;
    var handleFailure = function(message) {
        $scope.message = message;
    }

    var handleSearchCohort = function(cohort) {
        $scope.cohort = cohort;
    }
    $cohortService.getCohortByUuid(uuid, handleSearchCohort, handleFailure);

    var handleSearchPatients = function (patients) {
        $scope.patients = patients;
    }
    var handleDownloadPatients = function () {
        $patientService.getPatientsByCohort(uuid, handleSearchPatients, handleFailure);
        $scope.loading = false;
    }
    $adminService.downloadPatientsForCohort(uuid, handleDownloadPatients);
}
PatientsController.$inject = ['$scope', '$routeParams', '$adminService', '$cohortService', '$patientService'];

function PatientController($scope, $routeParams, $patientService) {
    var patientUuid = $routeParams.uuid;
    var handleFailure = function(message) {
        $scope.message = message;
    }
    var handleSearchPatient = function(patient) {
        $scope.patient = patient;
    }
    $patientService.getPatientByUuid(patientUuid, handleSearchPatient, handleFailure);
}
PatientController.$inject = ['$scope', '$routeParams', '$patientService'];

function ObservationController($scope, $routeParams, $adminService, $patientService, $observationService) {
    $scope.loading = true;

    var handleFailure = function(message) {
        $scope.message = message;
    }

    var patient = null;
    var patientUuid = $routeParams.uuid;
    var handleSearchPatient = function(result) {
        $scope.patient = patient = result;
    }
    $patientService.getPatientByUuid(patientUuid, handleSearchPatient, handleFailure);

    if (patient != null) {
        var handleSearchObservations = function(observations) {
            $scope.observations = observations;
        }
        var handleDownloadObservations = function() {
            $observationService.getObservationsForPatient(patientUuid, handleSearchObservations, handleFailure);
            $scope.loading = false;
        }
        $adminService.downloadObservationsForPatient(patientUuid, handleDownloadObservations);
    }
}
ObservationController.$inject = ['$scope', '$routeParams', '$adminService', '$patientService', '$observationService'];

function SummaryController($scope, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.patient = patients[uuid];
    $scope.message = "You should see summary data here.";
}
SummaryController.$inject = ['$scope', '$routeParams'];

function ReminderController($scope, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.patient = patients[uuid];
    $scope.message = "You should see reminder data here.";
}
ReminderController.$inject = ['$scope', '$routeParams'];

function FormsController($scope, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.patient = patients[uuid];
    $scope.forms = forms;
}
FormsController.$inject = ['$scope', '$routeParams'];

function FormController($scope, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.patient = patients[uuid];
    var formUuid = $routeParams.formUuid;
    $scope.form = forms[formUuid];
}
FormController.$inject = ['$scope', '$routeParams'];
