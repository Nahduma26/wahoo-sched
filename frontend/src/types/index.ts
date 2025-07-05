export interface Course {
    id: number;
    name: string;
    subject: string;
    code: string;
    description: string;
    professor: string;
    credits: number;
    days: string[]; 
    startTime: string; 
    endTime: string;   
    gen_eds: string[]; 
    status: 'Open' | 'Closed' | 'Waitlisted'; 
  }