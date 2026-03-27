using Domain.Entities;
namespace Application.Abstractions
{
    public interface ITokenService
    {
        public string CreateJWTToken(User user, IList<string> roles);
    }
}
