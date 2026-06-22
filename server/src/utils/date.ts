const parseTSRangeToDates = (tsrange: string) => {
    if(!tsrange || typeof tsrange !== 'string') {
        throw new Error(`Invalid tsrange format or type`);
    }

    const regex = /^[\[(]"?([^",)]*)"?,"?([^",)\]]*)"?[\])]$/;
    const match = tsrange.match(regex);

    if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid tsrange format: ${tsrange}`);
    }

    return {
        from: new Date(match[1]),
        to: new Date(match[2])
    };
}

export { parseTSRangeToDates };
