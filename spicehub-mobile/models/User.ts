export interface UserInfo 
{
    id: string,
    firstName: string
    lastName: string
    email: string
    roles: Role[]
    department: Department
    birthday: Date
    coins: Number
    createdAt: Date
    lastLogin: Date
}

export interface Role 
{
    roleID: string,
    name: string,
    scopes: string[]
    department: Department
}

export enum Department 
{
    NaDr = 0, //not a department specific role
Programmers = 2,
Mechanics = 1,
SocialMedia = 3,
Marketing = 4,
Executive = 6,
Mentor = 10,

}

export function getDepartmentScope(department: Department): string | undefined {
    switch (department) {
        case Department.NaDr:
            return undefined;
        case Department.Programmers:
            return "department.programmers";
        case Department.Mechanics:
            return "department.mechanics";
        case Department.SocialMedia:
            return "department.socialmedia";
        case Department.Marketing:
            return "department.marketing";
        case Department.Executive:
            return "department.executive";
        case Department.Mentor:
            return "department.mentor";
        // Add more cases as needed for other departments
        default:
            return undefined;
    }
}