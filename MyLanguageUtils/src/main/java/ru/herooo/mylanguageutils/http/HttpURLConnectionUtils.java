package ru.herooo.mylanguageutils.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class HttpURLConnectionUtils {
    public HttpJsonResponse sendGET(URL url) {
        HttpJsonResponse jsonResponse = null;
        if (url != null) {
            HttpURLConnection con = null;
            try {
                con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("GET");
                con.setConnectTimeout(15 * 1000);
                con.setReadTimeout(15 * 1000);
                con.connect();

                // Заносим результат в объект
                jsonResponse = new HttpJsonResponse();
                jsonResponse.setCode(con.getResponseCode());
                jsonResponse.setJsonStr(getJsonStrResponse(con));
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (con != null) {
                    con.disconnect();
                }
            }
        }

        return jsonResponse;
    }
    private String getJsonStrResponse(HttpURLConnection httpURLConnection) throws IOException {
        String jsonStrResponse = null;
        if (httpURLConnection != null) {
            InputStream inputStreamResponse = null;
            if (httpURLConnection.getResponseCode() == 200) {
                inputStreamResponse = httpURLConnection.getInputStream();
            } else {
                inputStreamResponse = httpURLConnection.getErrorStream();
            }

            try (BufferedReader in = new BufferedReader(new InputStreamReader(inputStreamResponse))) {
                String inputLine;
                StringBuilder content = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }

                jsonStrResponse = content.toString();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        return jsonStrResponse;
    }
}
