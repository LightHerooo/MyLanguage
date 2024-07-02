export class CustomerEditPasswordRequestDTO {
    #oldPassword;
    #newPassword;

    getOldPassword() {
        return this.#oldPassword;
    }

    setOldPassword(oldPassword) {
        this.#oldPassword = oldPassword;
    }

    getNewPassword() {
        return this.#newPassword;
    }

    setNewPassword(newPassword) {
        this.#newPassword = newPassword;
    }
}