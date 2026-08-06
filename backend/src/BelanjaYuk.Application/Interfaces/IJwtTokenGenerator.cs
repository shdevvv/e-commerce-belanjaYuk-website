using BelanjaYuk.Domain.Entities;

namespace BelanjaYuk.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(MsUser user);
}
