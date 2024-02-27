package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.Customer;

import java.util.Optional;

public interface CustomerCrudRepository extends CrudRepository<Customer, Long> {
    Optional<Customer> findByLogin(String login);
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByNickname(String nickname);
    Optional<Customer> findByAuthCode(String authCode);
    Optional<Customer> findByLoginAndPassword(String login, String password);
}
