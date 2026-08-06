using BelanjaYuk.Application.Interfaces;
using BCrypt.Net;

namespace BelanjaYuk.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        if (string.IsNullOrEmpty(passwordHash)) return false;
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
