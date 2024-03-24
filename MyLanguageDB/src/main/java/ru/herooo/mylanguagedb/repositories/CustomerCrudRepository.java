package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerCrudRepository extends CrudRepository<Customer, Long> {
    @Query(nativeQuery = true, value =
            "SELECT *" +
            "FROM get_customers(" +
                    ":nickname, :customer_role_code, :number_of_items, :last_customer_id_on_previous_page)")
    List<Customer> findAll(@Param("nickname") String nickname,
                           @Param("customer_role_code") String customerRoleCode,
                           @Param("number_of_items") Long numberOfItems,
                           @Param("last_customer_id_on_previous_page") Long lastCustomerIdOnPreviousPage);

    Optional<Customer> findByLogin(String login);
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByNickname(String nickname);
    Optional<Customer> findByAuthCode(String authCode);
    Optional<Customer> findByLoginAndPassword(String login, String password);
}
