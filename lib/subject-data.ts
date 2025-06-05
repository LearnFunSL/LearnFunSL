export interface GroupedSubjects {
  compulsory: string[];
  optionalGroup1: string[];
  optionalGroup2: string[];
  optionalGroup3: string[];
}

export const gradePastPaperSubjects: Record<string, GroupedSubjects> = {
  "grade-10": {
    compulsory: ["Tamil", "Sinhala", "Religion", "English", "Mathematics", "Science", "History"],
    optionalGroup1: ["Business & Accounting", "Geography", "Civic Education", "Entrepreneurship", "Sinhala (SL)", "Tamil (SL)"],
    optionalGroup2: ["Art", "Music", "Dance", "Drama & Theatre", "Tamil Literature", "English Literature", "Sinhala Literature"],
    optionalGroup3: ["ICT", "Agriculture & Food Tech", "Home Economics", "Health & Physical Ed."],
  },
  "grade-11": {
    compulsory: ["Tamil", "Sinhala", "Religion", "English", "Mathematics", "Science", "History"],
    optionalGroup1: ["Business & Accounting", "Geography", "Civic Education", "Entrepreneurship", "Sinhala (SL)", "Tamil (SL)"],
    optionalGroup2: ["Art", "Music", "Dance", "Drama & Theatre", "Tamil Literature", "English Literature", "Sinhala Literature"],
    optionalGroup3: ["ICT", "Agriculture & Food Tech", "Home Economics", "Health & Physical Ed."],
  },
};

export interface StreamedSubjects {
  [streamName: string]: string[];
}

export const gradeStreamSubjects: Record<string, StreamedSubjects> = {
  "grade-12": {
    "Physical Science Stream": ["Combined Mathematics", "Physics", "Chemistry", "ICT"],
    "Bio Science Stream": ["Biology", "Chemistry", "Physics", "Agricultural Science"],
    "Commerce Stream": ["Business Studies", "Accounting", "Economics", "Business Statistics", "ICT"],
    "Arts Stream": [
      "Buddhism", "Hinduism", "Islam", "Christianity",
      "Buddhist Civilization", "Hindu Civilization", "Islam Civilization", "Christian Civilization",
      "Sinhala", "Tamil", "English",
      "Political Science", "History", "Geography",
      "Dancing", "Music", "Drama", "Art",
      "Home Science"
    ],
    "Technology Stream": ["Engineering Technology", "Science for Technology", "Bio-system Technology", "ICT"],
  },
  "grade-13": {
    "Physical Science Stream": ["Combined Mathematics", "Physics", "Chemistry", "ICT"],
    "Bio Science Stream": ["Biology", "Chemistry", "Physics", "Agricultural Science"],
    "Commerce Stream": ["Business Studies", "Accounting", "Economics", "Business Statistics", "ICT"],
    "Arts Stream": [
      "Buddhism", "Hinduism", "Islam", "Christianity",
      "Buddhist Civilization", "Hindu Civilization", "Islam Civilization", "Christian Civilization",
      "Sinhala", "Tamil", "English",
      "Political Science", "History", "Geography",
      "Dancing", "Music", "Drama", "Art",
      "Home Science"
    ],
    "Technology Stream": ["Engineering Technology", "Science for Technology", "Bio-system Technology", "ICT"],
  },
};

export const gradeTextbookSubjects: Record<string, string[]> = {
  "grade-1": ["Tamil", "Sinhala", "Hinduism", "Buddhism", "Christianity", "English", "Maths", "Environmental Studies"],
  "grade-2": ["Tamil", "Sinhala", "Hinduism", "Buddhism", "Christianity", "English", "Maths", "Environmental Studies"],
  "grade-3": ["Tamil", "Sinhala", "Hinduism", "Buddhism", "Christianity", "English", "Maths", "Environmental Studies"],
  "grade-4": ["Tamil", "Sinhala", "Hinduism", "Buddhism", "Christianity", "English", "Maths", "Environmental Studies"],
  "grade-5": ["Tamil", "Sinhala", "Hinduism", "Buddhism", "Christianity", "English", "Maths", "Environmental Studies"],
  "grade-6": ["Tamil", "Sinhala", "English Language", "Mathematics", "Science", "History", "Religion", "Geography", "Civic Education", "ICT", "PTS", "Health & Physical Ed.", "Second Language (Tamil/Sinhala)", "Art", "Music", "Dance", "Drama"],
  "grade-7": ["Tamil", "Sinhala", "English Language", "Mathematics", "Science", "History", "Religion", "Geography", "Civic Education", "ICT", "PTS", "Health & Physical Ed.", "Second Language (Tamil/Sinhala)", "Art", "Music", "Dance", "Drama"],
  "grade-8": ["Tamil", "Sinhala", "English Language", "Mathematics", "Science", "History", "Religion", "Geography", "Civic Education", "ICT", "PTS", "Health & Physical Ed.", "Second Language (Tamil/Sinhala)", "Art", "Music", "Dance", "Drama"],
  "grade-9": ["Tamil", "Sinhala", "English Language", "Mathematics", "Science", "History", "Religion", "Geography", "Civic Education", "ICT", "PTS", "Health & Physical Ed.", "Second Language (Tamil/Sinhala)", "Art", "Music", "Dance", "Drama"],
};
