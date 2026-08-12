# Admin credentials

The application never stores the real admin username or password in tracked source files.

## Option 1: local development file

1. Copy `config/local-secrets.properties.example` to `config/local-secrets.properties`.
2. Set the two values in the copied file:

   ```properties
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=a-long-unique-password
   ```

3. Start the application normally. Spring Boot reads this file automatically. The real file is ignored by Git.

## Option 2: environment variables

In PowerShell, set the values for the current terminal session, then start the app from that same terminal:

```powershell
$env:ADMIN_USERNAME = "your-admin-username"
$env:ADMIN_PASSWORD = "a-long-unique-password"
.\mvnw.cmd spring-boot:run
```

For IntelliJ IDEA, open **Run > Edit Configurations**, select the Spring Boot configuration, and add `ADMIN_USERNAME` and `ADMIN_PASSWORD` in **Environment variables**. Do not add the credentials to `application.properties`.

If neither option is configured, startup intentionally fails with a message explaining which variables are missing.
