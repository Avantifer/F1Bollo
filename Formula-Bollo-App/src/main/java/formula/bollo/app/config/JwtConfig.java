package formula.bollo.app.config;

import java.io.Serializable;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import formula.bollo.app.model.AccountDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtConfig implements Serializable {
    private Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long serialVersionUID = -2550185165626007488L;
    public static final int JWT_TOKEN_VALIDITY = 60 * 24 * 30; // 30 days expiration

    @Value("${jwt.secret}")
    private String secret;

    /**
     * Generate a JWT token for the account.
     *
     * @param accountDTO AccountDTO
     * @return JWT token generated for the account
     */
    public String generateToken(AccountDTO accountDTO) {
        Date expiration = Date.from(LocalDateTime.now().plusMinutes(JWT_TOKEN_VALIDITY).atZone(ZoneId.systemDefault()).toInstant());

        return Jwts.builder()
                .setSubject(accountDTO.getUsername())
                .claim("userId", accountDTO.getId())
                .claim("admin", accountDTO.getAdmin())
                .setIssuedAt(new Date())
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
    }
}
