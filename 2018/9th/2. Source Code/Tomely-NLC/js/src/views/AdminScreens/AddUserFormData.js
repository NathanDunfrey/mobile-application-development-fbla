import t from "tcomb-form-native"; // 0.6.9
import moment from "moment";

export const MyDateFormat = (format, date) => {
  return moment(date).format(format);
};

export const GradeLevelEnum = t.enums({
  "9": "9",
  "10": "10",
  "11": "11",
  "12": "12"
});

export const GenderEnum = t.enums({
  MALE: "MALE",
  FEMALE: "FEMALE"
});

export const SchoolEnum = t.enums({
  Middleton: "Middleton"
});

export const MemberTypeEnum = t.enums({
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN"
});

// here we are: define your domain model
export const UserProfileSchema = t.struct({
  email: t.String,
  phone: t.String,
  password: t.String,
  id_number: t.String, // a required string
  first_name: t.String, // a required string
  last_name: t.String, // a required number
  school: SchoolEnum,
  gender: GenderEnum,
  birth_date: t.Date,
  member_type: MemberTypeEnum,
  grade_level: GradeLevelEnum, // enum
  image_url: t.String,
  created: t.maybe(t.Date),
  created_by: t.maybe(t.String),
  updated: t.maybe(t.Date),
  updated_by: t.maybe(t.String)
});

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

export const TcombOptions = {
  stylesheet: stylesheet,
  fields: {
    id_number: {
      label: "ID Number"
    },
    first_name: {
      label: "First Name"
    },
    school: {
      label: "High School"
    },
    last_name: {
      label: "Last Name"
    },
    member_type: {
      label: "Member Type"
    },
    birth_date: {
      label: "Date of Birth",
      mode: "date",
      config: {
        format: date => MyDateFormat("MM/DD/YYYY", date)
      }
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
    },
    password: {
      label: "Password",
      password: true,
      secureTextEntry: true,
      blurOnSubmit: true,
      autoCorrect: false,
      autoCapitalize: "none"
    },
    image_url: {
      label: "Image URL"
    },
    grade_level: {
      label: "Grade Level"
    }
  }
};
