using System.Text.RegularExpressions;
using System.Xml;

namespace Univie.Assistant.Crawler
{
  public class ContentParser
  {
    public MainTableOfContentEntry[] ParseMainTableOfContent(string mainContent)
    {
      var matches = Regex.Matches(mainContent, @"<a class=""name"" href=""([^""]+)"">");

      return matches
        .Select(match => match.Groups[1].Value)
        .Select(MainTableOfContentEntryFromLink)
        .ToArray();
    }

    private MainTableOfContentEntry MainTableOfContentEntryFromLink(string link)
    {
      var match = Regex.Match(link, @"vvz_sub\.html\?from=1&amp;to=2&amp;semester=(\d+\w)&amp;path=(\d+)");

      return new MainTableOfContentEntry(link, match.Groups[1].Value, int.Parse(match.Groups[2].Value));
    }

    public CourseEntry[] ParseCourseListContent(string courseListContent, string semester)
    {
      var courseEntryList = new List<CourseEntry>();
      var xmlDocument = new XmlDocument();
      xmlDocument.LoadXml(courseListContent);

      var courses = xmlDocument.DocumentElement?.SelectNodes("//course");

      if (courses != null)
      {
        foreach (var course in courses.Cast<XmlNode>())
        {
          var idAttribute = course.SelectSingleNode("./@id");

          courseEntryList.Add(new CourseEntry(idAttribute?.Value ?? "0", semester));
        }
      }

      return courseEntryList.ToArray();
    }
  }
}