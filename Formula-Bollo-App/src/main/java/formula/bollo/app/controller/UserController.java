package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.config.JwtConfig;
import formula.bollo.app.entity.User;
import formula.bollo.app.mapper.UserMapper;
import formula.bollo.app.model.UserDTO;
import formula.bollo.app.repository.UserRepository;
import formula.bollo.app.services.EmailService;
import formula.bollo.app.services.UserService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.http.HttpStatus;
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
    private EmailService emailService;

    public UserController(
        UserService userService,
        UserRepository userRepository,
        UserMapper userMapper,
        JwtConfig jwtConfig,
        EmailService emailService
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtConfig = jwtConfig;
        this.emailService = emailService;
    }

    @Operation(summary = "Login user", tags = Constants.TAG_USER)
    @PostMapping(path = "/login", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        Log.info("START - login - START");
        Log.info("RequestBody login -> " + userDTO.toString());

        List<User> user = userRepository.findByUsername(userDTO.getUsername());
        boolean goodCredentials = this.userService.checkUserCredentials(userDTO, user);

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
        boolean usernameAlreadyExists = this.userService.checkUserAlreadyExists(userDTO, user);

        user = userRepository.findByEmail(userDTO.getEmail());
        boolean emailAlreadyExists = this.userService.checkUserAlreadyExists(userDTO, user);

        if (usernameAlreadyExists) return new ResponseEntity<>(Constants.ERROR_USERNAME_ALREADY_EXISTS, HttpStatusCode.valueOf(500));
        if (emailAlreadyExists) return new ResponseEntity<>(Constants.ERROR_EMAIL_ALREADY_EXISTS, HttpStatusCode.valueOf(500));

        User userToSave = userMapper.userDTOToUser(userDTO);
        userRepository.save(userToSave);
        List<User> userRegistered = this.userRepository.findByUsername(userDTO.getUsername());
        Log.info(userRegistered.get(0).toString());

        UserDTO userToGetToken = this.userMapper.userToUserDTO(userRegistered.get(0));
        String token = jwtConfig.generateToken(userToGetToken);
        
        Log.info("END - register - END");
        
        return new ResponseEntity<>(token, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Recover Password", tags =  Constants.TAG_USER)
    @PostMapping(path = "/recoverPassword", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> recoverPassword(@RequestParam(value = "email", required = true) String email) {
        Log.info("START - recoverPassword - START");
        Log.info("RequestParam recoverPassword (email) -> " + email);

        List<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_USER_NOT_EXISTS);
        }

        UserDTO userDTO = userMapper.userToUserDTO(user.get(0));
        String token = jwtConfig.generateToken(userDTO);
        String link = Constants.PRODUCTION_FRONTEND + "fantasy/recoverPassword/" + token;
        String message = """
                Para recuperar la contraseña, haz click en el siguiente enlace:
                %s
                """.formatted(link);

        this.emailService.sendSimpleMessage(userDTO.getEmail(), "Contraseña olvidada", message);

        Log.info("END - recoverPassword - END");
        return new ResponseEntity<>("Se ha enviado el correo correctamente", HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Change Password", tags =  Constants.TAG_USER)
    @PostMapping(path = "/changePassword", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> changePassword(@RequestParam(value = "password", required = true) String password, @RequestParam(value = "username", required = true) String username) {
        Log.info("START - changePassword - START");
        Log.info("RequestParam changePassword (password) -> " + password);
        Log.info("RequestParam changePassword (username) -> " + password);

        List<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<>("No se ha podido encontrar el usuario", HttpStatusCode.valueOf(500));
        }

        user.get(0).setPassword(userService.encryptPassword(password));
        userRepository.save(user.get(0));

        Log.info("END - changePassword - END");
        return new ResponseEntity<>("Se ha cambiado la contraseña correctamente", HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get user by id", tags = Constants.TAG_USER)
    @GetMapping("/id")
    public User getUserById(@RequestParam Integer id) {
        Log.info("START - getUserById - START");
        Log.info("RequestParam getUserById (id) -> " + id);

        User user = userRepository.findById((long) id).orElse(null);

        Log.info("END - getUserById - END");

        return user;
    }
}
