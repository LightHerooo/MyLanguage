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

    @Column(name = "word_title_question")
    private String wordTitleQuestion;

    @Column(name = "word_title_answer")
    private String wordTitleAnswer;

    @Column(name = "is_correct")
    private boolean isCorrect;

    @Column(name = "date_of_set_answer")
    private LocalDateTime dateOfSetAnswer;

    @Column(name = "round_number")
    private int roundNumber;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    public long getId() {
        return id;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
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

    public String getWordTitleQuestion() {
        return wordTitleQuestion;
    }

    public void setWordTitleQuestion(String wordTitleQuestion) {
        this.wordTitleQuestion = wordTitleQuestion;
    }

    public String getWordTitleAnswer() {
        return wordTitleAnswer;
    }

    public void setWordTitleAnswer(String wordTitleAnswer) {
        this.wordTitleAnswer = wordTitleAnswer;
    }

    public LocalDateTime getDateOfSetAnswer() {
        return dateOfSetAnswer;
    }

    public void setDateOfSetAnswer(LocalDateTime dateOfSetAnswer) {
        this.dateOfSetAnswer = dateOfSetAnswer;
    }
}
