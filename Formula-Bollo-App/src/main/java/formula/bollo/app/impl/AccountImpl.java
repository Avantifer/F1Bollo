package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import formula.bollo.app.entity.Account;
import formula.bollo.app.mapper.AccountMapper;
import formula.bollo.app.model.AccountDTO;

@Configuration
public class AccountImpl implements AccountMapper {
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Converts an AccountDTO object to an Account object.
     *
     * @param accountDTO The AccountDTO object to be converted.
     * @return         An Account object with properties copied from the AccountDTO.
    */
    @Override
    public Account accountDTOToAccount(AccountDTO accountDTO) {
        Account account = new Account();
        BeanUtils.copyProperties(accountDTO, account);
        account.setPassword(this.passwordEncoder.encode(accountDTO.getPassword()));
        return account;
    }

    /**
     * Converts an Account object to an AccountDTO object.
     *
     * @param account The Account object to be converted.
     * @return      An AccountDTO object with properties copied from the Account.
    */
    @Override
    public AccountDTO accountToAccountDTO(Account account) {
        AccountDTO accountDTO = new AccountDTO();
        BeanUtils.copyProperties(account, accountDTO);
        return accountDTO;
    }
}
