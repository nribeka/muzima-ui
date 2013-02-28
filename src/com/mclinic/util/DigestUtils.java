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
package com.mclinic.util;

import java.security.MessageDigest;

import android.util.Log;
import com.mclinic.search.api.util.StringUtil;

public class DigestUtils {

    private static final String TAG = DigestUtils.class.getSimpleName();

    static final char[] HEX_CHAR_TABLE = {
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
    };

    private static byte[] createChecksum(final String data) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-512");
        digest.update(data.getBytes());
        return digest.digest();
    }

    private static char[] getHexString(final byte[] raw) {
        int length = raw.length;

        char[] out = new char[length << 1];
        for (int i = 0, j = 0; i < length; i++) {
            out[j++] = HEX_CHAR_TABLE[(0xF0 & raw[i]) >>> 4];
            out[j++] = HEX_CHAR_TABLE[0x0F & raw[i]];
        }

        return out;
    }

    public static String generateChecksum(final String data) {
        String checksum = StringUtil.EMPTY;
        try {
            checksum = new String(getHexString(createChecksum(data)));
        } catch (Exception e) {
            Log.i(TAG, "Generating checksum failed!", e);
        }
        return checksum;
    }
}