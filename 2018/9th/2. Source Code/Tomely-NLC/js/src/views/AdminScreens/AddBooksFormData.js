import t from "tcomb-form-native"; // 0.6.9
import moment from "moment";

export const Form = t.form.Form;
// clone the default stylesheet
export const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
stylesheet.controlLabel.normal.width = 120;

stylesheet.select.normal.borderWidth = 2;
stylesheet.select.normal.flex = 1;
stylesheet.select.normal.width = 200;
stylesheet.select.normal.backgroundColor = "#f0f1f1";

stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.normal.flexDirection = "row";
stylesheet.formGroup.error.flexDirection = "row";

stylesheet.datepicker.normal.width = 200;
stylesheet.datepicker.normal.flex = 1;

stylesheet.textbox.normal.flex = 1;
stylesheet.textbox.error.flex = 1;
stylesheet.textbox.normal.width = 190;
stylesheet.textbox.normal.paddingLeft = 10;

export const MyDateFormat = (format, date) => {
  return moment(date).format(format);
};

export const IsleEnum = t.enums({
  A1: "A1",
  A2: "A2",
  A3: "A3",
  B1: "B1",
  B2: "B2",
  B3: "B3",
  C1: "C1",
  C2: "C2",
  C3: "C3",
  D1: "D1",
  D2: "D2",
  D3: "D3",
  E1: "E1",
  E2: "E2",
  E3: "E3",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  G1: "G1",
  G2: "G2",
  G3: "G3",
  H1: "H1",
  H2: "H2",
  H3: "H3",
  I1: "I1",
  I2: "I2",
  I3: "I3"
});

export const AgeRangeEnum = t.enums({
  "12+": "12+",
  "13+": "13+",
  "14+": "14+",
  "15+": "15+",
  "16+": "16+"
});

export const ConditionEnum = t.enums({
  GOOD: "GOOD",
  NEW: "NEW",
  BAD: "BAD",
  MODERATE: "MODERATE"
});

export const EditionEnum = t.enums({
  PAPERBACK: "PAPERBACK",
  HARDCOVER: "HARDCOVER"
});

export const GenreEnum = t.enums({
  "ADVENTURE FICTION": "ADVENTURE FICTION",
  ALLEGORY: "ALLEGORY",
  DRAMA: "DRAMA",
  "EPIC POETRY": "EPIC POETRY",
  "EPISTOLARY NOVEL": "EPISTOLARY NOVEL",
  "FANTASY FICTION": "FANTASY FICTION",
  GUIDE: "GUIDE",
  "HISTORICAL FICTION": "HISTORICAL FICTION",
  "LITERARY REALISM": "LITERARY REALISM",
  NATURALISM: "NATURALISM",
  NOVELLA: "NOVELLA",
  "POLITICAL SATIRE": "POLITICAL SATIRE",
  ROMANCE: "ROMANCE",
  ROMANTICISM: "ROMANTICISM",
  "SCIENCE FICTION": "SCIENCE FICTION",
  TRAGEDY: "TRAGEDY",
  "UTOPIAN AND DYSTOPIAN FICTION": "UTOPIAN AND DYSTOPIAN FICTION",
  "YOUNG ADULT FICTION": "YOUNG ADULT FICTION"
});

// here we are: define your domain model
export const BooksModelSchema = t.struct({
  title: t.String, // a required string
  author: t.String,
  isbn: t.String, // a required number
  edition: EditionEnum,
  genre: t.String,
  new_arrival: t.Boolean,
  status: t.String,
  condition: ConditionEnum, // enum
  isle: IsleEnum,
  num_of_pages: t.Number,
  age_range: AgeRangeEnum,
  image_url: t.String,
  preview_url: t.String,
  created: t.String, // hidden field
  created_by: t.String, // hidden field
  updated: t.String,
  updated_by: t.String
});

export const TcombOptions = {
  stylesheet: stylesheet,
  fields: {
    new_arrival: {
      label: "New Arrival"
    },
    status: {
      label: "Status",
      hidden: true
    },
    image_url: {
      label: "Image URL"
    },
    preview_url: {
      label: "Preview URL"
    },
    isbn: {
      label: "ISBN"
    },
    num_of_pages: {
      label: "Number of Pages"
    },
    age_range: {
      label: "Age Range"
    },
    created: {
      hidden: true
    },
    created_by: {
      hidden: true
    },
    updated: {
      hidden: true
    },
    updated_by: {
      hidden: true
    }
  }
};
