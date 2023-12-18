package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.Customer;

public interface CustomerCrudRepository extends CrudRepository<Customer, Long> {
    Customer findByLogin(String login);
    Customer findById(long id);
    Customer findByEmail(String email);
    Customer findByNickname(String nickname);
    Customer findByAuthCode(String authCode);
    Customer findByLoginAndPassword(String login, String password);

}
