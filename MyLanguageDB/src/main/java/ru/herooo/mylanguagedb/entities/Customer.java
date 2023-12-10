package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name="customer")
public class Customer {

    @Id
    @GeneratedValue
    private long id;

    @Column(name="login")
    private String login;

    @Column(name="password")
    private String password;

    @Column(name="nickname")
    private String nickname;

    @ManyToOne
    @JoinColumn(name="customer_role_id")
    private CustomerRole role;

    public Customer() {}

    public Customer(String login, String password, String nickname, CustomerRole role) {
        this.login = login;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
    }

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
}
