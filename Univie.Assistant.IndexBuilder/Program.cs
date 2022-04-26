using Univie.Assistant.IndexBuilder;

if (args.Length != 2)
{
  Console.Error.WriteLine("Usage: Univie.Assistant.IndexBuilder.exe <path to xmls> <filename for index>");
  return;
}

if (Directory.Exists(args[0]) == false)
{
  Console.Error.WriteLine("Usage: Univie.Assistant.IndexBuilder.exe <path to xmls> <filename for index>");
  Console.Error.WriteLine($"Directory '{args[0]}' does not exist.");
  return;
}

if (File.Exists(args[1]))
{
  Console.Error.WriteLine("Usage: Univie.Assistant.IndexBuilder.exe <path to xmls> <filename for index>");
  Console.Error.WriteLine($"File '{args[1]}' already exist.");
  return;
}

var coursesFiles = Directory.EnumerateFiles(args[0], "courses_*.xml").ToArray();
var courseFiles = Directory.EnumerateFiles(args[0], "course_*.xml").ToArray();

if (coursesFiles.Count() < 0)
{
  Console.Error.WriteLine("Usage: Univie.Assistant.IndexBuilder.exe <path to xmls> <filename for index>");
  Console.Error.WriteLine($"Directory '{args[0]}' seems empty.");
}

var indexBuilder = new IndexBuilder();
var index = indexBuilder.Build(coursesFiles, courseFiles);
new IndexWriter().Write(index, args[1]);

Console.WriteLine($"Index written at '{args[1]}'");
