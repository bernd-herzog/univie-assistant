namespace Univie.Assistant.IndexBuilder
{
  public interface IIndex
  {
    public Dictionary<string, (string Name, string Parent)> Modules { get; }
    public Dictionary<string, (string LongName, string ModuleID, string Type)> Courses { get; }
    public List<(string Start, string End, string Room)> Events { get; }
  }
}