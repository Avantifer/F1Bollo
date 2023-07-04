package formula.bollo.app.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;

public class EnvConfig {
    private static final Dotenv dotenv = Dotenv.configure().directory(".").ignoreIfMalformed().ignoreIfMissing().load();

    private EnvConfig() { }

    public static void load() {
        dotenv.entries().forEach((DotenvEntry entry) -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
