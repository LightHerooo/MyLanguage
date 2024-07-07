package ru.herooo.mylanguageweb.json.l.array;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class LongArraySerializer extends JsonSerializer<Long[]> {
    @Override
    public void serialize(Long[] longs, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        if (longs != null) {
            for (Long value: longs) {
                jsonGenerator.writeString(value.toString() + "n");
            }
        }
    }
}
