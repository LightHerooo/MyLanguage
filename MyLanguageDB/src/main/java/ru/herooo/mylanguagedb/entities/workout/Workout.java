package ru.herooo.mylanguagedb.entities.workout;

import jakarta.persistence.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;

import java.time.LocalDateTime;

@Entity
@Table(name = "workout")
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "workout_id_seq")
    @SequenceGenerator(name = "workout_id_seq", sequenceName = "workout_id_seq", allocationSize = 1)
    private long id;

    @Column(name = "number_of_words")
    private long numberOfWords;

    @Column(name = "date_of_start")
    private LocalDateTime dateOfStart;

    @Column(name = "date_of_end")
    private LocalDateTime dateOfEnd;

    @Column(name = "current_milliseconds")
    private long currentMilliseconds;

    @Column(name = "auth_key")
    private String authKey;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "workout_type_id")
    private WorkoutType workoutType;

    @ManyToOne
    @JoinColumn(name = "lang_in_id")
    private Lang langIn;

    @ManyToOne
    @JoinColumn(name = "lang_out_id")
    private Lang langOut;

    @ManyToOne
    @JoinColumn(name = "customer_collection_id")
    private CustomerCollection customerCollection;

    public long getId() {
        return id;
    }

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }

    public LocalDateTime getDateOfStart() {
        return dateOfStart;
    }

    public void setDateOfStart(LocalDateTime dateOfStart) {
        this.dateOfStart = dateOfStart;
    }

    public LocalDateTime getDateOfEnd() {
        return dateOfEnd;
    }

    public void setDateOfEnd(LocalDateTime dateOfEnd) {
        this.dateOfEnd = dateOfEnd;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public WorkoutType getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(WorkoutType workoutType) {
        this.workoutType = workoutType;
    }

    public Lang getLangIn() {
        return langIn;
    }

    public void setLangIn(Lang langIn) {
        this.langIn = langIn;
    }

    public Lang getLangOut() {
        return langOut;
    }

    public void setLangOut(Lang langOut) {
        this.langOut = langOut;
    }

    public CustomerCollection getCustomerCollection() {
        return customerCollection;
    }

    public void setCustomerCollection(CustomerCollection customerCollection) {
        this.customerCollection = customerCollection;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getCurrentMilliseconds() {
        return currentMilliseconds;
    }

    public void setCurrentMilliseconds(long startMilliseconds) {
        this.currentMilliseconds = startMilliseconds;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String securityKey) {
        this.authKey = securityKey;
    }
}
