export const Optional = (property: any, condition?: any | null, value?: any): Record<any, any> => 
    (condition ?? false ) ? { [property]: value } : {};

