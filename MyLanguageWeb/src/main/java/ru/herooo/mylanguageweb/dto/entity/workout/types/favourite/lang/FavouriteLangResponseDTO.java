package ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.lang;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

public class FavouriteLangResponseDTO {
    @JsonProperty("lang")
    private LangResponseDTO lang;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_workouts")
    private long numberOfWorkouts;

    public LangResponseDTO getLang() {
        return lang;
    }

    public void setLang(LangResponseDTO lang) {
        this.lang = lang;
    }

    public long getNumberOfWorkouts() {
        return numberOfWorkouts;
    }

    public void setNumberOfWorkouts(long numberOfWorkouts) {
        this.numberOfWorkouts = numberOfWorkouts;
    }
}
