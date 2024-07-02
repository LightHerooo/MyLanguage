package ru.herooo.mylanguagedb.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;

import java.time.LocalDateTime;

@Entity
@Table(name="word_in_collection")
public class WordInCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "word_in_collection_id_seq")
    @SequenceGenerator(name = "word_in_collection_id_seq", sequenceName = "word_in_collection_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "date_of_additional")
    private LocalDateTime dateOfAdditional;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "customer_collection_id")
    private CustomerCollection customerCollection;

    @ManyToOne
    @JoinColumn(name = "word_id")
    private Word word;

    public WordInCollection() {}

    @Override
    protected Object clone() throws CloneNotSupportedException {
        
        return super.clone();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateOfAdditional() {
        return dateOfAdditional;
    }

    public void setDateOfAdditional(LocalDateTime dateOfAdditional) {
        this.dateOfAdditional = dateOfAdditional;
    }

    public CustomerCollection getCustomerCollection() {
        return customerCollection;
    }

    public void setCustomerCollection(CustomerCollection customerCollection) {
        this.customerCollection = customerCollection;
    }

    public Word getWord() {
        return word;
    }

    public void setWord(Word word) {
        this.word = word;
    }
}
