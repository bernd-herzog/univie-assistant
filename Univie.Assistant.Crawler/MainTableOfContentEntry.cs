namespace Univie.Assistant.Crawler
{
  public class MainTableOfContentEntry
  {
    public string Link { get; }
    public string Semester { get; }
    public int Path { get; }

    public MainTableOfContentEntry(string link, string semester, int path)
    {
      Link = link;
      Semester = semester;
      Path = path;
    }
  }
}