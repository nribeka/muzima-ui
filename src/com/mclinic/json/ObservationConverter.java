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
package com.mclinic.json;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.mclinic.api.model.Observation;
import com.mclinic.api.model.Patient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ObservationConverter {

    public JSONObject serialize(final Observation observation) throws JSONException {
        String dateFormat = "dd-MMM-yyyy HH:mm:ss";
        DateFormat format = new SimpleDateFormat(dateFormat);

        JSONObject object = new JSONObject();
        object.put("uuid", observation.getUuid());
        object.put("value", observation.getValueText());
        object.put("fieldName", observation.getFieldName());
        object.put("fieldUuid", observation.getFieldUuid());
        object.put("patientUuid", observation.getPatientUuid());
        object.put("observationDate", format.format(observation.getObservationDate()));
        return object;
    }

    public JSONArray serialize(final List<Observation> observations) throws JSONException {
        JSONArray array = new JSONArray();
        for (Observation observation : observations)
            array.put(serialize(observation));
        return array;
    }

}
