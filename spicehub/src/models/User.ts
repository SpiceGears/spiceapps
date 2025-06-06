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
    RoleID: string,
    Name: string,
    Scopes: string[]
    Department: Department
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