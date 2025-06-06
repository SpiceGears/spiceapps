export interface UserInfo 
{
    Id: string,
    FirstName: string
    LastName: string
    Email: string
    Roles: Role[]
    Department: Department
    Birthday: Date
    Coins: Number
    CreatedAt: Date
    LastLogin: Date
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