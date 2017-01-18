package DateUtil;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.text.ParsePosition;

public class DateFormatter {

    public static void main(String[] args) {
        String dateInString = "2015-01-05T00:00:00.000+03:00";
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ") {
            public Date parse(String source, ParsePosition pos) {
                return super.parse(source.replaceFirst(":(?=[0-9]{2}$)", ""), pos);
            }
        };
        formatter.setTimeZone(TimeZone.getTimeZone("GMT"));
        try {
            Date date = formatter.parse(dateInString);
            System.out.println(date);
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
