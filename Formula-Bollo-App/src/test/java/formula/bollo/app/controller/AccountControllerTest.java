package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.AccountDTO;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class AccountControllerTest {
    
    @Autowired
    private AccountController accountController;

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void loginUser() {
        AccountDTO accountDTO = new AccountDTO(1L, "Avantifer", "fer123", 1, "ferenandoruiz@gmail.com");
        ResponseEntity<String> response = this.accountController.login(accountDTO);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void loginUserBad() {
        AccountDTO accountDTO = new AccountDTO(1L, "Avantifer", "fer12", 1, "ferenandoruiz@gmail.com");
        ResponseEntity<String> response = this.accountController.login(accountDTO);
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
        assertEquals("Las credenciales no son válidas", response.getBody());
    }

    @Test
    @DirtiesContext
    void register() {
        AccountDTO accountDTO = new AccountDTO(1L, "Avantifer", "fer123", 1, "fermaf2015@gmail.com");
        ResponseEntity<String> response = this.accountController.register(accountDTO);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    void registerNoPassword() {
        AccountDTO accountDTO = new AccountDTO(1L, "Avantifer", null, 1, "fermaf2015@gmail.com");
        ResponseEntity<String> response = this.accountController.register(accountDTO);
        assertEquals("Tienes que poner contraseña", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void registerUsernameAndEmailExists() {
        AccountDTO accountDTO = new AccountDTO(1L, "Avantifer", "fer123", 1, "fermaf2015@gmail.com");
        ResponseEntity<String> response = this.accountController.register(accountDTO);
        assertEquals("El usuario ya existe con ese nombre", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());

        accountDTO = new AccountDTO(1L, "Ferchivon", "fer123", 1, "ferenandoruiz@gmail.com");
        response = this.accountController.register(accountDTO);
        assertEquals("El correo ya ha sido utilizado", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void recoverPassword() {
        ResponseEntity<String> response = this.accountController.recoverPassword("ferenandoruiz@gmail.com");
        assertEquals("Se ha enviado el correo correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    void recoverPasswordAccountNotExists() {
        ResponseEntity<String> response = this.accountController.recoverPassword("ferenandoruiz@gmail.com");
        assertEquals("El usuario no existe", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void changePassword() {
        ResponseEntity<String> response = this.accountController.changePassword("fer", "Avantifer");
        assertEquals("Se ha cambiado la contraseña correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void changePasswordUsernameError() {
        ResponseEntity<String> response = this.accountController.changePassword("fer", "Ferchivon");
        assertEquals("No se ha podido encontrar el usuario", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD)
    void getUserById() {
        AccountDTO account = this.accountController.getUserById(1);
        assertNotNull(account);
        assertEquals("Avantifer", account.getUsername());
    }

    @Test
    @DirtiesContext
    void getUserByIdNotFound() {
        AccountDTO account = this.accountController.getUserById(1);
        assertNull(account);
    }
}
