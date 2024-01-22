package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "workout_setting")
public class WorkoutSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "workout_setting_id_seq")
    @SequenceGenerator(name = "workout_setting_id_seq", sequenceName = "workout_setting_id_seq", allocationSize = 1)
    private long id;

    @Column(name = "number_of_words")
    private long numberOfWords;

    @ManyToOne
    @JoinColumn(name = "workout_type_id")
    private WorkoutType workoutType;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "lang_out_id")
    private Lang langOut;

    @ManyToOne
    @JoinColumn(name = "lang_in_id")
    private Lang LangIn;

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

    public WorkoutType getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(WorkoutType workoutType) {
        this.workoutType = workoutType;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Lang getLangOut() {
        return langOut;
    }

    public void setLangOut(Lang langOut) {
        this.langOut = langOut;
    }

    public Lang getLangIn() {
        return LangIn;
    }

    public void setLangIn(Lang langIn) {
        LangIn = langIn;
    }

    public CustomerCollection getCustomerCollection() {
        return customerCollection;
    }

    public void setCustomerCollection(CustomerCollection customerCollection) {
        this.customerCollection = customerCollection;
    }
}
