using NUnit.Framework;
using System.IO;
using System.Threading.Tasks;

namespace Univie.Assistant.Crawler.Test
{
  public class ContentDownloaderTest
  {
    [Test]
    public async Task GetMainContent()
    {
      var contentDownloader = new ContentDownloader();

      var content = await contentDownloader.GetMainContent();

      Assert.That(content, Is.Not.Empty);
      Assert.That(content, Does.Contain("vvz_sub.html"));
    }

    [Test]
    public async Task GetCourseListContent()
    {
      var contentDownloader = new ContentDownloader();

      var content = await contentDownloader.GetCourseListContent(new MainTableOfContentEntry("unused", "2022S", 274408));

      Assert.That(content, Is.Not.Empty);
      Assert.That(content, Does.Contain(@"structure current=""2022S"""));
      Assert.That(content, Does.Contain(@"module id=""274408"""));
    }

    [Test]
    public async Task GetCourseEntryContent()
    {
      var contentDownloader = new ContentDownloader();

      var content = await contentDownloader.GetCourseEntryContent(new CourseEntry("350172", "2022S"));

      Assert.That(content, Is.Not.Empty);
      Assert.That(content, Does.Contain(@"course id=""350172"" when=""2022S"""));
    }
  }
}