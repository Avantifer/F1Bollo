package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.AccountDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class AccountTest {

    @Value("${test.username}")
    private String username;

    @Value("${test.password}")
    private String password;

    @Value("${test.newUsername}")
    private String newUsername;

    @Value("${test.newPassword}")
    private String newPassword;

    @Value("${test.email}")
    private String email;

    @Value("${test.newEmail}")
    private String newEmail;
    
    @Test
    void testAccountAnnotations() {
        Account account = new Account();
        account.setId(1L);
        account.setUsername(username);
        account.setPassword(password);
        account.setAdmin(1);
        account.setEmail(email);

        // @Getter
        assertEquals(1L, account.getId());
        assertEquals(username, account.getUsername());
        assertEquals(password, account.getPassword());
        assertEquals(1, account.getAdmin());
        assertEquals(email, account.getEmail());

        // @Setter
        account.setUsername(newUsername);
        account.setPassword(newPassword);
        account.setAdmin(0);
        account.setEmail(newEmail);

        assertEquals(newUsername, account.getUsername());
        assertEquals(newPassword, account.getPassword());
        assertEquals(0, account.getAdmin());
        assertEquals(newEmail, account.getEmail());

        // @ToString
        String expectedToString = "Account(id=1, username=" + newUsername + ", password=" + newPassword + ", admin=0, email=" + newEmail + ")";
        assertEquals(expectedToString, account.toString());

        // @AllArgsConstructor
        Account allArgsAccount = new Account(1L, newUsername, newPassword, 0, newEmail);
        assertEquals(account, allArgsAccount);

        // @NoArgsConstructor
        Account noArgsConstructorAccount = new Account();
        assertNotNull(noArgsConstructorAccount);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Account.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testAccountDTOAnnotations() {
        // @NoArgsConstructor
        AccountDTO noArgsConstructorDTO = new AccountDTO();
        assertNotNull(noArgsConstructorDTO);

        // @AllArgsConstructor
        AccountDTO allArgsConstructorDTO = new AccountDTO(1L, username, password, 1, email);
        assertEquals(1L, allArgsConstructorDTO.getId());
        assertEquals(username, allArgsConstructorDTO.getUsername());
        assertEquals(password, allArgsConstructorDTO.getPassword());
        assertEquals(1, allArgsConstructorDTO.getAdmin());
        assertEquals(email, allArgsConstructorDTO.getEmail());

        // @Getter
        assertEquals(1L, allArgsConstructorDTO.getId());
        assertEquals(username, allArgsConstructorDTO.getUsername());
        assertEquals(password, allArgsConstructorDTO.getPassword());
        assertEquals(1, allArgsConstructorDTO.getAdmin());
        assertEquals(email, allArgsConstructorDTO.getEmail());

        // @Setter
        allArgsConstructorDTO.setUsername(newUsername);
        allArgsConstructorDTO.setPassword(newPassword);
        allArgsConstructorDTO.setAdmin(0);
        allArgsConstructorDTO.setEmail(email);

        assertEquals(newUsername, allArgsConstructorDTO.getUsername());
        assertEquals(newPassword, allArgsConstructorDTO.getPassword());
        assertEquals(0, allArgsConstructorDTO.getAdmin());
        assertEquals(email, allArgsConstructorDTO.getEmail());

        // @ToString
        String expectedToString = "AccountDTO(id=1, username=newUser, password=newPassword, admin=0, email=user123@example.com)";
        assertEquals(expectedToString, allArgsConstructorDTO.toString());

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(AccountDTO.class).verify();
    }
}
