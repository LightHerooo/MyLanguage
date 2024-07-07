package ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.workout_type;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.workouttype.response.WorkoutTypeResponseDTO;

public class FavouriteWorkoutTypeResponseDTO {
    @JsonProperty("workout_type")
    private WorkoutTypeResponseDTO workoutType;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_workouts")
    private long numberOfWorkouts;

    public WorkoutTypeResponseDTO getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(WorkoutTypeResponseDTO workoutType) {
        this.workoutType = workoutType;
    }

    public long getNumberOfWorkouts() {
        return numberOfWorkouts;
    }

    public void setNumberOfWorkouts(long numberOfWorkouts) {
        this.numberOfWorkouts = numberOfWorkouts;
    }
}
