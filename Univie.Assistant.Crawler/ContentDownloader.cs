namespace Univie.Assistant.Crawler
{
  public class ContentDownloader
  {
    public HttpClient HttpClient { get; set; }
    public ContentDownloader()
    {
      HttpClient = new HttpClient();
    }
    public async Task<string> GetMainContent()
    {
      var httpResponseMessage = await HttpClient.GetAsync("https://ufind.univie.ac.at/cache/de/main.html");

      httpResponseMessage.EnsureSuccessStatusCode();

      return await httpResponseMessage.Content.ReadAsStringAsync();
    }

    public async Task<string> GetCourseListContent(MainTableOfContentEntry mainTableOfContentEntry)
    {
      var httpResponseMessage = await HttpClient.GetAsync($"https://m2-ufind.univie.ac.at/courses/browse/{mainTableOfContentEntry.Path}?from=1&to=12");
     
      httpResponseMessage.EnsureSuccessStatusCode();

      return await httpResponseMessage.Content.ReadAsStringAsync();
    }

    public async Task<string> GetCourseEntryContent(CourseEntry courseEntry)
    {
      var httpResponseMessage = await HttpClient.GetAsync($"https://m1-ufind.univie.ac.at/courses/{courseEntry.CourseID}/{courseEntry.Semester}");

      httpResponseMessage.EnsureSuccessStatusCode();

      return await httpResponseMessage.Content.ReadAsStringAsync();
    }
  }
}
