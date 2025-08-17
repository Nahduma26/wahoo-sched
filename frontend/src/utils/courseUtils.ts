import { form } from 'framer-motion/client';
import type { CourseSection, CourseGroup } from '../types';

export function convertJsonToGroup(json: any): CourseGroup[] {
    const courseGroups: CourseGroup[] = [];
    const courseMap: { [key: string]: CourseGroup } = {};

    json.forEach((course: any) => {
        const { subject, name, catalog_number, sections } = course;
        const key = `${subject}-${catalog_number}`;

        if (!courseMap[key]) {
            courseMap[key] = {
                subject,
                catalog_number,
                name,
                sections: []
            };
            courseGroups.push(courseMap[key]);
        }

        sections.forEach((section: CourseSection) => {
            courseMap[key].sections.push(section);
        });
    });

    return courseGroups;
}