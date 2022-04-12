namespace Univie.Assistant.Crawler
{
  public class CourseEntry
  {
    public string CourseID { get;}
    public string Semester { get;}

    public CourseEntry(string courseID, string semester)
    {
      CourseID = courseID;
      Semester = semester;
    }
  }
}