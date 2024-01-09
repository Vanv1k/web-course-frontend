export const validatePrice = (price : string) => {
    if (parseInt(price)) {
        return true;
    }
    return false;
}

export const validateDesc = (desc : string) => {
    if (desc) {
        return true;
    }
    return false;
}

export const validateName = (name : string) => {
    if (name) {
        return true;
    }
    return false;
}