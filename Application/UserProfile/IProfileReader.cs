using System.Threading.Tasks;

namespace Application.UserProfile
{
    public interface IProfileReader
    {
        Task<UserProfileDto> ReadProfile(string username);
    }
}