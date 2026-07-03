export const Optional = (property: any, condition?: any | undefined, value?: any): Record<any, any> => (condition ? condition : property) ? { [property]: value || property } : {};

