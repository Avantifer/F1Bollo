package formula.bollo.app.services;


import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.User;
import formula.bollo.app.model.UserDTO;
import formula.bollo.app.utils.Log;

@Service
public class UserService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Checks if the provided user's credentials match those stored in the database.
     *
     * @param user    The user whose credentials need to be checked.
     * @param userBD  The list of user records from the database.
     * @return         True if the credentials match, false otherwise.
    */
    public boolean checkUserCredentials(UserDTO user, List<User> userBD) {
        if (userBD == null || userBD.isEmpty()) return false;
        return passwordEncoder.matches(user.getPassword(), userBD.get(0).getPassword());
    }

    /**
     * Checks if a user already exists in the database by comparing the email and username.
     * @param user The user to check.
     * @param userBD The list of users in the database.
     * @return True if the user already exists, false otherwise.
    */
    public boolean checkUserAlreadyExists(UserDTO user, List<User> userBD) {
        if (userBD == null || userBD.isEmpty()) return false;
        if (userBD.get(0).getEmail().equals(user.getEmail())) {
            Log.info("Es igual");
        } else {
            Log.info("No es igual");
        }
        return userBD.get(0).getUsername().equals(user.getUsername()) || userBD.get(0).getEmail().equals(user.getEmail());
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

