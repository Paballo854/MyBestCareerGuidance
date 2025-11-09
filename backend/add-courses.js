const { db } = require('./src/config/firebase');

const sampleCourses = [
    {
        id: 'course1',
        name: 'BSc in Information Technology',
        institution: 'Limkokwing University',
        faculty: 'Faculty of ICT',
        duration: '4 years',
        requirements: 'High school diploma with Math and Science',
        description: 'Comprehensive IT degree covering programming, networking, and systems analysis.',
        availableSeats: 50,
        applicationDeadline: '2024-12-31',
        tuitionFee: 'M45,000 per year',
        intake: 'January 2024'
    },
    {
        id: 'course2', 
        name: 'BSc in Business Information Technology',
        institution: 'Limkokwing University',
        faculty: 'Faculty of ICT',
        duration: '4 years',
        requirements: 'High school diploma with Commerce subjects',
        description: 'Blend of business management and information technology skills.',
        availableSeats: 40,
        applicationDeadline: '2024-12-31',
        tuitionFee: 'M42,000 per year',
        intake: 'January 2024'
    },
    {
        id: 'course3',
        name: 'Diploma in Information Technology',
        institution: 'Limkokwing University', 
        faculty: 'Faculty of ICT',
        duration: '2 years',
        requirements: 'High school certificate',
        description: 'Foundation diploma for IT careers and further studies.',
        availableSeats: 60,
        applicationDeadline: '2024-12-31',
        tuitionFee: 'M28,000 per year',
        intake: 'January 2024'
    },
    {
        id: 'course4',
        name: 'Computer Science Degree',
        institution: 'National University of Lesotho',
        faculty: 'Science and Technology',
        duration: '4 years',
        requirements: 'High school diploma with excellent Math grades',
        description: 'Advanced programming and computer science theory.',
        availableSeats: 30,
        applicationDeadline: '2024-11-30',
        tuitionFee: 'M38,000 per year',
        intake: 'August 2024'
    }
];

const addSampleCourses = async () => {
    try {
        console.log('Adding sample courses to database...');
        
        for (const course of sampleCourses) {
            await db.collection('courses').doc(course.id).set(course);
            console.log(`✓ Added course: ${course.name}`);
        }
        
        console.log('✅ All sample courses added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding courses:', error);
        process.exit(1);
    }
};

// Run the function
addSampleCourses();
