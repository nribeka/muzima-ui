/**
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
package com.mclinic.plugin;

import java.util.List;

import com.mclinic.api.model.Observation;
import com.mclinic.api.model.Patient;
import com.mclinic.api.service.ObservationService;
import com.mclinic.api.service.PatientService;
import com.mclinic.json.ObservationConverter;
import com.mclinic.search.api.Context;
import com.mclinic.search.api.util.StringUtil;
import org.apache.cordova.api.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ObservationPlugin extends MuzimaPlugin {

    private final String TAG = ObservationPlugin.class.getSimpleName();

    /**
     * Executes the request.
     * <p/>
     * This method is called from the WebView thread. To do a non-trivial amount of work, use:
     * cordova.getThreadPool().execute(runnable);
     * <p/>
     * To run on the UI thread, use:
     * cordova.getActivity().runOnUiThread(runnable);
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return Whether the action was valid.
     */
    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        // the first argument will always the session data
        // we need to check session data to ensure that the user is actually logged in
        JSONObject sessionData = args.getJSONObject(0);

        boolean valid = true;
        ObservationConverter converter = new ObservationConverter();
        PatientService patientService = Context.getInstance(PatientService.class);
        ObservationService observationService = Context.getInstance(ObservationService.class);
        if (StringUtil.equals(action, "getAllObservations")) {
            String patientUuid = args.getString(1);
            Patient patient = patientService.getPatientByUuid(patientUuid);
            List<Observation> observations = observationService.getAllObservations(patient);
            callbackContext.success(converter.serialize(observations));
        } else if (StringUtil.equals(action, "getObservationByUuid")) {
            String uuid = args.getString(1);
            Observation observation = observationService.getObservationByUuid(uuid);
            callbackContext.success(converter.serialize(observation));
        } else if (StringUtil.equals(action, "searchObservation")) {
            String patientUuid = args.getString(1);
            Patient patient = patientService.getPatientByUuid(patientUuid);
            String term = args.getString(2);
            List<Observation> observations = observationService.searchObservations(patient, term);
            callbackContext.success(converter.serialize(observations));
        } else {
            return super.execute(action, args, callbackContext);
        }
        return valid;
    }
}
