package formula.bollo.app.config;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import formula.bollo.app.model.AdminDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtConfig implements Serializable {
    private SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long serialVersionUID = -2550185165626007488L;
    public static final int JWT_TOKEN_VALIDITY = 60 * 24 * 30; // 30 days expiration

    @Value("${jwt.secret}")
	private String secret;

    /**
     * generate token for user
     * @param adminDTO
     * @return token generated for the user
    */
	public String generateToken(AdminDTO adminDTO) {
        Date expiration = Date.from(LocalDateTime.now().plusMinutes(JWT_TOKEN_VALIDITY).atZone(ZoneId.systemDefault()).toInstant());

		return Jwts.builder()
                .setSubject(adminDTO.getUsername())
                .claim("userId", adminDTO.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
	}

    /**
     * Obtain the userId of token
     *
     * @param token JWT token
     * @return the userId of the jwt or null if its cannot be extracted
     */
    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
            return claims.get("userId", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Know if the token its valid
     * @param adminDTO
     * @return token is valid or not
    */
	public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
