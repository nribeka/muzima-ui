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

    var updateAuthentication = function (username, password, authenticated) {
        $authentication.username = username;
        $authentication.password = password;
        $authentication.authenticated = authenticated;
    }

    var success = function () {
        updateAuthentication($scope.username, $scope.password, true);
        $location.path("/home");
    }

    var error = function (message) {
        $scope.message = message;
        console.log(message);
    }

    $scope.validate = function () {
        $userService.authenticate($scope.username, $scope.password,
            "http://192.168.1.66:8081/openmrs-standalone",
            success, error);
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
    var success = function (user) {
        $scope.user = user;
    }
    var error = function (message) {
        $scope.message = message;
        console.log(message);
    }
    $userService.getUserByUsername($authentication.username, success, error);
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
    var success = function (message) {
        console.log(message);
        $cohortService.getAllCohorts(
            function (cohorts) {
                $scope.cohorts = cohorts;
            }, function (message) {
                $scope.message = message;
                console.log(message);
            }
        );
    }
    var error = function (message) {
        $scope.message = message;
        console.log(message);
    }
    $adminService.downloadAllCohorts(success, error);
}
CohortController.$inject = ['$scope', '$adminService', '$cohortService'];

/**
 * Controller for the settings page.
 * @param $scope
 * @constructor
 */
function SettingController($scope) {
    $scope.message = "This message is sent from the setting controller, not from the html.";
}
SettingController.$inject = ['$scope'];

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
    var uuid = $routeParams.uuid;
    $cohortService.getCohortByUuid(
        uuid,
        function(cohort) {
            $scope.cohort = cohort;
        }, function(message) {
            $scope.message = message;
            console.log(message);
        }
    );

    var success = function (message) {
        console.log(message);
        $patientService.getPatientsByCohort(
            uuid,
            function(patients) {
                $scope.patients = patients;
            }, function (message) {
                $scope.message = message;
                console.log(message);
            }
        )
    }
    var error = function (message) {
        $scope.message = message;
        console.log(message);
    }
    $adminService.downloadPatientsForCohort(uuid, success, error);
}
PatientsController.$inject = ['$scope', '$routeParams', '$adminService', '$cohortService', '$patientService'];

function PatientController($scope, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.patient = patients[uuid];
}
PatientController.$inject = ['$scope', '$routeParams'];

function ObservationController($scope, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.patient = patients[uuid];
    $scope.observations = observations;
}
ObservationController.$inject = ['$scope', '$routeParams'];

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
