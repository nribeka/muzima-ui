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

import java.util.UUID;

import android.util.Log;
import com.mclinic.api.model.User;
import com.mclinic.api.module.MuzimaModule;
import com.mclinic.api.service.AdministrativeService;
import com.mclinic.api.service.UserService;
import com.mclinic.search.api.Context;
import com.mclinic.search.api.util.StringUtil;
import com.mclinic.util.DigestUtils;
import com.mclinic.util.FileUtils;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;

public abstract class MuzimaPlugin extends CordovaPlugin {

    private final String defaultKey = "uuid";

    private final String lucenePath = "/mnt/sdcard/cordova/lucene";

    private final String configurationPath = "/mnt/sdcard/cordova/configuration";

    private final String TAG = MuzimaPlugin.class.getSimpleName();

    protected void initialize(final String server,
                              final String username,
                              final String password,
                              final CallbackContext callbackContext) {

        Log.i(TAG, "Initializing internal structure of the plugins.");
        if (FileUtils.storageReady()) {
            MuzimaModule muzimaModule = new MuzimaModule(lucenePath, defaultKey);
            muzimaModule.setServer(server);
            muzimaModule.setUsername(username);
            muzimaModule.setPassword(password);
            Context.initialize(muzimaModule);

            AdministrativeService administrativeService = Context.getInstance(AdministrativeService.class);
            administrativeService.initializeRepository(configurationPath);
            Log.i(TAG, "Internal structure of plugins is initialized.");
            // initialize with the current user
            // TODO: need to make sure the timeout is short when performing any download this!
            administrativeService.downloadUsers(username);
            // validate the user
            UserService userService = Context.getInstance(UserService.class);
            User user = userService.getUserByUsername(username);
            if (user != null) {
                if (StringUtil.isEmpty(user.getSalt()) && StringUtil.isEmpty(user.getPassword())) {
                    String salt = UUID.randomUUID().toString();
                    String hashedPassword = DigestUtils.generateChecksum(password + ":" + salt);
                    user.setSalt(salt);
                    user.setPassword(hashedPassword);
                    userService.updateUser(user);
                    callbackContext.success(hashedPassword);
                } else {
                    String hashedPassword = DigestUtils.generateChecksum(password + ":" + user.getSalt());
                    if (StringUtil.equals(hashedPassword, user.getPassword()))
                        callbackContext.success(hashedPassword);
                    else
                        callbackContext.error("User is not authorized to access this app!");
                    userService.deleteUser(user);
                }
            } else {
                callbackContext.error("User is not authorized to access this app!");
            }
        }
    }
}
