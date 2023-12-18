package ru.herooo.mylanguageweb.dto.customer;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;

@Service
public class CustomerMapping {
    public Customer mapToCustomer(Customer oldCustomer, CustomerRegValidDTO crvd) {
        oldCustomer.setLogin(crvd.getLogin());
        oldCustomer.setPassword(crvd.getPassword());
        oldCustomer.setNickname(crvd.getNickname());
        oldCustomer.setEmail(crvd.getEmail());

        return oldCustomer;
    }

    public Customer mapToCustomer(CustomerRegValidDTO cdv) {
        return mapToCustomer(new Customer(), cdv);
    }

}
