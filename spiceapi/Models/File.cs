namespace SpiceAPI.Models
{
    public class SFile
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public List<string> Scopes { get; set; }
        public bool IsPublic { get; set; }
    }
}
