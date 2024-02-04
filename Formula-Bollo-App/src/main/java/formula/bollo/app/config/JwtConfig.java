package formula.bollo.app.config;

import java.io.Serializable;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import formula.bollo.app.model.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
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
     * Generate a JWT token for the user.
     *
     * @param userDTO UserDTO
     * @return JWT token generated for the user
     */
    public String generateToken(UserDTO userDTO) {
        Date expiration = Date.from(LocalDateTime.now().plusMinutes(JWT_TOKEN_VALIDITY).atZone(ZoneId.systemDefault()).toInstant());

        return Jwts.builder()
                .setSubject(userDTO.getUsername())
                .claim("userId", userDTO.getId())
                .claim("admin", userDTO.getAdmin())
                .setIssuedAt(new Date())
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    /**
     * Obtain the userId from a JWT token.
     *
     * @param token JWT token
     * @return the userId extracted from the JWT or null if it cannot be extracted
     */
    public String getUserIdFromToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            Claims claims = claimsJws.getBody();
            return claims.get("userId", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Check if a JWT token is valid.
     *
     * @param token JWT token
     * @return true if the token is valid, false otherwise
     */
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
