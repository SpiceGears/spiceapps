using System.ComponentModel.DataAnnotations;

public class ErrorResponse
{
    public string Error { get; set; }
    public string Description { get; set; }
    public string Code { get; set; }

    public List<ErrorResponse> innerErrors { get; set; }

    public ErrorResponse() { }
    public ErrorResponse(string name, string code, string description = "An unknown error occured", List<ErrorResponse>? inner = null)
    {
        this.Code = code;
        this.Description = description;
        if (inner == null) this.innerErrors = new List<ErrorResponse>();
        else this.innerErrors = inner;
        this.Error = name;
    }
}

public class LoginErrorAttempt
{
    [Key]
    public string Ip { get; set; }
    public int RetryCount { get; set; }
    public DateTime LastRetry { get; set; }
}