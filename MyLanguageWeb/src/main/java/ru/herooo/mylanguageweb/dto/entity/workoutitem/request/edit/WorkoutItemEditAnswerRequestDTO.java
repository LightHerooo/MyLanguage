package ru.herooo.mylanguageweb.dto.entity.workoutitem.request.edit;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;

public class WorkoutItemEditAnswerRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @Size(max = 44, message = "Длина ответа должна быть не более 44-х символов")
    @JsonProperty("answer")
    private String answer;

    @JsonProperty("customer_auth_key")
    private String customerAuthKey;

    @JsonProperty("workout_auth_key")
    private String workoutAuthKey;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        if (!STRING_UTILS.isStringVoid(answer)) {
            this.answer = STRING_UTILS.createStrTrimToLower(answer);
        }
    }

    public String getCustomerAuthKey() {
        return customerAuthKey;
    }

    public void setCustomerAuthKey(String customerAuthKey) {
        this.customerAuthKey = customerAuthKey;
    }

    public String getWorkoutAuthKey() {
        return workoutAuthKey;
    }

    public void setWorkoutAuthKey(String workoutAuthKey) {
        this.workoutAuthKey = workoutAuthKey;
    }
}
