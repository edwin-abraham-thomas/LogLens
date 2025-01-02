export class LogParser {
  public static tryParseJson(str: string): object | null {
    let jsonObject: object;
    try {
      jsonObject = JSON.parse(str);
    } catch (e) {
      return null;
    }
    return jsonObject;
  }
}
