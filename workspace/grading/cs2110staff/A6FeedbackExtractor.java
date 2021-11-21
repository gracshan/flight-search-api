package cs2110staff;

import java.io.*;
import static java.nio.charset.StandardCharsets.UTF_8;
import java.util.*;
import org.apache.commons.csv.*;

/** Generates feedback files from rubric spreadsheet. */
public class A6FeedbackExtractor {
    /** Parsed rubric data */
    private final List<CSVRecord> records;

    /** Number of groups with scores in rubric data */
    private final int nGroups;

    /** Construct a new instance from parsed rubric data. */
    private A6FeedbackExtractor(List<CSVRecord> records) {
        this.records = records;
        nGroups = (records.get(0).size() - 3)/2;
    }

    /**
     * Return column index (0-based) that the specified group number's
     * (0-based) scores are in.  Comments are in the next column.
     */
    private static int groupColumn(int group) {
        return 2*group + 3;
    }

    /** Convert column index (0-based) to spreadsheet header (A-based). */
    private static String spreadsheetColumnHeader(int col) {
        StringBuilder sb = new StringBuilder();
        while (col >= 0) {
            sb.append((char)('A' + col%26));
            col = col/26 - 1;
        }
        return sb.reverse().toString();
    }

    /**
     * Create a new A6FeedbackExtractor by parsing the data in the CSV file
     * with the specified filename.
     */
    public static A6FeedbackExtractor fromFile(String filename)
            throws IOException {
        // try-with-resources with no catch to handle closing
        try (Reader in = new FileReader(filename, UTF_8);
            final CSVParser parser = CSVFormat.EXCEL.parse(in)) {
            return new A6FeedbackExtractor(parser.getRecords());
        }
    }

    /**
     * Write text feedback (Markdown-compatible) for the group at the specified
     * index (0-based) to the provided writer.
     * @param grader Name of grader to include in feedback file
     */
    public void writeGroupFeedback(final String grader, final int group, final PrintWriter out) {
        // Column corresponding to group
        final int g = groupColumn(group);

        final Iterator<CSVRecord> it = records.iterator();

        // Get group name from column heading
        CSVRecord r = it.next();
        final String groupName = r.get(g);

        out.println("# A6 feedback for " + groupName);
        out.println();
        out.println("This is " + grader + ", grading your submission for A6.  You are implicitly awarded points (up to 100) for code that satisfies the requirements of the assignment.  If a requirement is not satisfied, a points deduction will be listed here under the appropriate heading, along with the text of the requirement (phrased in terms of what your code _should_ have done) and possibly some clarifying comments.  Additionally, penalties may be deducted for general errors (these are phrased in terms of what your code _shouldn't_ have done).  At the bottom is your total score.");

        // Interpret next row as a section header
        r = it.next();
        String sectionName = r.get(0);
        boolean newSection = true;

        // Loop over rows (multiple rows may be processed per iteration)
        while (it.hasNext()) {
            r = it.next();
            if (r.get(2).isEmpty()) {
                // Empty line indicates that a new section (or total) is next
                // Note: if next line is a total, it will not be printed here
                r = it.next();
                sectionName = r.get(0);
                newSection = true;
            } else {
                // Check for deduction
                final String points = r.get(g);
                final String comments = r.get(g + 1);
                if (!points.isEmpty() || !comments.isEmpty()) {
                    if (newSection) {
                        // Print section header
                        out.println();
                        out.println("Deductions for " + sectionName + ":");
                        newSection = false;
                    }
                    // Print deduction
                    out.println("* " + points + ": " + r.get(0));
                    if (!comments.isEmpty()) {
                        out.println("  > " + comments);
                    }
                }
            }
        }

        // Print total (assumed to be last line)
        out.println();
        out.println(r.get(0) + ": " + r.get(g) + " / 100");
    }

    /**
     * For each group in the parsed data, write a text feedback file with name
     * "feedback_for_GROUP.txt" in the current directory, where GROUP is the
     * group name (column header).
     * @param grader Name of grader to include in feedback file
     */
    public void writeFeedbackFiles(final String grader) throws IOException {
        for (int group = 0; group < nGroups; ++group) {
            // Get group name from column heading
            final int g = groupColumn(group);
            final String groupName = records.get(0).get(g);
            final String filename = groupName + "_feedback.txt";

            // Check for empty or misaligned columns
            if (groupName.equals("netid")) {
                System.err.println("Skipping unnamed group '" + groupName +
                        "' at column " + spreadsheetColumnHeader(g));
                continue;
            }
            if (groupName.equals("Comments")) {
                System.err.println("Expected group name in column " +
                        spreadsheetColumnHeader(g) +
                        " but found comments; please fix your spreadsheet");
                System.err.println("Skipping all subsequent columns");
                System.exit(1);
            }
            System.out.println("Writing feedback for " + groupName);

            // try-with-resources with no catch to handle closing
            try (PrintWriter out = new PrintWriter(filename, UTF_8)) {
                writeGroupFeedback(grader, group, out);
            }
        }
    }

    /**
     * Parse rubric data from CSV file specified in args and write feedback
     * files for all groups to the current directory.
     */
    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.println("Usage: A6FeedbackExtractor <grader> <CSV_file>");
            System.exit(1);
        }
        final String grader = args[0];
        final String filename = args[1];

        try {
            final A6FeedbackExtractor extractor =
                A6FeedbackExtractor.fromFile(filename);
            extractor.writeFeedbackFiles(grader);
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Not all feedback files may have been written");
            System.exit(1);
        }
    }
}
