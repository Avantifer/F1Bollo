package formula.bollo.app.services;


import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.User;
import formula.bollo.app.model.UserDTO;

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

    public boolean checkUserAlreadyExists(UserDTO user, List<User> userBD) {
        if (userBD == null || userBD.isEmpty()) return false;
        return userBD.get(0).getUsername().equals(user.getUsername());
    }
}

