package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.config.JwtConfig;
import formula.bollo.app.entity.User;
import formula.bollo.app.mapper.UserMapper;
import formula.bollo.app.model.UserDTO;
import formula.bollo.app.repository.UserRepository;
import formula.bollo.app.services.UserService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_USER}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_USER, description = Constants.TAG_USER_SUMMARY)
public class UserController {
    
    private UserRepository userRepository;

    private UserMapper userMapper;

    private JwtConfig jwtConfig;

    private UserService userService;

    public UserController(
        UserService userService,
        UserRepository userRepository,
        UserMapper userMapper,
        JwtConfig jwtConfig
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtConfig = jwtConfig;
    }

    @Operation(summary = "Login user", tags = Constants.TAG_USER)
    @PostMapping(path = "/login", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        Log.info("START - login - START");
        Log.info("RequestBody login -> " + userDTO.toString());

        List<User> user = userRepository.findByUsername(userDTO.getUsername());
        Boolean goodCredentials = this.userService.checkUserCredentials(userDTO, user);

        if (!goodCredentials) return new ResponseEntity<>(Constants.ERROR_INVALID_CREDENTIALS, HttpStatusCode.valueOf(500));

        UserDTO adminDTO = userMapper.userToUserDTO(user.get(0));
        String token = jwtConfig.generateToken(adminDTO);
        
        Log.info("END - login - END");
        
        return new ResponseEntity<>(token, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Register user", tags = Constants.TAG_USER)
    @PostMapping(path = "/register", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        Log.info("START - register - START");
        Log.info("RequestBody register -> " + userDTO.toString());

        List<User> user = userRepository.findByUsername(userDTO.getUsername());
        Boolean userAlreadyExists = this.userService.checkUserAlreadyExists(userDTO, user);

        if (userAlreadyExists) return new ResponseEntity<>(Constants.ERROR_USER_ALREADY_EXISTS, HttpStatusCode.valueOf(500));

        User userToSave = userMapper.userDTOToUser(userDTO);
        userRepository.save(userToSave);
        String token = jwtConfig.generateToken(userDTO);
        
        Log.info("END - register - END");
        
        return new ResponseEntity<>(token, HttpStatusCode.valueOf(200));
    }
}
