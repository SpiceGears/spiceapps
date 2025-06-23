export interface ErrorRes 
{
    error: string;
    description:  string;
    code: string;
    innerErrors: ErrorRes[]
}