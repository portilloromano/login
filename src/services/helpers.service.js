export const parseDate = (dateStr) => {
    let year = dateStr.slice(0, 4);
    let month = dateStr.slice(5, 7);
    let day = dateStr.slice(8, 10);
    let time = dateStr.slice(11, 16);

    return `${year}/${month}/${day} ${time}`
};