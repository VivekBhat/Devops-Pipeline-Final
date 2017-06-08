package test.detector;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

class UselessTestDetector {
	Set<String> uselessTests;
	Set<String> failedTests;
	// private static final String NextBuildNumber =
	// "/var/lib/jenkins/jobs/iTrust-Fuzzer/nextBuildNumber";
	private static final int maxHistory = 100;
	private static final String NextBuildNumber = "/var/lib/jenkins/jobs/iTrust-Fuzzer/nextBuildNumber";
	private static final String BuildDir = "/var/lib/jenkins/jobs/iTrust-Fuzzer/builds/";
	private static final String JunitFile = "junitResult.xml";

	public UselessTestDetector() {
		uselessTests = new HashSet<String>();
		failedTests = new HashSet<String>();
	}

	private int getNextBuildNumber() {
		int latestBuildNum = 0;
		try (BufferedReader br = new BufferedReader(new FileReader(NextBuildNumber))) {

			latestBuildNum = Integer.valueOf(br.readLine());

		} catch (IOException e) {
			e.printStackTrace();
		}
		return latestBuildNum;
	}

	private void calculate(String path, boolean isFirstRun) {
		SAXParserFactory factory = SAXParserFactory.newInstance();
		try {
			SAXParser saxParser = factory.newSAXParser();
			DefaultHandler handler = new DefaultHandler() {
				boolean className = false;
				boolean testName = false;
				boolean failedSince = false;
				String result = "";

				public void startElement(String uri, String localName, String qName, Attributes attributes)
						throws SAXException {

					if (qName.equalsIgnoreCase("className")) {
						className = true;
					}

					if (qName.equalsIgnoreCase("testName")) {
						testName = true;
					}

					if (qName.equalsIgnoreCase("failedSince")) {
						failedSince = true;
					}

				}

				public void endElement(String uri, String localName, String qName) throws SAXException {

				}

				public void characters(char ch[], int start, int length) throws SAXException {

					if (className) {
						result = result + new String(ch, start, length);
						className = false;
					}
					if (testName) {
						result = result + "." + new String(ch, start, length);
						testName = false;
					}
					if (failedSince) {
						Integer value = Integer.valueOf(new String(ch, start, length));
						if (value == 0 && isFirstRun) {
							uselessTests.add(result);
						} else if (value != 0) {
							uselessTests.remove(result);
							failedTests.add(result);
						}
						result = "";
						failedSince = false;
					}

				}
			};
			saxParser.parse(path, handler);

		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public void run() {
		int lastBuildNum = getNextBuildNumber() - 1;
		int lastBuildNum2 = lastBuildNum;
		int histCount = maxHistory;
		if (lastBuildNum > 0) {
			calculate(BuildDir + lastBuildNum + "/" + JunitFile, true);
			lastBuildNum--;
			histCount--;
			while (lastBuildNum > 0 && histCount > 0) {
				calculate(BuildDir + lastBuildNum + "/" + JunitFile, false);
				lastBuildNum--;
				histCount--;
			}
			if (histCount == 0)
				createAnalysisReport(100);
			else {
				createAnalysisReport(lastBuildNum2);
			}
		}

	}

	private void createAnalysisReport(int count) {
		int lastBuildNum = getNextBuildNumber() - 1;
		try {
			BufferedWriter out = new BufferedWriter(new FileWriter(BuildDir + lastBuildNum + "/UselessTests.txt"));
			out.write("\n******************************************\n");
			System.out.println("Number of Useless Tests : " + uselessTests.size() + " \n");
			System.out.println("Number of Failed Tests : " + failedTests.size() + " \n");
			out.write("\n******************************************\n");

			Iterator<String> it = uselessTests.iterator();
			out.write("\n******************************************\n");
			out.write("Current Build Number : " + lastBuildNum + " \n");
			out.write("Number of builds analyzed : " + count + " \n");
			out.write("******************************************\n");
			out.write("******************************************\n");
			out.write("******************************************\n");
			out.write("Number of Useless Tests : " + uselessTests.size() + " \n");
			while (it.hasNext()) {

				out.write(it.next() + "\n");

			}
			out.write("******************************************\n");
			out.write("******************************************\n");
			out.write("Number of Failed Tests : " + failedTests.size() + " \n");

			it = failedTests.iterator();
			while (it.hasNext()) {

				out.write(it.next() + "\n");

			}

			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}

public class UselessTestDetectorMain {

	public static void main(String[] args) {
		UselessTestDetector test = new UselessTestDetector();
		test.run();
	}

}
