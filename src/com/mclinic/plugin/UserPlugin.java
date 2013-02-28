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

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import android.util.Log;
import com.jayway.jsonpath.JsonPath;
import com.mclinic.api.model.Form;
import com.mclinic.api.model.User;
import com.mclinic.api.service.FormService;
import com.mclinic.api.service.UserService;
import com.mclinic.json.FormConverter;
import com.mclinic.json.UserConverter;
import com.mclinic.search.api.Context;
import com.mclinic.search.api.util.StreamUtil;
import com.mclinic.search.api.util.StringUtil;
import com.mclinic.util.DigestUtils;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.PluginResult;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class UserPlugin extends MuzimaPlugin {

    private final String TAG = UserPlugin.class.getSimpleName();

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
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        // TODO: need to code this tomorrow:
        // - need to add special marker in the session object which will say the user is authenticated
        // - this authentication value need to be passed to every subsequent service / plugin call
        // - remove the initialized object

        // the first argument will always the session data
        // we need to check session data to ensure that the user is actually logged in
        JSONObject sessionData = args.getJSONObject(0);

        boolean valid = true;
        if (StringUtil.equals(action, "authenticate")) {
            String username = args.getString(1);
            String password = args.getString(2);
            String server = args.getString(3);
            initialize(server, username, password, callbackContext);
        } else if (StringUtil.equals(action, "getUserByUsername")) {
            String username = args.getString(1);
            UserConverter converter = new UserConverter();
            UserService userService = Context.getInstance(UserService.class);
            User user = userService.getUserByUsername(username);
            callbackContext.success(converter.serialize(user));
        } else {
            return super.execute(action, args, callbackContext);
        }
        return valid;
    }

}
