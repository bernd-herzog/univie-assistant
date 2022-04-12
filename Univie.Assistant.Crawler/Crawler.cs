namespace Univie.Assistant.Crawler
{
  public class Crawler
  {
    private const string c_logName = "Univie.Assistant.Crawler";

    public ContentDownloader ContentDownloader { get; set; }
    public ContentParser ContentParser { get; set; }

    public Crawler(ContentDownloader contentDownloader, ContentParser contentParser)
    {
      ContentDownloader = contentDownloader;
      ContentParser = contentParser;
    }

    public async Task Run()
    {
      var mainContent = await ContentDownloader.GetMainContent();
      var mainTableOfContent = ContentParser.ParseMainTableOfContent(mainContent);

      var courseEntryList = new List<CourseEntry>();

      int i = 1;
      foreach (var mainTableOfContentEntry in mainTableOfContent)
      {
        Console.WriteLine($"{c_logName}: Downloading module {mainTableOfContentEntry.Link} ({i++} of {mainTableOfContent.Length})");

        var courseListContent = await ContentDownloader.GetCourseListContent(mainTableOfContentEntry);

        SaveContent($"courses_{mainTableOfContentEntry.Path}", courseListContent);

        var courseList = ContentParser.ParseCourseListContent(courseListContent, mainTableOfContentEntry.Semester);
        courseEntryList.AddRange(courseList);
      }

      i = 1;
      foreach (var courseEntryGroup in courseEntryList.GroupBy(_=>_.CourseID))
      {
        var courseEntry = courseEntryGroup.First();
        Console.WriteLine($"{c_logName}: Downloading course {courseEntry.CourseID} ({i++} of {courseEntryList.Count()})");

        var courseEntryContent = await ContentDownloader.GetCourseEntryContent(courseEntry);
        SaveContent($"course_{courseEntry.CourseID}", courseEntryContent);
      }
    }

    private void SaveContent(string name, string content)
    {
      if (Directory.Exists("./data") == false)
        Directory.CreateDirectory("./data");

      File.WriteAllText($"./data/{name}.xml", content);
    }
  }
}