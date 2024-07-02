export class CustomerRoles {
    ADMIN = new CustomerRole(2n, "admin");
    MODERATOR = new CustomerRole(3n, "moderator");
    CUSTOMER = new CustomerRole(1n, "customer");
}

class CustomerRole {
    ID;
    CODE;

    constructor(id, code) {
        this.ID = id;
        this.CODE = code;
    }
}