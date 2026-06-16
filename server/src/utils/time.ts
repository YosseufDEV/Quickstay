const acceptedClassifiers = {
    d: 24 * 60 * 60 ,
    h: 60 * 60 ,
    m: 60,
    s: 1,
}

export function turnIntoTimestamp(time: string, conversionType: "s" | "ms" = "ms") {
    const [quantitiy, classifer] = [parseFloat(time.slice(0, -1)), time.slice(-1).toLowerCase() as "d" || "h" || "m" || "s" || "ms"];
    if(!quantitiy || !classifer) throw new Error("Invalid time format. Expected format: 'quantity:classifier'");
    if(!acceptedClassifiers[classifer]) throw new Error(`Invalid classifier. Accepted classifiers are: ${Object.keys(acceptedClassifiers).join(", ")}`);

    return quantitiy * acceptedClassifiers[classifer]! * (conversionType=="ms" ? 1000 : 1);
}

