package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import formula.bollo.app.entity.User;
import formula.bollo.app.mapper.UserMapper;
import formula.bollo.app.model.UserDTO;

@Configuration
public class UserImpl implements UserMapper {
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Converts an UserDTO object to an User object.
     *
     * @param userDTO The UserDTO object to be converted.
     * @return         An User object with properties copied from the UserDTO.
    */
    @Override
    public User userDTOToUser(UserDTO userDTO) {
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        user.setPassword(null);
        if (userDTO.getPassword() != null) user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        return user;
    }

    /**
     * Converts an User object to an UserDTO object.
     *
     * @param user The User object to be converted.
     * @return      An UserDTO object with properties copied from the User.
    */
    @Override
    public UserDTO userToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }
}
