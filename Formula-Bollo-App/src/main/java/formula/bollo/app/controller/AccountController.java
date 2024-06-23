package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.config.JwtConfig;
import formula.bollo.app.entity.Account;
import formula.bollo.app.mapper.AccountMapper;
import formula.bollo.app.model.AccountDTO;
import formula.bollo.app.repository.AccountRepository;
import formula.bollo.app.services.EmailService;
import formula.bollo.app.services.AccountService;
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
@RequestMapping(path = {Constants.ENDPOINT_ACCOUNT}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_ACCOUNT, description = Constants.TAG_ACCOUNT_SUMMARY)
public class AccountController {
    
    private AccountRepository accountRepository;
    private AccountMapper accountMapper;
    private JwtConfig jwtConfig;
    private AccountService accountService;
    private EmailService emailService;

    public AccountController(
        AccountService accountService,
        AccountRepository accountRepository,
        AccountMapper accountMapper,
        JwtConfig jwtConfig,
        EmailService emailService
    ) {
        this.accountService = accountService;
        this.accountRepository = accountRepository;
        this.accountMapper = accountMapper;
        this.jwtConfig = jwtConfig;
        this.emailService = emailService;
    }

    @Operation(summary = "Login account", tags = Constants.TAG_ACCOUNT)
    @PostMapping(path = "/login", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody AccountDTO accountDTO) {
        Log.info("START - login - START");
        Log.info("RequestBody login -> " + accountDTO.toString());

        List<Account> account = accountRepository.findByUsername(accountDTO.getUsername());
        boolean goodCredentials = this.accountService.checkAccountCredentials(accountDTO, account);

        if (!goodCredentials) return new ResponseEntity<>(Constants.ERROR_INVALID_CREDENTIALS, HttpStatusCode.valueOf(500));

        AccountDTO adminDTO = accountMapper.accountToAccountDTO(account.get(0));
        String token = jwtConfig.generateToken(adminDTO);
        
        Log.info("END - login - END");
        
        return new ResponseEntity<>(token, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Register account", tags = Constants.TAG_ACCOUNT)
    @PostMapping(path = "/register", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody AccountDTO accountDTO) {
        Log.info("START - register - START");
        Log.info("RequestBody register -> " + accountDTO.toString());

        if (accountDTO.getPassword() == null) return new ResponseEntity<>("Tienes que poner contraseña", HttpStatusCode.valueOf(500));
        List<Account> account = accountRepository.findByUsername(accountDTO.getUsername());
        boolean usernameAlreadyExists = this.accountService.checkAccountAlreadyExists(accountDTO, account);

        account = accountRepository.findByEmail(accountDTO.getEmail());
        boolean emailAlreadyExists = this.accountService.checkAccountAlreadyExists(accountDTO, account);

        if (usernameAlreadyExists) return new ResponseEntity<>(Constants.ERROR_USERNAME_ALREADY_EXISTS, HttpStatusCode.valueOf(500));
        if (emailAlreadyExists) return new ResponseEntity<>(Constants.ERROR_EMAIL_ALREADY_EXISTS, HttpStatusCode.valueOf(500));

        Account accountToSave = accountMapper.accountDTOToAccount(accountDTO);
        accountRepository.save(accountToSave);
        List<Account> accountRegistered = this.accountRepository.findByUsername(accountDTO.getUsername());

        AccountDTO accountToGetToken = this.accountMapper.accountToAccountDTO(accountRegistered.get(0));
        String token = jwtConfig.generateToken(accountToGetToken);
        
        Log.info("END - register - END");
        
        return new ResponseEntity<>(token, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Recover Password", tags =  Constants.TAG_ACCOUNT)
    @PostMapping(path = "/recoverPassword", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> recoverPassword(@RequestParam(value = "email", required = true) String email) {
        Log.info("START - recoverPassword - START");
        Log.info("RequestParam recoverPassword (email) -> " + email);

        List<Account> account = accountRepository.findByEmail(email);

        if (account.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_ACCOUNT_NOT_EXISTS);
        }

        AccountDTO accountDTO = accountMapper.accountToAccountDTO(account.get(0));
        String token = jwtConfig.generateToken(accountDTO);
        String link = Constants.PRODUCTION_FRONTEND + "fantasy/recoverPassword/" + token;
        String message = """
                Para recuperar la contraseña, haz click en el siguiente enlace:
                %s
                """.formatted(link);

        this.emailService.sendSimpleMessage(accountDTO.getEmail(), "Contraseña olvidada", message);

        Log.info("END - recoverPassword - END");
        return new ResponseEntity<>("Se ha enviado el correo correctamente", HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Change Password", tags =  Constants.TAG_ACCOUNT)
    @PostMapping(path = "/changePassword", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> changePassword(@RequestParam(value = "password", required = true) String password, @RequestParam(value = "username", required = true) String username) {
        Log.info("START - changePassword - START");
        Log.info("RequestParam changePassword (password) -> " + password);
        Log.info("RequestParam changePassword (username) -> " + username);

        List<Account> account = accountRepository.findByUsername(username);
        if (account.isEmpty()) {
            return new ResponseEntity<>("No se ha podido encontrar el usuario", HttpStatusCode.valueOf(500));
        }

        account.get(0).setPassword(accountService.encryptPassword(password));
        accountRepository.save(account.get(0));

        Log.info("END - changePassword - END");
        return new ResponseEntity<>("Se ha cambiado la contraseña correctamente", HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get account by id", tags = Constants.TAG_ACCOUNT)
    @GetMapping("/id")
    public AccountDTO getUserById(@RequestParam Integer id) {
        Log.info("START - getUserById - START");
        Log.info("RequestParam getUserById (id) -> " + id);

        Account account = accountRepository.findById((long) id).orElse(null);
        AccountDTO accountDTO = null;
        if (account != null) {
            accountDTO = accountMapper.accountToAccountDTO(account);
        }

        Log.info("END - getUserById - END");

        return accountDTO;
    }
}
