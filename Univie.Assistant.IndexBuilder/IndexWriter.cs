using ICSharpCode.SharpZipLib.GZip;
using System.Text;
using System.Text.Json;

namespace Univie.Assistant.IndexBuilder
{
  public class IndexWriter
  {
    public IndexWriter()
    {
    }

    public void Write(Index index, string path)
    {
      string jsonString = JsonSerializer.Serialize(index);

      using var filestream = File.Open(path, FileMode.CreateNew, FileAccess.Write);

      using var outStream = new GZipOutputStream(filestream);
      var uniEncoding = Encoding.UTF8;
      using var sw = new StreamWriter(outStream, uniEncoding);
      sw.Write(jsonString);
    }
  }
}