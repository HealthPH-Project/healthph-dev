const symptomsToBeCapitalized = ["covid", "tb"];

const capitalizeSymptom = (keyword) => {
  if (symptomsToBeCapitalized.includes(keyword)) {
    return keyword.toUpperCase();
  }

  return keyword;
};

export default capitalizeSymptom;
