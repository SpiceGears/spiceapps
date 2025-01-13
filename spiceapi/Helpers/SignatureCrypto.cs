using Newtonsoft.Json;
using Serilog;
using SpiceAPI;
using System;
using System.Security.Cryptography;
using System.Text;

public class SignatureCrypto
{
    private const string PublicKeyId = "rsa-public-key";
    private const string PrivateKeyId = "rsa-private-key";

    RSACryptoServiceProvider rsa;

    private readonly DataContext db;



    public SignatureCrypto(DataContext data)
    {
        this.db = data;
        RSAParameters rsp = Initialize();
        rsa = new RSACryptoServiceProvider();
        rsa.ImportParameters(rsp);
    }


    public bool VerifyData(string data, string signature) 
    {
        return rsa.VerifyData(Encoding.UTF8.GetBytes(data), Convert.FromBase64String(signature), HashAlgorithmName.SHA512, RSASignaturePadding.Pkcs1);
    }

    public byte[] SignData(string data) 
    {
        return rsa.SignData(Encoding.UTF8.GetBytes(data), HashAlgorithmName.SHA512, RSASignaturePadding.Pkcs1);
    }

    public RSAParameters Initialize()
    {
        RSAParam parameters = db.RSAParams.Find("default");
        RSAParameters rpara;

        if (parameters != null)
        {
            rpara = JsonConvert.DeserializeObject<RSAParameters>(parameters.Parameters);
        }
        else
        {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                rsa.PersistKeyInCsp = false;
                rpara = rsa.ExportParameters(true);
                RSAParam rpn = new RSAParam();
                rpn.Key = "default";
                rpn.Parameters = JsonConvert.SerializeObject(rpara);
                db.RSAParams.Add(rpn);
                db.SaveChanges();
            }
        }

        return rpara;
    }
}
