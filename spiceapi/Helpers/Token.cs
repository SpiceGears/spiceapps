using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Serilog;
using SpiceAPI.Models;
using System.Buffers.Text;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SpiceAPI.Auth
{
    public class Token
    {

        private readonly SignatureCrypto sc;
        private readonly DataContext db;
        public Token(SignatureCrypto _sc, DataContext db)
        {
            sc = _sc;
            this.db = db;
        }

        public string GenerateToken(UserToken token)
        {
            // Serialize the UserToken to JSON
            string tokenstr = System.Text.Json.JsonSerializer.Serialize(token, new JsonSerializerOptions() { AllowTrailingCommas = false, WriteIndented = false});


            // Base64 encode the serialized token string for transmission
            string tokenBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenstr), Base64FormattingOptions.None);

            // Sign the original serialized string (not the base64)
            string signature = Convert.ToBase64String(sc.SignData(tokenstr), Base64FormattingOptions.None);


            // Return the token + signature in the expected format
            return $"{tokenBase64}.{signature}";
        }


        public bool VerifyToken(string b64token)
        {
            // Split the token into its components: the base64-encoded token and the signature
            string[] token = b64token.Split('.');



            // Decode the base64 token to retrieve the original serialized token string
            string tokenstr = Encoding.UTF8.GetString(Convert.FromBase64String(token[0]));

            if (sc.VerifyData(tokenstr, token[1])) 
            { 
                UserToken tok = JsonConvert.DeserializeObject<UserToken>(tokenstr);
                if (tok.Expires > DateTime.UtcNow) return true;
                else return false;
            }

            // Verify the signature by comparing it to the original (non-encoded) token string
            else return false;
        }


        public async Task<User?> RetrieveUser(string b64token) 
        {
            string[] token = b64token.Split('.');
            
            Log.Logger.Information(Encoding.UTF8.GetString(
                    Convert.FromBase64String(token[0])
                    ));
            
            UserToken? ut = System.Text.Json.JsonSerializer.Deserialize<UserToken>(
                Encoding.UTF8.GetString(
                    Convert.FromBase64String(token[0])
                    )
                );
            if (ut == null) return null;
            return await db.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == ut.Sub);

        }

        
    }
    public class RefreshToken
    {
        [Key]
        public string Token { get; set; }
        public Guid UserID { get; set; }
    }
}
