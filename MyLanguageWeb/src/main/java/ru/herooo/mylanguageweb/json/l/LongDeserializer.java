package ru.herooo.mylanguageweb.json.l;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class LongDeserializer extends JsonDeserializer<Long> {

    @Override
    public Long deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        String value = jsonParser.getText();
        if (value != null) {
            value = value.strip();
            if (value.length() > 0) {
                if (value.indexOf('n') == value.length() - 1) {
                    return Long.parseLong(value.substring(0, value.length() - 1));
                }
                return Long.parseLong(value);
            }
        }
        return null;
    }
}
