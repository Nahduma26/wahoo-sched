export interface CourseSection {
  subject: string;
  catalog_number: string;
  
  name: string; 
  credits: string;

  id: number;
  section: string;
  professor: string;
  days: string[];
  startTime: string;
  endTime: string;
  status: 'Open' | 'Closed' | 'Waitlisted';
}


export interface CourseGroup {
  subject: string;
  catalog_number: string;
  name: string;
  
  sections: CourseSection[]; 
}