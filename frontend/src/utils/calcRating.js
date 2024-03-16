const calcRating = (rating) => {
    let sum  = 0;
    rating.forEach(element => {
        sum += element.value;
    });
    return sum / rating.length;
}

export default calcRating;
