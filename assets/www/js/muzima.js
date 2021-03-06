/*
 * Copyright 2012 Muzima Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var sessionData = {};

function applyCallback(successCallback) {
    return typeof successCallback !== 'function' ? null : function (result) {
        successCallback(result);
    }
}

var adminService = {
    downloadAllForms: function (successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "AdminPlugin", "downloadAllForms", [sessionData]);
    },
    downloadAllCohorts: function (successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "AdminPlugin", "downloadAllCohorts", [sessionData]);
    },
    downloadPatientsForCohort: function (cohortUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "AdminPlugin", "downloadAllPatients", [sessionData, cohortUuid]);
    },
    downloadObservationsForPatient: function (patientUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "AdminPlugin", "downloadAllObservations", [sessionData, patientUuid]);
    }
};

var cohortService = {
    getAllCohorts: function (successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "CohortPlugin", "getAllCohorts", [sessionData]);
    },
    getCohortsByName: function (partialName, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "CohortPlugin", "getCohortByName", [sessionData, partialName]);
    },
    getCohortByUuid: function (cohortUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "CohortPlugin", "getCohortByUuid", [sessionData, cohortUuid]);
    }
};

var formService = {
    getAllForms: function (successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "FormPlugin", "getAllForms", [sessionData]);
    },
    getFormByUuid: function (formUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "FormPlugin", "getFormByUuid", [sessionData, formUuid]);
    }
};

var patientService = {
    getAllPatients: function (successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "PatientPlugin", "getAllPatients", [sessionData]);
    },
    getPatientsByCohort: function (cohortUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "PatientPlugin", "getPatientsByCohort", [sessionData, cohortUuid]);
    },
    getPatientsByName: function (partialName, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "PatientPlugin", "getPatientsByName", [sessionData, partialName]);
    },
    getPatientByIdentifier: function (identifier, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "PatientPlugin", "getPatientByIdentifier", [sessionData, identifier]);
    },
    getPatientByUuid: function (patientUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "PatientPlugin", "getPatientByUuid", [sessionData, patientUuid]);
    }
};

var observationService = {
    getObservationsForPatient: function (patientUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "ObservationPlugin", "getAllObservations", [sessionData, patientUuid]);
    },
    searchObservationsForPatient: function (patientUuid, term, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "ObservationPlugin", "getAllObservations", [sessionData, patientUuid, term]);
    },
    getObservationByUuid: function (observationUuid, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "PatientPlugin", "getPatientByUuid", [sessionData, observationUuid]);
    }
};

var userService = {
    authenticate: function (username, password, url, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "UserPlugin", "authenticate", [sessionData, username, password, url]);
    },
    getUserByUsername: function (username, successCallback, errorCallback) {
        cordova.exec(applyCallback(successCallback), applyCallback(errorCallback), "UserPlugin", "getUserByUsername", [sessionData, username]);
    }
};
