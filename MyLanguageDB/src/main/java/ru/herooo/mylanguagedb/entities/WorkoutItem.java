package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "workout_item")
public class WorkoutItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "workout_item_id_seq")
    @SequenceGenerator(name = "workout_item_id_seq", sequenceName = "workout_item_id_seq", allocationSize = 1)
    private long id;

    @Column(name = "word_title_request")
    private String wordTitleRequest;

    @Column(name = "word_title_response")
    private String wordTitleResponse;

    @Column(name = "is_correct")
    private boolean isCorrect;

    @Column(name = "date_of_set_response")
    private LocalDateTime dateOfSetResponse;

    @Column(name = "round_number")
    private int roundNumber;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    public long getId() {
        return id;
    }

    public String getWordTitleRequest() {
        return wordTitleRequest;
    }

    public void setWordTitleRequest(String wordTitleRequest) {
        this.wordTitleRequest = wordTitleRequest;
    }

    public String getWordTitleResponse() {
        return wordTitleResponse;
    }

    public void setWordTitleResponse(String wordTitleResponse) {
        this.wordTitleResponse = wordTitleResponse;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public LocalDateTime getDateOfSetResponse() {
        return dateOfSetResponse;
    }

    public void setDateOfSetResponse(LocalDateTime dateOfSetResponse) {
        this.dateOfSetResponse = dateOfSetResponse;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(int roundNumber) {
        this.roundNumber = roundNumber;
    }
}
