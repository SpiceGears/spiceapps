using BCrypt;
using BCrypt.Net;
using Serilog;


namespace SpiceAPI.Helpers
{
    public class Crypto
    {
        public int timeCost = 14;

        public readonly char[] Alphanumeric =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();

        public readonly char[] TokenFormat =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_-".ToCharArray();

        public string Hash(string text) { 
            return BCrypt.Net.BCrypt.EnhancedHashPassword(text, timeCost); 
        }

        public bool TestPassword(string input, string hash)
        {
            return BCrypt.Net.BCrypt.EnhancedVerify(input, hash);
        }

        public bool NeedsReset(string hash) 
        {
            return BCrypt.Net.BCrypt.PasswordNeedsRehash(hash, timeCost);
        }

        public void Setup() 
        {
            string? cost = Environment.GetEnvironmentVariable("CRYPT_COST");
            if (!string.IsNullOrEmpty(cost)) 
            {
                try
                {
                    timeCost = int.Parse(cost);
                    Log.Information($"Crypt Time cost: {timeCost}");
                }
                catch (Exception ex)
                {
                    Log.Fatal($"Cannot set the cost factor to {cost}", ex);
                    throw;
                }
            }
            else 
            {
                Log.Warning($"Using default crypt cost factor {timeCost}");
            }

        }

        public Crypto() 
        {
            Setup();
        }

        public string RandomAlphanumericString(int length) 
        {
            return System.Security.Cryptography.RandomNumberGenerator.GetString(Alphanumeric, length);
        }

        public string RandomToken(int length)
        {
            return System.Security.Cryptography.RandomNumberGenerator.GetString(TokenFormat, length);
        }
    }
}
