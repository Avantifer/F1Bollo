package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Account;
import formula.bollo.app.model.AccountDTO;

@Component
public interface AccountMapper {
    Account accountDTOToAccount(AccountDTO accountDTO);

    AccountDTO accountToAccountDTO(Account account);
}
