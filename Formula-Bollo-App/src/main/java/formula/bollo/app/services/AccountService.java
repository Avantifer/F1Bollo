package formula.bollo.app.services;


import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Account;
import formula.bollo.app.model.AccountDTO;
import formula.bollo.app.utils.Log;

@Service
public class AccountService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Checks if the provided account's credentials match those stored in the database.
     *
     * @param account    The account whose credentials need to be checked.
     * @param accountBD  The list of account records from the database.
     * @return         True if the credentials match, false otherwise.
    */
    public boolean checkAccountCredentials(AccountDTO account, List<Account> accountBD) {
        if (accountBD == null || accountBD.isEmpty()) return false;
        return passwordEncoder.matches(account.getPassword(), accountBD.get(0).getPassword());
    }

    /**
     * Checks if a account already exists in the database by comparing the email and username.
     * @param account The account to check.
     * @param accountBD The list of users in the database.
     * @return True if the account already exists, false otherwise.
    */
    public boolean checkAccountAlreadyExists(AccountDTO account, List<Account> accountBD) {
        if (accountBD == null || accountBD.isEmpty()) return false;
        if (accountBD.get(0).getEmail().equals(account.getEmail())) {
            Log.info("Es igual");
        } else {
            Log.info("No es igual");
        }
        return accountBD.get(0).getUsername().equals(account.getUsername()) || accountBD.get(0).getEmail().equals(account.getEmail());
    }

    /**
     * Encrypts the given password using the password encoder.
     *
     * @param password the password to be encrypted
     * @return the encrypted password
    */
    public String encryptPassword(String password) {
        return passwordEncoder.encode(password);
    }
}

