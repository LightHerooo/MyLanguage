package ru.herooo.mylanguagedb.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name="customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_id_seq")
    @SequenceGenerator(name = "customer_id_seq", sequenceName = "customer_id_seq", allocationSize = 1)
    private long id;

    @Column(name="nickname")
    private String nickname;

    @Column(name="date_of_create")
    private LocalDateTime dateOfCreate;

    @Column(name="date_of_last_visit")
    private LocalDateTime dateOfLastVisit;

    @JsonIgnore
    @Column(name="login")
    private String login;

    @JsonIgnore
    @Column(name="password")
    private String password;

    @JsonIgnore
    @Column(name="email")
    private String email;

    @JsonIgnore
    @Column(name="auth_code")
    private String authCode;

    @ManyToOne
    @JoinColumn(name="customer_role_id")
    private CustomerRole role;

    @ManyToOne
    @JoinColumn(name="country_id")
    private Country country;

    public long getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public CustomerRole getRole() {
        return role;
    }

    public void setRole(CustomerRole role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public LocalDateTime getDateOfCreate() {
        return dateOfCreate;
    }

    public void setDateOfCreate(LocalDateTime dateOfCreate) {
        this.dateOfCreate = dateOfCreate;
    }

    public LocalDateTime getDateOfLastVisit() {
        return dateOfLastVisit;
    }

    public void setDateOfLastVisit(LocalDateTime dateOfLastVisit) {
        this.dateOfLastVisit = dateOfLastVisit;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return id == customer.id
                && Objects.equals(nickname, customer.nickname)
                && Objects.equals(dateOfCreate, customer.dateOfCreate)
                && Objects.equals(dateOfLastVisit, customer.dateOfLastVisit)
                && Objects.equals(login, customer.login)
                && Objects.equals(password, customer.password)
                && Objects.equals(email, customer.email)
                && Objects.equals(authCode, customer.authCode)
                && Objects.equals(role, customer.role)
                && Objects.equals(country, customer.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id,
                nickname,
                dateOfCreate,
                dateOfLastVisit,
                login,
                password,
                email,
                authCode,
                role,
                country);
    }
}
