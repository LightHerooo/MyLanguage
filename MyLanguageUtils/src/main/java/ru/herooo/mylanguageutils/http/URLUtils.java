package ru.herooo.mylanguageutils.http;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class URLUtils {
    public URL createGET(String path, HashMap<String, String> params) throws MalformedURLException {
        if (params != null && params.size() > 0) {
            StringBuilder paramsStr = new StringBuilder();
            for (Map.Entry<String, String> param: params.entrySet()) {
                paramsStr.append(param.getKey());
                paramsStr.append("=");
                paramsStr.append(param.getValue());
                paramsStr.append("&");
            }

            if (paramsStr.length() > 0) {
                path += "?" + paramsStr.substring(0, paramsStr.length() - 1);
            }
        }

        return URI.create(path).toURL();
    }
}
