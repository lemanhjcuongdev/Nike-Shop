export const dateConverter = (raw_date) => {
    const date = new Date(raw_date);

    return date.toLocaleDateString();
};
