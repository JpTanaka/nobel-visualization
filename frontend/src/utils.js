import moment from "moment";

export const calculateAge = (birthDate, awardDate, awardYear) => {
    return awardDate.length ? moment(awardDate).diff(moment(birthDate), "years") : parseInt(awardYear) - parseInt(birthDate.slice(0, 4));
}