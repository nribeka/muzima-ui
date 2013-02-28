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

import com.mclinic.api.model.Patient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PatientConverter {

    public JSONObject serialize(final Patient patient) throws JSONException {
        String dateFormat = "dd-MMM-yyyy";
        DateFormat format = new SimpleDateFormat(dateFormat);

        JSONObject object = new JSONObject();
        object.put("uuid", patient.getUuid());
        object.put("name", patient.getName());
        object.put("identifier", patient.getIdentifier());
        object.put("gender", patient.getGender());
        object.put("birthdate", format.format(patient.getBirthdate()));
        return object;
    }

    public JSONArray serialize(final List<Patient> patients) throws JSONException {
        JSONArray array = new JSONArray();
        for (Patient patient : patients)
            array.put(serialize(patient));
        return array;
    }

}
