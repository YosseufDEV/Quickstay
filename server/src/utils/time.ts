const accepetedClassifiers = new Map([
    ['d', 24 * 60 * 60 * 1000],
    ['h', 60 * 60 * 1000],
    ['m', 60 * 1000],
    ['s', 1000],
    ['ms', 1]
])

export function turnIntoTimestamp(time: string) {
    const [quantitiy, classifer] = [parseInt(time.slice(0, -1)), time.slice(-1)];
    const keys = [...accepetedClassifiers.keys()];

    if(!quantitiy || !classifer) throw new Error("Invalid time format. Expected format: 'quantity:classifier'");
    if(!keys.includes(classifer)) throw new Error(`Invalid classifier. Accepted classifiers are: ${[...accepetedClassifiers.keys()].join(", ")}`);

    return quantitiy * accepetedClassifiers.get(classifer);
}

