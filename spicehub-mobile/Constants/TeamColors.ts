export enum Department {
  MECHANICS    = 'mechanics',
  PROGRAMMERS  = 'programmers',
  SOCIALMEDIA  = 'socialmedia',
  EXECUTIVE    = 'executive',
  MARKETING    = 'marketing',
  NEUTRAL      = 'neutral',
}

export const DepartmentColors: Record<Department, string> = {
  [Department.MECHANICS]:   '#38b6ff',
  [Department.PROGRAMMERS]: '#7ed957',
  [Department.SOCIALMEDIA]: '#df0089',
  [Department.EXECUTIVE]:   '#f4ca24',
  [Department.MARKETING]:   '#4718a4',
  [Department.NEUTRAL]:     '#a8a8a8',
};