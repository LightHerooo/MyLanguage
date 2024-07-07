package ru.herooo.mylanguageweb.json.l.array;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class LongArrayDeserializer extends JsonDeserializer<Long[]> {
    @Override
    public Long[] deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        Long[] longsArr = null;
        if (jsonParser.getCurrentToken() == JsonToken.START_ARRAY) {
            LongDeserializer longDeserializer = new LongDeserializer();
            List<Long> longsList = new ArrayList<>();

            while (true) {
                JsonToken jsonToken = jsonParser.nextToken();
                if (jsonToken == JsonToken.END_ARRAY
                        || jsonToken == JsonToken.END_OBJECT
                        || jsonToken == null) break;

                Long value = longDeserializer.deserialize(jsonParser, deserializationContext);
                if (value != null) {
                    longsList.add(value);
                }
            }

            longsArr = longsList.toArray(new Long[0]);
        }

        return longsArr;
    }
}
